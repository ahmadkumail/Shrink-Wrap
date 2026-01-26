import HeroSection from "@/components/CaseStudy/HeroSection";
import OverviewSection from "@/components/CaseStudy/OverviewSection";
import ProblemSection from "@/components/CaseStudy/ProblemSection";
import SolutionSection from "@/components/CaseStudy/SolutionSection";
import DesignSystemSection from "@/components/CaseStudy/DesignSystemSection";
import ScreensSection from "@/components/CaseStudy/ScreensSection";
import ResultsSection from "@/components/CaseStudy/ResultsSection";
import FooterSection from "@/components/CaseStudy/FooterSection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <OverviewSection />
      <ProblemSection />
      <SolutionSection />
      <DesignSystemSection />
      <ScreensSection />
      <ResultsSection />
      <FooterSection />
    </main>
  );
};

export default Index;
