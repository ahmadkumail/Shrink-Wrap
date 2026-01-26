import onboardingScreen from "@/assets/screens/onboarding.png";
import splashScreen from "@/assets/screens/splash.png";
import signupScreen from "@/assets/screens/signup.png";
import discoverScreen from "@/assets/screens/discover.png";
import loveLanguageScreen from "@/assets/screens/love-language.png";
import profileScreen from "@/assets/screens/profile.png";
import matchesScreen from "@/assets/screens/matches.png";
import liveEventScreen from "@/assets/screens/live-event.png";
import editProfileScreen from "@/assets/screens/edit-profile.png";

const ScreensSection = () => {
  const screens = [
    { title: "Onboarding", subtitle: "Welcome flow", image: onboardingScreen },
    { title: "Splash", subtitle: "First impression", image: splashScreen },
    { title: "Login/Signup", subtitle: "Authentication", image: signupScreen },
    { title: "Discover", subtitle: "Swipe & match", image: discoverScreen },
    { title: "Love Language", subtitle: "Compatibility quiz", image: loveLanguageScreen },
    { title: "Profile", subtitle: "User showcase", image: profileScreen },
    { title: "Matches", subtitle: "It's a connection!", image: matchesScreen },
    { title: "Live Events", subtitle: "Social events", image: liveEventScreen },
    { title: "Edit Profile", subtitle: "Personal info", image: editProfileScreen },
  ];

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            App Screens
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Key <span className="text-gradient">Interfaces</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A collection of the main screens designed to deliver a seamless and engaging dating experience.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto px-4">
          {screens.map((screen) => (
            <div key={screen.title} className="group">
              {/* iPhone 16 Style Mockup */}
              <div className="relative mx-auto w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px]">
                {/* Phone frame - dark navy blue like reference */}
                <div className="relative bg-[#1a1a2e] rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-[3px] sm:p-1 md:p-1.5 shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-500 group-hover:-translate-y-2 border border-[#2d2d44]">
                  {/* Inner bezel */}
                  <div className="relative bg-[#0a0a14] rounded-[1.3rem] sm:rounded-[1.75rem] md:rounded-[2.25rem] overflow-hidden">
                    {/* Dynamic Island */}
                    <div className="absolute top-1 sm:top-1.5 md:top-2 left-1/2 -translate-x-1/2 w-12 sm:w-14 md:w-16 h-3 sm:h-3.5 md:h-4 bg-[#0a0a14] rounded-full z-20" />
                    
                    {/* Screen content */}
                    <div className="relative overflow-hidden bg-white aspect-[9/19.5]">
                      <img 
                        src={screen.image} 
                        alt={screen.title}
                        className="w-full h-full object-cover object-top"
                      />
                      
                      {/* Screen glare effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                    </div>
                    
                    {/* Home indicator */}
                    <div className="absolute bottom-1 sm:bottom-1.5 left-1/2 -translate-x-1/2 w-14 sm:w-16 md:w-20 h-0.5 sm:h-1 bg-white/30 rounded-full" />
                  </div>
                </div>
                
                {/* Shadow under phone */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/15 rounded-full blur-lg group-hover:bg-primary/10 transition-colors duration-500" />
              </div>
              
              {/* Label */}
              <div className="text-center mt-5 sm:mt-6">
                <h4 className="font-display font-semibold text-base sm:text-lg">{screen.title}</h4>
                <p className="text-muted-foreground text-xs sm:text-sm">{screen.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScreensSection;
