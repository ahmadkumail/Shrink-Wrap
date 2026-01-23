import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Image, Video, FileText } from "lucide-react";

const CTA = () => {
  const scrollToHeroWithTab = (tabName: string) => {
    const heroSection = document.querySelector('#hero-converter');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
      // Trigger the appropriate tab selection after scroll
      setTimeout(() => {
        const tabEvent = new CustomEvent('selectTab', { detail: { tab: tabName } });
        window.dispatchEvent(tabEvent);
      }, 500);
    }
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-primary opacity-5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/10 blur-3xl rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-8 animate-float shadow-glow">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Ready to optimize your files?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Start compressing images, converting formats, and transforming documents for free. No sign-up required.
          </p>

          {/* Feature pills - clickable */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button 
              onClick={() => scrollToHeroWithTab('compress')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
            >
              <Image className="w-4 h-4 text-primary" />
              <span className="text-foreground">Image Compression</span>
            </button>
            <button 
              onClick={() => scrollToHeroWithTab('video')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
            >
              <Video className="w-4 h-4 text-primary" />
              <span className="text-foreground">Video Compression</span>
            </button>
            <button 
              onClick={() => scrollToHeroWithTab('doc-to-pdf')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-foreground">DOC to PDF</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl" onClick={() => scrollToHeroWithTab('compress')}>
              Start Compressing
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Link to="/pricing">
              <Button variant="outline" size="xl">
                View Pricing
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            ✓ 100% Free  •  ✓ No Sign-up  •  ✓ Browser-based  •  ✓ Private
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
