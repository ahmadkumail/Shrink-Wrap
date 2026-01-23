import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shrink, Target, Heart, Zap } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We believe fast websites shouldn't require sacrificing visual quality. Our mission is to make file optimization accessible to everyone.",
    },
    {
      icon: Zap,
      title: "Speed Focused",
      description: "Every millisecond counts. We're obsessed with making our compression algorithms as fast and efficient as possible.",
    },
    {
      icon: Heart,
      title: "User First",
      description: "We build for creators, developers, and designers. Every feature is designed with our users' workflows in mind.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
              <Shrink className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Shrink Wrap
            </h1>
            <p className="text-lg text-muted-foreground">
              We're on a mission to make the web faster, one compressed file at a time.
            </p>
          </div>

          {/* Story */}
          <div className="max-w-3xl mx-auto mb-20">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Shrink Wrap started with a simple frustration: why is it so hard to optimize images and videos without losing quality? As developers and designers ourselves, we spent countless hours manually tweaking compression settings, testing different tools, and hoping for the best.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We built Shrink Wrap to be the tool we always wanted—simple, fast, and reliable. No complicated settings to learn, no guesswork about quality. Just drag, drop, and download.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Today, Shrink Wrap has helped over 50,000 creators compress more than 10 million files, saving terabytes of bandwidth and making countless websites faster. And we're just getting started.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
