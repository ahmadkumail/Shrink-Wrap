import { AlertCircle, TrendingDown, Users, Clock } from "lucide-react";

const ProblemSection = () => {
  const painPoints = [
    {
      icon: AlertCircle,
      title: "Fake Profiles",
      description: "Users struggle with authenticity - too many fake or misleading profiles reduce trust.",
    },
    {
      icon: TrendingDown,
      title: "Superficial Matching",
      description: "Most apps focus only on looks, leading to shallow connections and poor match quality.",
    },
    {
      icon: Users,
      title: "Conversation Fatigue",
      description: "Users get overwhelmed with matches but struggle to start meaningful conversations.",
    },
    {
      icon: Clock,
      title: "Time Wasted",
      description: "Endless swiping without results leads to frustration and app abandonment.",
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-6">
              The Problem
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Understanding <span className="text-gradient">User Pain Points</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Through extensive user research and interviews with dating app users, 
              I identified critical challenges that existing solutions fail to address effectively.
            </p>

            <div className="space-y-6">
              {painPoints.map((point, index) => (
                <div 
                  key={point.title} 
                  className="flex gap-4 p-4 rounded-2xl bg-background shadow-card hover:shadow-elevated transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <point.icon className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold mb-1">{point.title}</h4>
                    <p className="text-muted-foreground text-sm">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-3xl opacity-10" />
            <div className="relative bg-card rounded-3xl p-8 shadow-elevated">
              <h3 className="font-display text-2xl font-bold mb-6 text-center">Research Insights</h3>
              
              <div className="space-y-6">
                <div className="text-center p-6 bg-secondary rounded-2xl">
                  <p className="font-display text-5xl font-bold text-gradient mb-2">67%</p>
                  <p className="text-muted-foreground">of users feel existing apps lack authenticity</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <p className="font-display text-3xl font-bold text-gradient">78%</p>
                    <p className="text-muted-foreground text-sm mt-1">want better conversation starters</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <p className="font-display text-3xl font-bold text-gradient">84%</p>
                    <p className="text-muted-foreground text-sm mt-1">prefer quality over quantity</p>
                  </div>
                </div>

                <blockquote className="p-4 border-l-4 border-primary bg-accent/50 rounded-r-xl italic text-muted-foreground">
                  "I want an app where I can actually get to know someone before meeting, not just swipe based on photos."
                  <span className="block mt-2 text-sm font-medium text-foreground not-italic">— Research Participant</span>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
