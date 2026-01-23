import { Image, FileText, Zap, Lock, Download, BarChart3, ArrowLeftRight, Sparkles } from "lucide-react";

const features = [
  {
    icon: Image,
    title: "Image Compression",
    description: "Compress PNG, JPG & WebP images by up to 80% without visible quality loss. Perfect for web optimization.",
    badge: null,
  },
  {
    icon: ArrowLeftRight,
    title: "Format Conversion",
    description: "Seamlessly convert between PNG and JPG formats. Maintain quality while switching file types instantly.",
    badge: null,
  },
  {
    icon: FileText,
    title: "DOC to PDF",
    description: "Convert Word documents to professionally formatted PDFs. Preserves headings, paragraphs & lists.",
    badge: "NEW",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process files in seconds with browser-based compression. No uploads to external servers required.",
    badge: null,
  },
  {
    icon: BarChart3,
    title: "Before & After",
    description: "See exactly how much space you've saved with detailed file size comparisons and instant previews.",
    badge: null,
  },
  {
    icon: Lock,
    title: "100% Private",
    description: "All processing happens in your browser. Files never leave your device. Complete privacy guaranteed.",
    badge: null,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>All-in-One File Tools</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to optimize
          </h2>
          <p className="text-lg text-muted-foreground">
            Compress images, convert formats, transform documents, and shrink videos — 
            all in one place with zero hassle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {feature.badge && (
                <span className="absolute top-4 right-4 px-2 py-1 text-xs font-medium rounded-full bg-accent text-accent-foreground">
                  {feature.badge}
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
