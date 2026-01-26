const DesignSystemSection = () => {
  const colors = [
    { name: "Primary", color: "bg-primary", hex: "#8B5CF6" },
    { name: "Secondary", color: "bg-secondary", hex: "#F3F0FF" },
    { name: "Accent", color: "bg-accent", hex: "#FAF5FF" },
    { name: "Foreground", color: "bg-foreground", hex: "#1C1917" },
    { name: "Muted", color: "bg-muted-foreground", hex: "#78716C" },
  ];

  const typography = [
    { name: "Display", font: "font-display", size: "text-4xl", weight: "font-bold", sample: "Outfit Bold" },
    { name: "Heading", font: "font-display", size: "text-2xl", weight: "font-semibold", sample: "Outfit Semibold" },
    { name: "Body", font: "font-sans", size: "text-base", weight: "font-normal", sample: "Inter Regular" },
    { name: "Small", font: "font-sans", size: "text-sm", weight: "font-medium", sample: "Inter Medium" },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            Design System
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Visual <span className="text-gradient">Language</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A cohesive design system ensuring consistency, accessibility, and scalability across all screens.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Colors */}
          <div className="bg-card rounded-3xl p-8 shadow-card">
            <h3 className="font-display text-2xl font-semibold mb-6">Color Palette</h3>
            <div className="space-y-4">
              {colors.map((color) => (
                <div key={color.name} className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${color.color} shadow-soft`} />
                  <div>
                    <p className="font-medium">{color.name}</p>
                    <p className="text-muted-foreground text-sm">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="bg-card rounded-3xl p-8 shadow-card">
            <h3 className="font-display text-2xl font-semibold mb-6">Typography</h3>
            <div className="space-y-6">
              {typography.map((type) => (
                <div key={type.name} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <p className="text-muted-foreground text-sm mb-2">{type.name}</p>
                  <p className={`${type.font} ${type.size} ${type.weight}`}>{type.sample}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Components */}
          <div className="lg:col-span-2 bg-card rounded-3xl p-8 shadow-card">
            <h3 className="font-display text-2xl font-semibold mb-6">UI Components</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Buttons */}
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">Buttons</p>
                <button className="w-full px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium shadow-soft">
                  Primary
                </button>
                <button className="w-full px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium">
                  Secondary
                </button>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">Cards</p>
                <div className="p-4 rounded-2xl bg-muted">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 mb-2" />
                  <div className="h-2 bg-border rounded w-3/4 mb-1" />
                  <div className="h-2 bg-border rounded w-1/2" />
                </div>
              </div>

              {/* Input */}
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">Input Fields</p>
                <input 
                  type="text" 
                  placeholder="Enter text..." 
                  className="w-full px-4 py-3 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary/30 outline-none"
                />
              </div>

              {/* Toggle */}
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">Toggles</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-6 rounded-full bg-primary relative">
                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-primary-foreground" />
                  </div>
                  <span className="text-sm">Enabled</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-6 rounded-full bg-border relative">
                    <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">Disabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignSystemSection;
