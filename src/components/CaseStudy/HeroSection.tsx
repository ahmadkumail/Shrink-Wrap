import { Badge } from "@/components/ui/badge";
import discoverScreen from "@/assets/screens/discover.png";
import matchesScreen from "@/assets/screens/matches.png";
import profileScreen from "@/assets/screens/profile.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container relative z-10 pt-24 pb-16">
        {/* Header */}
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">13</span>
            </div>
            <span className="font-display font-semibold text-xl">13th Step</span>
          </div>
          <Badge variant="secondary" className="px-4 py-2 font-medium">
            UX Case Study
          </Badge>
        </nav>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-gradient-primary" />
            <span className="text-sm font-medium text-secondary-foreground">Mobile App Design</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-gradient">13th Step</span>
            <br />
            Dating App
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            A modern dating application designed to help people find meaningful connections through 
            smart matching, authentic profiles, and engaging conversation features.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-gradient">40+</p>
              <p className="text-sm text-muted-foreground mt-1">Screens Designed</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-gradient">15</p>
              <p className="text-sm text-muted-foreground mt-1">User Flows</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-gradient">6 Weeks</p>
              <p className="text-sm text-muted-foreground mt-1">Design Sprint</p>
            </div>
          </div>
        </div>

        {/* Phone Mockups */}
        <div className="mt-20 flex justify-center items-end gap-3 md:gap-6 lg:gap-8 px-4">
          {/* Left Phone - Discover */}
          <div className="w-32 sm:w-40 md:w-52 lg:w-60 animate-float-delayed transform -rotate-3">
            <div className="relative bg-[#1a1a2e] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-[3px] sm:p-1 md:p-1.5 shadow-2xl border border-[#2d2d44]">
              <div className="relative bg-[#0a0a14] rounded-[1.3rem] sm:rounded-[1.75rem] md:rounded-[2.25rem] overflow-hidden">
                {/* Dynamic Island */}
                <div className="absolute top-1 sm:top-1.5 md:top-2 left-1/2 -translate-x-1/2 w-10 sm:w-14 md:w-16 h-2.5 sm:h-3.5 md:h-4 bg-[#0a0a14] rounded-full z-20" />
                
                {/* Screen content */}
                <div className="relative overflow-hidden bg-white aspect-[9/19.5]">
                  <img src={discoverScreen} alt="Discover" className="w-full h-full object-cover object-top" />
                  {/* Screen glare */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                </div>
                
                {/* Home indicator */}
                <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* Center Phone - Matches (larger) */}
          <div className="w-40 sm:w-48 md:w-60 lg:w-72 animate-float z-10">
            <div className="relative bg-[#1a1a2e] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.75rem] p-[3px] sm:p-1 md:p-2 shadow-2xl shadow-primary/20 border border-[#3d3d5c]">
              <div className="relative bg-[#0a0a14] rounded-[1.3rem] sm:rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden">
                {/* Dynamic Island */}
                <div className="absolute top-1.5 sm:top-2 md:top-2.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 md:w-20 h-3 sm:h-4 md:h-5 bg-[#0a0a14] rounded-full z-20" />
                
                {/* Screen content */}
                <div className="relative overflow-hidden bg-white aspect-[9/19.5]">
                  <img src={matchesScreen} alt="Matches" className="w-full h-full object-cover object-top" />
                  {/* Screen glare */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                </div>
                
                {/* Home indicator */}
                <div className="absolute bottom-1 sm:bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 w-14 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Phone - Profile */}
          <div className="hidden sm:block w-32 sm:w-40 md:w-52 lg:w-60 animate-float-delayed transform rotate-3">
            <div className="relative bg-[#1a1a2e] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-[3px] sm:p-1 md:p-1.5 shadow-2xl border border-[#2d2d44]">
              <div className="relative bg-[#0a0a14] rounded-[1.3rem] sm:rounded-[1.75rem] md:rounded-[2.25rem] overflow-hidden">
                {/* Dynamic Island */}
                <div className="absolute top-1 sm:top-1.5 md:top-2 left-1/2 -translate-x-1/2 w-10 sm:w-14 md:w-16 h-2.5 sm:h-3.5 md:h-4 bg-[#0a0a14] rounded-full z-20" />
                
                {/* Screen content */}
                <div className="relative overflow-hidden bg-white aspect-[9/19.5]">
                  <img src={profileScreen} alt="Profile" className="w-full h-full object-cover object-top" />
                  {/* Screen glare */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                </div>
                
                {/* Home indicator */}
                <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
