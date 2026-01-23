import { useCallback, useState } from "react";
import { Upload, Image, Video, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  isPro?: boolean;
  remainingUploads?: number;
  dailyLimit?: number;
}

const UploadZone = ({
  onFilesSelected,
  acceptedTypes = ["image/png", "image/jpeg"],
  maxFiles = 1,
  isPro = false,
  remainingUploads = 10,
  dailyLimit = 10,
}: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        acceptedTypes.includes(file.type)
      );

      if (files.length > 0) {
        const filesToAdd = files.slice(0, maxFiles);
        setSelectedFiles(filesToAdd);
        onFilesSelected(filesToAdd);
      }
    },
    [acceptedTypes, maxFiles, onFilesSelected]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      // Allow selecting the same file again later
      e.target.value = "";

      if (files.length > 0) {
        const filesToAdd = files.slice(0, maxFiles);
        setSelectedFiles(filesToAdd);
        onFilesSelected(filesToAdd);
      }
    },
    [maxFiles, onFilesSelected]
  );

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      {/* Usage indicator for free users */}
      {!isPro && (
        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
          <AlertCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {remainingUploads} of {dailyLimit} free compressions remaining today
          </span>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer group",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-primary/5"
        )}
      >
        <input
          type="file"
          accept={acceptedTypes.join(",")}
          multiple={maxFiles > 1}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
              isDragging
                ? "gradient-primary scale-110"
                : "bg-primary/10 group-hover:bg-primary/20"
            )}
          >
            <Upload
              className={cn(
                "w-8 h-8 transition-colors",
                isDragging ? "text-primary-foreground" : "text-primary"
              )}
            />
          </div>

          <div>
            <p className="text-lg font-medium text-foreground mb-1">
              {isDragging ? "Drop files here" : "Drop files or click to upload"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isPro ? "PNG, JPG, MP4" : "PNG, JPG"} up to 10MB
              {!isPro && (
                <span className="block mt-1 text-xs">
                  Upgrade to Pro for video compression
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Selected files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-lg animate-scale-in"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {file.type.startsWith("video") ? (
                    <Video className="w-5 h-5 text-primary" />
                  ) : (
                    <Image className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadZone;
