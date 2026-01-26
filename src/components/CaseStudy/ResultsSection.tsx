import { TrendingUp, Star, Clock, Heart } from "lucide-react";

const ResultsSection = () => {
  const metrics = [
    { icon: TrendingUp, value: "3x", label: "Higher match rate" },
    { icon: Star, value: "4.9", label: "App Store rating" },
    { icon: Clock, value: "12 min", label: "Avg. session time" },
    { icon: Heart, value: "68%", label: "Meaningful conversations" },
  ];

  return (
    <section className="py-24 bg-gradient-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary-foreground/5 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-4">
            Results & Impact
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-primary-foreground">
            Measurable Success
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            The redesigned dating experience delivered significant improvements in user engagement and match quality.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {metrics.map((metric, index) => (
            <div 
              key={metric.label}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-primary-foreground/15 transition-colors duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
                <metric.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <p className="font-display text-4xl font-bold text-primary-foreground mb-2">{metric.value}</p>
              <p className="text-primary-foreground/70 text-sm">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-display text-primary-foreground/90 italic mb-6">
            "Finally a dating app that focuses on real connections! The conversation starters 
            made it so much easier to break the ice and have meaningful chats."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span>👤</span>
            </div>
            <div className="text-left">
              <p className="text-primary-foreground font-medium">Beta Tester</p>
              <p className="text-primary-foreground/60 text-sm">13th Step User</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
