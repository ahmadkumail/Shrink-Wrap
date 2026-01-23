import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Upload, Download, Check, ArrowRight, Image, FileImage, RefreshCw, X, DownloadCloud, Video, Play, Clock, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

type ConversionType = "compress" | "png-to-jpg" | "jpg-to-png" | "video" | "doc-to-pdf";
type CompressionLevel = "low" | "medium" | "high";
type OutputFormat = "jpg" | "png" | "webp";
type VideoResolution = "720" | "1080";

interface PendingFile {
  file: File;
  compressionLevel: CompressionLevel;
  outputFormat: OutputFormat;
}

interface PendingVideoFile {
  file: File;
  resolution: VideoResolution;
}

interface PendingDocFile {
  file: File;
}

interface ConversionResult {
  fileName: string;
  originalSize: number;
  convertedSize?: number;
  isProcessing: boolean;
  progress: number;
  downloadUrl?: string;
  downloadName?: string;
  error?: string;
  type?: "image" | "video";
}

interface ConverterToolProps {
  remainingUploads: number;
  dailyLimit: number;
  onUsageIncrement: (count: number) => void;
  onLimitReached: () => void;
}

const TABS: { id: ConversionType; label: string; icon: React.ReactNode; accept: string; description: string }[] = [
  { id: "compress", label: "Compress", icon: <RefreshCw className="w-4 h-4" />, accept: "image/*", description: "Reduce image size" },
  { id: "png-to-jpg", label: "PNG → JPG", icon: <FileImage className="w-4 h-4" />, accept: ".png,image/png", description: "Convert PNG to JPG" },
  { id: "jpg-to-png", label: "JPG → PNG", icon: <Image className="w-4 h-4" />, accept: ".jpg,.jpeg,image/jpeg", description: "Convert JPG to PNG" },
  { id: "video", label: "Video", icon: <Video className="w-4 h-4" />, accept: "video/*", description: "Fast WebM compression" },
  { id: "doc-to-pdf", label: "DOC → PDF", icon: <FileText className="w-4 h-4" />, accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document", description: "Convert Word to PDF" },
];

const COMPRESSION_QUALITY: Record<CompressionLevel, number> = {
  low: 0.5,
  medium: 0.75,
  high: 0.92,
};

const VIDEO_BITRATE: Record<VideoResolution, string> = {
  "720": "1500k",
  "1080": "3000k",
};

const getTimeUntilReset = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diff = tomorrow.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const ConverterTool = ({ remainingUploads, dailyLimit, onUsageIncrement, onLimitReached }: ConverterToolProps) => {
  const [activeTab, setActiveTab] = useState<ConversionType>("compress");
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [pendingVideoFiles, setPendingVideoFiles] = useState<PendingVideoFile[]>([]);
  const [pendingDocFiles, setPendingDocFiles] = useState<PendingDocFile[]>([]);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [timeUntilReset, setTimeUntilReset] = useState(getTimeUntilReset());
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [ffmpegLoading, setFfmpegLoading] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilReset(getTimeUntilReset());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Listen for selectVideoTab event to auto-switch to video tab (legacy support)
  useEffect(() => {
    const handleSelectVideoTab = () => {
      setActiveTab("video");
      setResults([]);
      setPendingFiles([]);
      setPendingVideoFiles([]);
      setPendingDocFiles([]);
    };

    window.addEventListener("selectVideoTab", handleSelectVideoTab);
    return () => window.removeEventListener("selectVideoTab", handleSelectVideoTab);
  }, []);

  // Listen for generic selectTab event to switch to any tab
  useEffect(() => {
    const handleSelectTab = (event: CustomEvent<{ tab: ConversionType }>) => {
      const tab = event.detail?.tab;
      if (tab && ["compress", "convert", "video", "doc-to-pdf"].includes(tab)) {
        setActiveTab(tab);
        setResults([]);
        setPendingFiles([]);
        setPendingVideoFiles([]);
        setPendingDocFiles([]);
      }
    };

    window.addEventListener("selectTab", handleSelectTab as EventListener);
    return () => window.removeEventListener("selectTab", handleSelectTab as EventListener);
  }, []);

  // Load FFmpeg - using single-threaded version for browser compatibility
  const loadFFmpeg = async () => {
    if (ffmpegRef.current && ffmpegLoaded) return ffmpegRef.current;
    
    setFfmpegLoading(true);
    try {
      const ffmpeg = new FFmpeg();
      
      ffmpeg.on("log", ({ message }) => {
        console.log("[FFmpeg]", message);
      });
      
      // Use single-threaded core (no SharedArrayBuffer needed)
      // Prefer same-origin bundled core/wasm (most reliable). Fall back to CDNs.
      // Add timeouts so UI never gets stuck on "Loading...".
      const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
        let timeoutId: number | undefined;
        const timeout = new Promise<never>((_, reject) => {
          timeoutId = window.setTimeout(() => reject(new Error(`${label} timed out`)), ms);
        });
        return Promise.race([promise, timeout]).finally(() => {
          if (timeoutId) window.clearTimeout(timeoutId);
        }) as Promise<T>;
      };

      let loaded = false;
      let lastError: unknown = null;

      // Use CDN with blob URLs (avoids dynamic import issues)
      const cdnBaseUrls = [
        "https://cdn.jsdelivr.net/npm/@ffmpeg/core-st/dist/umd",
        "https://unpkg.com/@ffmpeg/core-st/dist/umd",
      ];

      for (const baseURL of cdnBaseUrls) {
        try {
          const cdnCoreURL = await withTimeout(
            toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
            30000,
            "FFmpeg core fetch"
          );
          const cdnWasmURL = await withTimeout(
            toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            30000,
            "FFmpeg wasm fetch"
          );
          await withTimeout(
            ffmpeg.load({ coreURL: cdnCoreURL, wasmURL: cdnWasmURL }),
            30000,
            "FFmpeg engine load"
          );
          lastError = null;
          loaded = true;
          break;
        } catch (e) {
          console.error("FFmpeg load attempt failed:", baseURL, e);
          lastError = e;
        }
      }

      if (!loaded && lastError) throw lastError;

      ffmpegRef.current = ffmpeg;
      setFfmpegLoaded(true);
      return ffmpeg;
    } catch (error) {
      console.error("Failed to load FFmpeg:", error);
      throw new Error("Failed to load video processor. Please try again.");
    } finally {
      setFfmpegLoading(false);
    }
  };


  const activeTabConfig = TABS.find((t) => t.id === activeTab)!;

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const convertImage = async (
    file: File, 
    compressionLevel: CompressionLevel,
    outputFormat: OutputFormat
  ): Promise<{ blob: Blob; extension: string }> => {
    const img = await loadImage(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    // For PNG output, we need transparent background; for JPG we fill white
    if (outputFormat === "png") {
      // Keep transparent
    } else {
      // Fill white for JPG/WebP output
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    const mimeTypes: Record<OutputFormat, string> = {
      jpg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };

    const quality = COMPRESSION_QUALITY[compressionLevel];

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
        mimeTypes[outputFormat],
        quality
      );
    });

    return { blob, extension: outputFormat };
  };

  // Video compression (fast, no-audio) using canvas capture + MediaRecorder.
  // NOTE: We do extra cleanup + timeouts so repeated runs don't get stuck.
  const compressVideo = async (
    file: File,
    resolution: VideoResolution,
    onProgress: (progress: number) => void
  ): Promise<{ blob: Blob; extension: string }> => {
    const targetHeight = resolution === "720" ? 720 : 1080;
    const targetBitrate = resolution === "720" ? 1_500_000 : 3_000_000;

    // Create a fresh file blob to avoid any caching issues
    const freshBlob = new Blob([await file.arrayBuffer()], { type: file.type });
    const objectUrl = URL.createObjectURL(freshBlob);

    let rafId: number | null = null;
    let stream: MediaStream | null = null;
    let recorder: MediaRecorder | null = null;
    let videoEl: HTMLVideoElement | null = null;
    let isCleanedUp = false;

    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;

      try {
        if (rafId != null) cancelAnimationFrame(rafId);
      } catch { /* ignore */ }
      rafId = null;

      try {
        if (recorder && recorder.state !== "inactive") recorder.stop();
      } catch { /* ignore */ }
      recorder = null;

      try {
        stream?.getTracks().forEach((t) => t.stop());
      } catch { /* ignore */ }
      stream = null;

      if (videoEl) {
        try {
          videoEl.pause();
          videoEl.onloadedmetadata = null;
          videoEl.onerror = null;
          videoEl.onended = null;
          videoEl.ontimeupdate = null;
          videoEl.onstalled = null;
          videoEl.removeAttribute("src");
          videoEl.load();
        } catch { /* ignore */ }
        videoEl = null;
      }
    };

    try {
      videoEl = document.createElement("video");
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.preload = "auto"; // Changed to auto for better loading
      videoEl.crossOrigin = "anonymous";

      // Load video metadata with timeout
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Video load timeout")), 30000);
        
        videoEl!.onloadedmetadata = () => {
          clearTimeout(timeout);
          resolve();
        };
        videoEl!.onerror = () => {
          clearTimeout(timeout);
          reject(new Error("Failed to load video"));
        };
        videoEl!.src = objectUrl;
        videoEl!.load(); // Explicitly call load
      });

      // Wait for video to be ready to play
      if (videoEl.readyState < 3) {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => resolve(), 10000); // Continue anyway after 10s
          videoEl!.oncanplay = () => {
            clearTimeout(timeout);
            resolve();
          };
          videoEl!.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("Video playback error"));
          };
        });
      }

      const duration = Number.isFinite(videoEl.duration) ? videoEl.duration : 0;
      if (duration <= 0) throw new Error("Could not determine video duration");

      const aspect =
        videoEl.videoWidth > 0 && videoEl.videoHeight > 0
          ? videoEl.videoWidth / videoEl.videoHeight
          : 16 / 9;

      const canvas = document.createElement("canvas");
      canvas.height = targetHeight;
      canvas.width = Math.max(2, Math.round(targetHeight * aspect));

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      stream = canvas.captureStream(30);

      const mimeCandidates = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ];
      const mimeType =
        mimeCandidates.find((m) => MediaRecorder.isTypeSupported?.(m)) || "video/webm";

      recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: targetBitrate,
      });

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const recordingDone = new Promise<void>((resolve) => {
        recorder!.onstop = () => resolve();
        recorder!.onerror = () => resolve(); // Don't reject, just resolve with what we have
      });

      recorder.start(500); // More frequent chunks for reliability

      let lastProgress = 0;

      // Draw frames while video is playing using timeupdate for reliability
      const updateProgress = () => {
        if (!videoEl || videoEl.paused || videoEl.ended) return;
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

        if (duration > 0) {
          const p = Math.min(99, Math.round((videoEl.currentTime / duration) * 100));
          if (p > lastProgress) {
            lastProgress = p;
            onProgress(p);
          }
        }
      };

      const drawLoop = () => {
        if (!videoEl || isCleanedUp) return;
        if (videoEl.paused || videoEl.ended) return;
        updateProgress();
        rafId = requestAnimationFrame(drawLoop);
      };

      // Also use timeupdate as backup for progress
      videoEl.ontimeupdate = updateProgress;

      // Handle stalled video
      videoEl.onstalled = () => {
        console.log("Video stalled, attempting to continue...");
      };

      // Start playback with retry
      let playAttempts = 0;
      const maxPlayAttempts = 3;
      
      while (playAttempts < maxPlayAttempts) {
        try {
          videoEl.currentTime = 0; // Reset to start
          await videoEl.play();
          break;
        } catch (playError) {
          playAttempts++;
          console.warn(`Play attempt ${playAttempts} failed:`, playError);
          if (playAttempts >= maxPlayAttempts) {
            throw new Error("Could not start video playback. Try again.");
          }
          await new Promise((r) => setTimeout(r, 500));
        }
      }

      rafId = requestAnimationFrame(drawLoop);

      // Wait for playback to complete with multiple fallbacks
      await new Promise<void>((resolve) => {
        let resolved = false;
        const finish = () => {
          if (resolved) return;
          resolved = true;
          resolve();
        };

        // Primary: onended event
        videoEl!.onended = finish;

        // Fallback 1: Check if currentTime reached duration
        const checkComplete = setInterval(() => {
          if (!videoEl) {
            clearInterval(checkComplete);
            finish();
            return;
          }
          if (videoEl.currentTime >= duration - 0.1 || videoEl.ended) {
            clearInterval(checkComplete);
            finish();
          }
        }, 500);

        // Fallback 2: Safety timeout (duration + buffer for processing)
        const safetyTimeout = setTimeout(() => {
          clearInterval(checkComplete);
          console.log("Safety timeout reached, finishing...");
          finish();
        }, Math.ceil((duration + 5) * 1000));

        // Cleanup on finish
        const originalFinish = finish;
        const cleanFinish = () => {
          clearInterval(checkComplete);
          clearTimeout(safetyTimeout);
          originalFinish();
        };
        videoEl!.onended = cleanFinish;
      });

      // Stop recording & wait for flush
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
      await recordingDone;

      onProgress(100);

      const blob = new Blob(chunks, { type: "video/webm" });
      if (blob.size === 0) throw new Error("Empty output (try a different video)");

      return { blob, extension: "webm" };
    } finally {
      cleanup();
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (remainingUploads <= 0) {
      onLimitReached();
      return;
    }

    const filesToAdd = files.slice(0, remainingUploads - pendingFiles.length - pendingVideoFiles.length - pendingDocFiles.length);
    
    // CRITICAL: Reset processing state when adding new files
    // This ensures button is clickable for second run
    setIsProcessing(false);
    
    // Clear previous results when adding new files so UI transitions properly
    if (results.length > 0) {
      // Revoke old download URLs to free memory
      results.forEach((r) => {
        if (r.downloadUrl) {
          try { URL.revokeObjectURL(r.downloadUrl); } catch { /* ignore */ }
        }
      });
      setResults([]);
    }
    
    // For video mode, add to pending video files with default settings
    if (activeTab === "video") {
      const newPendingVideos: PendingVideoFile[] = filesToAdd.map((file) => ({
        file,
        resolution: "720" as VideoResolution,
      }));
      setPendingVideoFiles((prev) => [...prev, ...newPendingVideos]);
      return;
    }

    // For doc-to-pdf mode, add to pending doc files
    if (activeTab === "doc-to-pdf") {
      const newPendingDocs: PendingDocFile[] = filesToAdd.map((file) => ({
        file,
      }));
      setPendingDocFiles((prev) => [...prev, ...newPendingDocs]);
      return;
    }

    // For image mode, add to pending with default settings
    const newPendingFiles: PendingFile[] = filesToAdd.map((file) => ({
      file,
      compressionLevel: "medium" as CompressionLevel,
      outputFormat: getDefaultFormat(file.name) as OutputFormat,
    }));

    setPendingFiles((prev) => [...prev, ...newPendingFiles]);
  };

  const getDefaultFormat = (fileName: string): OutputFormat => {
    const ext = fileName.toLowerCase().split('.').pop();
    if (activeTab === "png-to-jpg") return "jpg";
    if (activeTab === "jpg-to-png") return "png";
    if (ext === "png") return "png";
    if (ext === "webp") return "webp";
    return "jpg";
  };

  const processVideoFiles = async () => {
    if (pendingVideoFiles.length === 0) return;
    
    // Grab files before clearing state
    const filesToProcess = [...pendingVideoFiles];
    
    setIsProcessing(true);
    onUsageIncrement(filesToProcess.length);

    const newResults: ConversionResult[] = filesToProcess.map((pv) => ({
      fileName: pv.file.name,
      originalSize: pv.file.size,
      isProcessing: true,
      progress: 0,
      type: "video" as const,
    }));

    setResults(newResults);
    setPendingVideoFiles([]);

    try {
      for (let i = 0; i < filesToProcess.length; i++) {
        const pv = filesToProcess[i];
        try {
          const { blob, extension } = await compressVideo(pv.file, pv.resolution, (progress) => {
            setResults((prev) =>
              prev.map((r, idx) => (idx === i ? { ...r, progress } : r))
            );
          });

          const downloadUrl = URL.createObjectURL(blob);
          const baseName = pv.file.name.replace(/\.[^.]+$/, "");
          const downloadName = `${baseName}-${pv.resolution}p.${extension}`;

          setResults((prev) =>
            prev.map((r, idx) =>
              idx === i
                ? {
                    ...r,
                    isProcessing: false,
                    progress: 100,
                    convertedSize: blob.size,
                    downloadUrl,
                    downloadName,
                  }
                : r
            )
          );
        } catch (err) {
          console.error("Video processing error:", err);
          const message = err instanceof Error ? err.message : "Processing failed";
          setResults((prev) =>
            prev.map((r, idx) =>
              idx === i ? { ...r, isProcessing: false, progress: 100, error: message } : r
            )
          );
        }
      }
    } finally {
      // ALWAYS reset processing state, even if something went wrong
      setIsProcessing(false);
    }
  };

  const processImageFiles = async () => {
    if (pendingFiles.length === 0) return;
    
    setIsProcessing(true);
    onUsageIncrement(pendingFiles.length);

    const newResults: ConversionResult[] = pendingFiles.map((pf) => ({
      fileName: pf.file.name,
      originalSize: pf.file.size,
      isProcessing: true,
      progress: 0,
      type: "image" as const,
    }));

    setResults(newResults);
    setPendingFiles([]);

    for (let i = 0; i < pendingFiles.length; i++) {
      const pf = pendingFiles[i];
      try {
        let progress = 0;
        const interval = setInterval(() => {
          progress = Math.min(90, progress + Math.random() * 20);
          setResults((prev) =>
            prev.map((r, idx) => (idx === i ? { ...r, progress: Math.round(progress) } : r))
          );
        }, 150);

        const { blob, extension } = await convertImage(
          pf.file,
          pf.compressionLevel,
          pf.outputFormat
        );
        const downloadUrl = URL.createObjectURL(blob);
        const baseName = pf.file.name.replace(/\.[^.]+$/, "");
        const downloadName = `${baseName}-compressed.${extension}`;

        clearInterval(interval);
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? {
                  ...r,
                  isProcessing: false,
                  progress: 100,
                  convertedSize: blob.size,
                  downloadUrl,
                  downloadName,
                }
              : r
          )
        );
      } catch (err) {
        console.error("Image processing error:", err);
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? { ...r, isProcessing: false, progress: 100, error: "Processing failed" }
              : r
          )
        );
      }
    }
    setIsProcessing(false);
  };

  const processDocFiles = async () => {
    if (pendingDocFiles.length === 0) return;
    
    const filesToProcess = [...pendingDocFiles];
    
    setIsProcessing(true);
    onUsageIncrement(filesToProcess.length);

    const newResults: ConversionResult[] = filesToProcess.map((pd) => ({
      fileName: pd.file.name,
      originalSize: pd.file.size,
      isProcessing: true,
      progress: 0,
      type: "image" as const, // Using "image" type for doc conversion results display
    }));

    setResults(newResults);
    setPendingDocFiles([]);

    for (let i = 0; i < filesToProcess.length; i++) {
      const pd = filesToProcess[i];
      try {
        // Show indeterminate progress
        let progress = 0;
        const interval = setInterval(() => {
          progress = Math.min(90, progress + Math.random() * 15);
          setResults((prev) =>
            prev.map((r, idx) => (idx === i ? { ...r, progress: Math.round(progress) } : r))
          );
        }, 200);

        const formData = new FormData();
        formData.append('file', pd.file);

        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doc-to-pdf`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        });

        clearInterval(interval);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Conversion failed' }));
          throw new Error(errorData.error || 'Conversion failed');
        }

        const pdfBlob = await response.blob();
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const baseName = pd.file.name.replace(/\.[^.]+$/, "");
        const downloadName = `${baseName}.pdf`;

        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? {
                  ...r,
                  isProcessing: false,
                  progress: 100,
                  convertedSize: pdfBlob.size,
                  downloadUrl,
                  downloadName,
                }
              : r
          )
        );
      } catch (err) {
        console.error("DOC processing error:", err);
        const message = err instanceof Error ? err.message : "Processing failed";
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, isProcessing: false, progress: 100, error: message } : r
          )
        );
      }
    }
    setIsProcessing(false);
  };

  const isValidFile = (file: File, type: ConversionType): boolean => {
    const name = file.name.toLowerCase();
    const mime = file.type?.toLowerCase() || "";

    if (type === "video") {
      return mime.startsWith("video/") || /\.(mp4|webm|mov|avi|mkv)$/i.test(name);
    }
    if (type === "png-to-jpg") {
      return mime === "image/png" || name.endsWith(".png");
    }
    if (type === "jpg-to-png") {
      return mime === "image/jpeg" || name.endsWith(".jpg") || name.endsWith(".jpeg");
    }
    if (type === "doc-to-pdf") {
      return mime === "application/msword" || 
             mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
             name.endsWith(".doc") || name.endsWith(".docx");
    }
    // compress: any image
    return mime.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(name);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (selected.length === 0) return;

    const valid = selected.filter((f) => isValidFile(f, activeTab));
    if (valid.length === 0) {
      const fileType = activeTab === "video" ? "video" : activeTab === "png-to-jpg" ? "PNG" : activeTab === "jpg-to-png" ? "JPG" : activeTab === "doc-to-pdf" ? "DOC/DOCX" : "image";
      alert(`Please select a valid ${fileType} file.`);
      return;
    }
    handleFilesSelected(valid);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => isValidFile(f, activeTab));
      if (files.length > 0) handleFilesSelected(files);
    },
    [activeTab, remainingUploads, pendingFiles.length]
  );

  const handleDownload = (result: ConversionResult) => {
    if (!result.downloadUrl) return;
    const a = document.createElement("a");
    a.href = result.downloadUrl;
    a.download = result.downloadName || "converted-file";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadAll = () => {
    const completedResults = results.filter((r) => r.downloadUrl && !r.error && !r.isProcessing);
    completedResults.forEach((result, index) => {
      setTimeout(() => handleDownload(result), index * 150);
    });
  };

  const handleRemoveResult = (index: number) => {
    setResults((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemovePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemovePendingVideoFile = (index: number) => {
    setPendingVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePendingFile = (index: number, updates: Partial<PendingFile>) => {
    setPendingFiles((prev) =>
      prev.map((pf, i) => (i === index ? { ...pf, ...updates } : pf))
    );
  };

  const updatePendingVideoFile = (index: number, updates: Partial<PendingVideoFile>) => {
    setPendingVideoFiles((prev) =>
      prev.map((pv, i) => (i === index ? { ...pv, ...updates } : pv))
    );
  };

  const handleReset = () => {
    setPendingFiles([]);
    setPendingVideoFiles([]);
    setPendingDocFiles([]);
  };

  const handleRemovePendingDocFile = (index: number) => {
    setPendingDocFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getChangePercent = (original: number, converted: number) => {
    const change = Math.round(((original - converted) / original) * 100);
    return change;
  };

  const completedCount = results.filter((r) => r.downloadUrl && !r.error && !r.isProcessing).length;
  const isImageMode = activeTab !== "video" && activeTab !== "doc-to-pdf";
  const isDocMode = activeTab === "doc-to-pdf";
  const hasPendingFiles = pendingFiles.length > 0 || pendingVideoFiles.length > 0 || pendingDocFiles.length > 0;

  return (
    <div className="relative bg-card rounded-2xl shadow-elevated border border-border overflow-hidden">
      {/* Header with tabs */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-accent/60" />
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{remainingUploads}/{dailyLimit} remaining</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Resets in {timeUntilReset}
          </span>
        </div>
      </div>

      {/* Tabs - Pill Style */}
      <div className="px-4 py-4 bg-gradient-to-b from-secondary/50 to-transparent">
        <div className="flex gap-2 p-1.5 bg-secondary/80 rounded-xl backdrop-blur-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setResults([]);
                setPendingFiles([]);
                setPendingVideoFiles([]);
                setPendingDocFiles([]);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                activeTab === tab.id
                  ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60"
              )}
            >
              <span className={cn(
                "transition-transform duration-200",
                activeTab === tab.id && "scale-110"
              )}>
                {tab.icon}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Upload Area - Hide when files are pending */}
        {!hasPendingFiles && results.length === 0 && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-xl p-8 md:p-10 text-center transition-all cursor-pointer group active:scale-[0.98]",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={activeTabConfig.accept}
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all",
                isDragging ? "gradient-primary scale-110" : "bg-primary/10 group-hover:bg-primary/20"
              )}
            >
              <Upload
                className={cn(
                  "w-7 h-7 transition-colors",
                  isDragging ? "text-primary-foreground" : "text-primary"
                )}
              />
            </div>
            <p className="text-base font-medium text-foreground mb-1">
              {isDragging ? "Drop files here" : "Drop files or click to upload"}
            </p>
            <p className="text-sm text-muted-foreground">{activeTabConfig.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTab === "png-to-jpg" && "Only PNG files accepted"}
              {activeTab === "jpg-to-png" && "Only JPG/JPEG files accepted"}
              {activeTab === "compress" && "PNG, JPG up to 10MB"}
              {activeTab === "video" && "MP4, WebM, MOV up to 100MB"}
              {activeTab === "doc-to-pdf" && "DOC, DOCX files up to 10MB"}
            </p>
            {activeTab === "video" && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-primary/80">
                <Play className="w-3 h-3" />
                <span>Fast 720p/1080p WebM (no audio)</span>
              </div>
            )}
          </div>
        )}

        {/* Pending Video Files List */}
        {!isImageMode && pendingVideoFiles.length > 0 && results.length === 0 && (
          <div className="space-y-3">
            {pendingVideoFiles.map((pv, index) => (
              <div
                key={index}
                className="p-4 bg-secondary/30 rounded-xl border border-border animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* File Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm truncate">
                        {pv.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(pv.file.size)}
                      </p>
                    </div>
                  </div>

                  {/* Resolution Selector */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-medium">Resolution</span>
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      {(["720", "1080"] as VideoResolution[]).map((res) => (
                        <button
                          key={res}
                          onClick={() => updatePendingVideoFile(index, { resolution: res })}
                          className={cn(
                            "px-4 py-1.5 text-sm font-medium transition-colors",
                            pv.resolution === res
                              ? "bg-foreground text-background"
                              : "bg-background text-muted-foreground hover:bg-secondary"
                          )}
                        >
                          {res}p
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Output Format Badge */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-medium">Output</span>
                  <div className="px-4 py-1.5 text-sm font-medium bg-accent/20 text-accent rounded-lg">
                    WebM
                  </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemovePendingVideoFile(index)}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-colors self-start md:self-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add More Files */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <input
                type="file"
                accept={activeTabConfig.accept}
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                + Drop more videos or click to add
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
              <span className="text-sm text-muted-foreground">
                {pendingVideoFiles.length} video(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                  disabled={isProcessing || ffmpegLoading}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  onClick={processVideoFiles}
                  className="gradient-primary gap-2"
                  disabled={isProcessing || ffmpegLoading}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : ffmpegLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Compress Videos"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Doc Files List */}
        {isDocMode && pendingDocFiles.length > 0 && results.length === 0 && (
          <div className="space-y-3">
            {pendingDocFiles.map((pd, index) => (
              <div
                key={index}
                className="p-4 bg-secondary/30 rounded-xl border border-border animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* File Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm truncate">
                        {pd.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(pd.file.size)}
                      </p>
                    </div>
                  </div>

                  {/* Output Format Badge */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-medium">Output</span>
                    <div className="px-4 py-1.5 text-sm font-medium bg-accent/20 text-accent rounded-lg">
                      PDF
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemovePendingDocFile(index)}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-colors self-start md:self-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add More Files */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <input
                type="file"
                accept={activeTabConfig.accept}
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                + Drop more documents or click to add
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
              <span className="text-sm text-muted-foreground">
                {pendingDocFiles.length} document(s) selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                  disabled={isProcessing}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  onClick={processDocFiles}
                  className="gradient-primary gap-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    "Convert to PDF"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Files List - Image Mode */}
        {isImageMode && pendingFiles.length > 0 && results.length === 0 && (
          <div className="space-y-3">
            {pendingFiles.map((pf, index) => (
              <div
                key={index}
                className="p-4 bg-secondary/30 rounded-xl border border-border animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* File Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileImage className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm truncate">
                        {pf.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(pf.file.size)}
                      </p>
                    </div>
                  </div>

                  {/* Compression Level */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-medium">Compression</span>
                    <div className="flex rounded-lg border border-border overflow-hidden">
                      {(["low", "medium", "high"] as CompressionLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => updatePendingFile(index, { compressionLevel: level })}
                          className={cn(
                            "px-4 py-1.5 text-sm font-medium transition-colors capitalize",
                            pf.compressionLevel === level
                              ? "bg-foreground text-background"
                              : "bg-background text-muted-foreground hover:bg-secondary"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Output Format */}
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground font-medium">Convert To</span>
                    <Select
                      value={pf.outputFormat}
                      onValueChange={(value: OutputFormat) =>
                        updatePendingFile(index, { outputFormat: value })
                      }
                    >
                      <SelectTrigger className="w-[100px] h-9 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jpg">JPG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemovePendingFile(index)}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-colors self-start md:self-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add More Files */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <input
                type="file"
                accept={activeTabConfig.accept}
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                + Drop more files or click to add
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
              <span className="text-sm text-muted-foreground">
                {pendingFiles.length} file(s) selected.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                  disabled={isProcessing}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </Button>
                <Button
                  onClick={processImageFiles}
                  className="gradient-primary gap-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Compress Files"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-0 space-y-3">
            {/* Header with Download All */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                Results ({results.length})
              </h3>
              <div className="flex items-center gap-2">
                {completedCount > 1 && (
                  <Button
                    onClick={handleDownloadAll}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-primary border-primary/30 hover:bg-primary/10"
                  >
                    <DownloadCloud className="w-4 h-4" />
                    Download All ({completedCount})
                  </Button>
                )}
                <Button
                  onClick={() => setResults([])}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                >
                  Clear All
                </Button>
              </div>
            </div>

            {results.map((result, index) => (
              <div 
                key={index} 
                className="p-4 bg-secondary/30 rounded-xl border border-border relative group animate-in fade-in slide-in-from-top-2 duration-300"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemoveResult(index)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-secondary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between mb-3 pr-8">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        result.isProcessing ? "bg-primary/10" : result.error ? "bg-destructive/10" : "bg-accent/20"
                      )}
                    >
                      {result.isProcessing ? (
                        <Upload className="w-5 h-5 text-primary animate-pulse" />
                      ) : result.error ? (
                        <span className="text-destructive text-lg">!</span>
                      ) : (
                        <Check className="w-5 h-5 text-accent" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm truncate max-w-[180px] md:max-w-[280px]">
                        {result.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {result.isProcessing
                          ? "Processing..."
                          : result.error
                          ? result.error
                          : "Ready to download"}
                      </p>
                    </div>
                  </div>
                  {result.convertedSize && !result.error && (
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        getChangePercent(result.originalSize, result.convertedSize) > 0
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {getChangePercent(result.originalSize, result.convertedSize) > 0
                        ? `-${getChangePercent(result.originalSize, result.convertedSize)}%`
                        : "Converted"}
                    </span>
                  )}
                </div>

                {result.isProcessing ? (
                  <Progress value={result.progress} className="h-2" />
                ) : !result.error ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Original</p>
                        <p className="font-semibold text-foreground">{formatFileSize(result.originalSize)}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Converted</p>
                        <p className="font-semibold text-accent">{formatFileSize(result.convertedSize || 0)}</p>
                      </div>
                    </div>
                    <Button onClick={() => handleDownload(result)} className="w-full gradient-primary">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConverterTool;
