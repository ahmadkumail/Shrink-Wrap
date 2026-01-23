import { Upload, Cog, Download, Image, Video, FileText, ArrowLeftRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload",
    description: "Drag and drop your files, or click to browse. We support images, videos, and Word documents.",
  },
  {
    icon: Cog,
    step: "02",
    title: "Process",
    description: "Our browser-based engine compresses, converts, or transforms your files instantly — no server uploads needed.",
  },
  {
    icon: Download,
    step: "03",
    title: "Download",
    description: "Download your optimized files instantly. See the before and after comparison to verify quality.",
  },
];

const tools = [
  { icon: Image, label: "Image Compression", description: "PNG, JPG, WebP" },
  { icon: ArrowLeftRight, label: "Format Convert", description: "PNG ↔ JPG" },
  { icon: Video, label: "Video Compress", description: "MP4, WebM, MOV" },
  { icon: FileText, label: "DOC to PDF", description: "Word to PDF" },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            Process your files in three simple steps. No technical knowledge required.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
            
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="relative text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step number */}
                <div className="relative inline-flex mb-6">
                  <div className="w-32 h-32 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-card relative z-10">
                    <step.icon className="w-12 h-12 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {step.step}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Tools */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-center text-lg font-semibold text-foreground mb-8">
            Supported Tools
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
              <div 
                key={tool.label}
                className="flex flex-col items-center p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <tool.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground text-center">{tool.label}</p>
                <p className="text-xs text-muted-foreground text-center mt-1">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
