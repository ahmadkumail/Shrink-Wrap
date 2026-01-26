import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Calendar, Lightbulb } from "lucide-react";

const OverviewSection = () => {
  const overviewItems = [
    {
      icon: Target,
      title: "Project Goal",
      description: "Create a modern dating app that fosters genuine connections through smart matching algorithms and authentic user profiles.",
    },
    {
      icon: Users,
      title: "Target Audience",
      description: "Young adults (18-35) seeking meaningful relationships, looking for a refreshing alternative to superficial dating apps.",
    },
    {
      icon: Calendar,
      title: "Timeline",
      description: "6-week design sprint including research, wireframing, UI design, prototyping, and usability testing phases.",
    },
    {
      icon: Lightbulb,
      title: "My Role",
      description: "Lead UI/UX Designer responsible for end-to-end design, from user research to high-fidelity interactive prototypes.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            Overview
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Project <span className="text-gradient">Summary</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Understanding the project scope, goals, and the strategic approach to designing 
            a dating app that prioritizes authentic connections.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {overviewItems.map((item, index) => (
            <Card 
              key={item.title} 
              className="border-none shadow-card hover:shadow-elevated transition-shadow duration-300 bg-gradient-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
