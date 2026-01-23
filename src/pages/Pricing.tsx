import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PricingCard from "@/components/pricing/PricingCard";
import PurchaseInterestModal from "@/components/pricing/PurchaseInterestModal";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    name: string;
    price: string;
  } | null>(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      description: "Perfect for trying out Shrink Wrap",
      features: [
        "1 video compression (lifetime)",
        "Unlimited image compressions",
        "PNG and JPG support",
        "Up to 10MB per file",
        "Standard compression",
      ],
      ctaText: "Get Started",
      ctaLink: "/",
    },
    {
      id: "monthly",
      name: "Monthly",
      price: "$9",
      period: "month",
      description: "For regular users and professionals",
      features: [
        "10 video compressions per month",
        "Unlimited image compressions",
        "MP4 video support",
        "Up to 50MB per file",
        "Quality presets (High/Medium/Low)",
        "Priority processing",
      ],
      highlighted: true,
      badge: "POPULAR",
      ctaText: "Get Started",
      onCtaClick: () => setSelectedPlan({ id: "monthly", name: "Monthly", price: "$9/month" }),
    },
    {
      id: "yearly",
      name: "Yearly",
      price: "$99",
      period: "year",
      description: "Best value for power users",
      features: [
        "100 video compressions per year",
        "Unlimited image compressions",
        "MP4 video support",
        "Up to 100MB per file",
        "Quality presets (High/Medium/Low)",
        "Priority processing",
        "Priority support",
      ],
      badge: "SAVE 17%",
      ctaText: "Get Started",
      onCtaClick: () => setSelectedPlan({ id: "yearly", name: "Yearly", price: "$99/year" }),
    },
    {
      id: "lifetime",
      name: "Lifetime",
      price: "$129",
      description: "One-time payment, forever access",
      features: [
        "Unlimited video compressions",
        "Unlimited image compressions",
        "All format support",
        "Up to 200MB per file",
        "Quality presets (High/Medium/Low)",
        "Priority processing",
        "Priority support",
        "Future updates included",
      ],
      badge: "BEST VALUE",
      ctaText: "Get Started",
      onCtaClick: () => setSelectedPlan({ id: "lifetime", name: "Lifetime", price: "$129 one-time" }),
    },
  ];

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your Monthly or Yearly subscription at any time. You'll continue to have access until the end of your billing period.",
    },
    {
      question: "What happens to my files after compression?",
      answer: "Your files are processed locally in your browser. We never upload or store your files on our servers.",
    },
    {
      question: "How does the Lifetime plan work?",
      answer: "The Lifetime plan is a one-time payment that gives you unlimited access to all features forever, including future updates.",
    },
    {
      question: "What video formats are supported?",
      answer: "Currently, we support MP4 video compression for paid users. More formats coming soon!",
    },
    {
      question: "How do I get started after payment?",
      answer: "After submitting your interest, our team will contact you with payment details. Once payment is confirmed, you'll receive access to your plan immediately.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              Start for free, upgrade when you need more. No hidden fees.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-24">
            {plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-6 bg-card border border-border rounded-xl"
                >
                  <h3 className="font-semibold text-foreground mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Purchase Interest Modal */}
      <PurchaseInterestModal
        open={!!selectedPlan}
        onOpenChange={(open) => !open && setSelectedPlan(null)}
        planId={selectedPlan?.id || ""}
        planName={selectedPlan?.name || ""}
        planPrice={selectedPlan?.price || ""}
      />
    </div>
  );
};

export default Pricing;
