import { ArrowUp, Linkedin, Dribbble, Mail } from "lucide-react";

const FooterSection = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 bg-foreground text-background">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">13</span>
              </div>
              <span className="font-display font-semibold text-xl text-background">13th Step</span>
            </div>
            <p className="text-background/60 max-w-md">
              Thank you for viewing this case study. Feel free to reach out for collaboration opportunities.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="#" 
              className="w-12 h-12 rounded-xl bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 rounded-xl bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
            >
              <Dribbble className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="w-12 h-12 rounded-xl bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-sm">
            © 2024 Case Study. All rights reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/10 hover:bg-background/20 transition-colors text-sm"
          >
            <ArrowUp className="w-4 h-4" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
