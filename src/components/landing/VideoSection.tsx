import { Video, Play, Zap, Clock, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const VideoSection = () => {
  const scrollToHero = () => {
    const heroSection = document.querySelector('#hero-converter');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
      // Trigger video tab selection after scroll
      setTimeout(() => {
        const videoTabEvent = new CustomEvent('selectVideoTab');
        window.dispatchEvent(videoTabEvent);
      }, 500);
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Browser-Based",
      description: "No uploads needed. All processing happens locally in your browser."
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Compress videos in seconds with optimized MP4 output."
    },
    {
      icon: Shield,
      title: "100% Private",
      description: "Your videos never leave your device. Complete privacy guaranteed."
    }
  ];

  return (
    <section id="video-section" className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with Highlight */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-pulse">
            <Video className="w-4 h-4" />
            <span>Video Compression Tool</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Compress Videos
            <span className="block gradient-text mt-2">Right in Your Browser</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Shrink your video files up to 70% without losing quality. Fast, private, and completely free. 
            Choose between 720p and 1080p output resolution.
          </p>
        </div>

        {/* Video Demo Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative bg-card rounded-3xl border-2 border-primary/20 shadow-elevated overflow-hidden">
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-50 blur-xl" />
            
            <div className="relative p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Info */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <Video className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Video Compressor</h3>
                      <p className="text-sm text-muted-foreground">WebM Output • Audio Included</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3 text-foreground">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <span>Supports MP4, MOV, WebM, AVI formats</span>
                    </li>
                    <li className="flex items-center gap-3 text-foreground">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <span>Choose 720p or 1080p resolution</span>
                    </li>
                    <li className="flex items-center gap-3 text-foreground">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <span>Up to 70% file size reduction</span>
                    </li>
                    <li className="flex items-center gap-3 text-foreground">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                      <span>Instant download when complete</span>
                    </li>
                  </ul>
                  
                  <Button 
                    variant="hero" 
                    size="lg"
                    onClick={scrollToHero}
                    className="group"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Compress Video Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                
                {/* Right side - Visual (revamped like screenshot, no overlap) */}
                <div className="relative">
                  <div className="aspect-video rounded-2xl border border-border overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                    <div className="h-full w-full p-4 md:p-6">
                      <div className="h-full w-full rounded-2xl bg-card/70 border border-border/60 shadow-soft flex flex-col px-5 py-6 md:px-7 md:py-7">
                        {/* Top: Icon */}
                        <div className="flex items-start justify-center">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                            <Video className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
                          </div>
                        </div>

                        {/* Middle: Copy */}
                        <div className="mt-5 text-center">
                          <p className="text-base md:text-lg font-semibold text-foreground leading-snug">
                            Drop your video here
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 leading-snug">
                            or click to browse
                          </p>
                        </div>

                        {/* Spacer to keep bottom block away from text on all sizes */}
                        <div className="flex-1" />

                        {/* Bottom: Stats + progress */}
                        <div className="w-full pt-5">
                          <div className="flex items-center justify-between gap-4 text-sm">
                            <span className="text-muted-foreground font-medium whitespace-nowrap">
                              Original: 100MB
                            </span>
                            <span className="text-accent font-semibold whitespace-nowrap">
                              Compressed: 30MB
                            </span>
                          </div>

                          <div className="mt-3 h-3 md:h-3.5 bg-muted/70 rounded-full overflow-hidden">
                            <div className="h-full w-[30%] gradient-primary rounded-full" />
                          </div>

                          <p className="mt-3 text-center text-base md:text-lg text-accent font-semibold leading-tight">
                            70% smaller!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="text-center p-6 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
