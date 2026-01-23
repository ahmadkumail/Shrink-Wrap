import { Download, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CompressionResultProps {
  fileName: string;
  originalSize: number;
  compressedSize?: number;
  isCompressing?: boolean;
  progress?: number;
  onDownload?: () => void;
}

const CompressionResult = ({
  fileName,
  originalSize,
  compressedSize,
  isCompressing = false,
  progress = 0,
  onDownload,
}: CompressionResultProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const savings = compressedSize
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="p-6 bg-card border border-border rounded-xl animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isCompressing ? "bg-primary/10" : "bg-accent/10"
            )}
          >
            {isCompressing ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            ) : (
              <Check className="w-5 h-5 text-accent" />
            )}
          </div>
          <div>
            <p className="font-medium text-foreground truncate max-w-[200px] md:max-w-[300px]">
              {fileName}
            </p>
            <p className="text-sm text-muted-foreground">
              {isCompressing ? "Compressing..." : "Compression complete"}
            </p>
          </div>
        </div>

        {!isCompressing && compressedSize && (
          <span className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
            -{savings}%
          </span>
        )}
      </div>

      {isCompressing ? (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {progress}% complete
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Size comparison */}
          <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Original</p>
              <p className="font-semibold text-foreground">
                {formatFileSize(originalSize)}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 text-right">
              <p className="text-xs text-muted-foreground mb-1">Compressed</p>
              <p className="font-semibold text-accent">
                {compressedSize ? formatFileSize(compressedSize) : "—"}
              </p>
            </div>
          </div>

          {/* Download button */}
          <Button
            variant="hero"
            className="w-full"
            onClick={onDownload}
          >
            <Download className="w-4 h-4" />
            Download Compressed File
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompressionResult;
