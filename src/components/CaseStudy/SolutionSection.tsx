import { Check, Shield, Heart, Sparkles } from "lucide-react";

const SolutionSection = () => {
  const solutions = [
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "Multi-step verification system ensuring authentic profiles with photo verification and social media linking.",
      features: ["Photo verification", "ID check option", "Social media connect"],
    },
    {
      icon: Heart,
      title: "Smart Matching",
      description: "AI-powered matching based on personality, interests, and relationship goals - not just appearances.",
      features: ["Compatibility scores", "Interest-based matching", "Relationship preferences"],
    },
    {
      icon: Sparkles,
      title: "Conversation Starters",
      description: "Built-in icebreakers and prompts to help users initiate meaningful conversations.",
      features: ["Fun prompts", "Voice messages", "Video chat ready"],
    },
  ];

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            The Solution
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Designing for <span className="text-gradient">Real Connections</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Based on research insights, I designed a comprehensive solution that prioritizes 
            authenticity, meaningful matching, and engaging conversations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div 
              key={solution.title}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
              <div className="relative p-8 rounded-3xl border border-border hover:border-primary/30 transition-colors duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-soft">
                  <solution.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <h3 className="font-display text-2xl font-semibold mb-4">{solution.title}</h3>
                <p className="text-muted-foreground mb-6">{solution.description}</p>
                
                <ul className="space-y-3">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
