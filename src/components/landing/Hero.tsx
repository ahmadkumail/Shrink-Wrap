import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown } from "lucide-react";
import { useState } from "react";
import ConverterTool from "@/components/converter/ConverterTool";

const DAILY_LIMIT = 999999; // Unlimited for testing
const STORAGE_KEY = "shrinkwrap_daily_usage";

const getDailyUsage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { count: 0, date: new Date().toDateString() };
    const data = JSON.parse(stored);
    if (!data || typeof data.count !== "number") {
      return { count: 0, date: new Date().toDateString() };
    }
    if (data.date !== new Date().toDateString()) {
      return { count: 0, date: new Date().toDateString() };
    }
    return data;
  } catch {
    return { count: 0, date: new Date().toDateString() };
  }
};

const saveDailyUsage = (count: number) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ count, date: new Date().toDateString() })
    );
  } catch {
    // ignore
  }
};

const Hero = () => {
  const [dailyUsage, setDailyUsage] = useState(getDailyUsage);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const remainingUploads = Math.max(0, DAILY_LIMIT - dailyUsage.count);

  const handleUsageIncrement = (count: number) => {
    const currentUsage = getDailyUsage();
    const newCount = currentUsage.count + count;
    saveDailyUsage(newCount);
    setDailyUsage({ count: newCount, date: new Date().toDateString() });
  };

  const handleLimitReached = () => {
    setShowLimitModal(true);
  };

  return (
    <section id="hero-converter" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>Compress • Convert • Transform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-in-up text-balance" style={{ animationDelay: "0.1s" }}>
            All-in-One File
            <span className="block gradient-text">
              Compression Tool
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Compress images & videos, convert PNG↔JPG, transform DOC to PDF — all in your browser. 100% free, no sign-up required.
          </p>
        </div>

        {/* Converter Tool - Right after headline */}
        <div className="max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <ConverterTool
            remainingUploads={remainingUploads}
            dailyLimit={DAILY_LIMIT}
            onUsageIncrement={handleUsageIncrement}
            onLimitReached={handleLimitReached}
          />
        </div>

        {/* Stats */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto animate-fade-in-up text-center" style={{ animationDelay: "0.4s" }}>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">80%</div>
              <div className="text-xs md:text-sm text-muted-foreground">Size Reduction</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">10M+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Files Processed</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">50K+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Happy Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Limit Reached Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-8 max-w-md w-full shadow-2xl border border-border">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Daily Limit Reached
              </h3>
              <p className="text-muted-foreground mb-6">
                You've used all {DAILY_LIMIT} free conversions for today. Upgrade to Pro for unlimited access!
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowLimitModal(false)}
                >
                  Maybe Later
                </Button>
                <Link to="/pricing" className="flex-1">
                  <Button className="w-full gradient-primary">
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
