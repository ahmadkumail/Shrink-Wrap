import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  badge?: string;
}

const PricingCard = ({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  ctaText,
  ctaLink,
  onCtaClick,
  badge,
}: PricingCardProps) => {
  const badgeColors: Record<string, string> = {
    "POPULAR": "gradient-pro text-pro-foreground",
    "SAVE 17%": "bg-accent text-accent-foreground",
    "BEST VALUE": "gradient-primary text-primary-foreground",
  };

  const badgeClass = badge ? badgeColors[badge] || "gradient-pro text-pro-foreground" : "";

  return (
    <div
      className={cn(
        "relative p-6 rounded-2xl border transition-all duration-300 flex flex-col",
        highlighted
          ? "bg-card border-primary shadow-elevated lg:scale-105 z-10"
          : "bg-card border-border hover:border-primary/30 hover:shadow-card"
      )}
    >
      {badge && (
        <span className={cn(
          "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap",
          badgeClass
        )}>
          {badge}
        </span>
      )}

      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4 h-10">{description}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold text-foreground">{price}</span>
          {period && <span className="text-muted-foreground text-sm">/{period}</span>}
        </div>
      </div>

      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className={cn(
              "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
              highlighted ? "bg-primary" : "bg-accent"
            )}>
              <Check className={cn(
                "w-2.5 h-2.5",
                highlighted ? "text-primary-foreground" : "text-accent-foreground"
              )} />
            </div>
            <span className="text-foreground text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {ctaLink ? (
        <Link to={ctaLink} className="block mt-auto">
          <Button
            variant={highlighted ? "hero" : "outline"}
            size="lg"
            className="w-full"
          >
            {ctaText}
          </Button>
        </Link>
      ) : (
        <Button
          variant={highlighted ? "hero" : "outline"}
          size="lg"
          className="w-full mt-auto"
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
      )}
    </div>
  );
};

export default PricingCard;
