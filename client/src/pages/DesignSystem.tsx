import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function DesignSystem() {
  const colors = [
    { name: "Primary", var: "--primary", class: "bg-primary" },
    { name: "Primary Hover", var: "--primary-hover", class: "bg-[hsl(var(--primary-hover))]" },
    { name: "Accent", var: "--accent", class: "bg-accent" },
    { name: "Accent Hover", var: "--accent-hover", class: "bg-[hsl(var(--accent-hover))]" },
    { name: "Success", var: "--success", class: "bg-success" },
    { name: "Warning", var: "--warning", class: "bg-warning" },
    { name: "Error", var: "--error", class: "bg-error" },
    { name: "Info", var: "--info", class: "bg-info" },
  ];

  const neutrals = [
    { name: "Background", var: "--background", class: "bg-background" },
    { name: "Foreground", var: "--foreground", class: "bg-foreground" },
    { name: "Surface", var: "--surface", class: "bg-surface" },
    { name: "Muted", var: "--muted", class: "bg-[hsl(var(--muted))]" },
    { name: "Border", var: "--border", class: "bg-[hsl(var(--border))]" },
  ];

  const spacing = [
    { name: "XS", var: "--spacing-xs", value: "0.25rem (4px)" },
    { name: "SM", var: "--spacing-sm", value: "0.5rem (8px)" },
    { name: "MD", var: "--spacing-md", value: "1rem (16px)" },
    { name: "LG", var: "--spacing-lg", value: "1.5rem (24px)" },
    { name: "XL", var: "--spacing-xl", value: "2rem (32px)" },
    { name: "2XL", var: "--spacing-2xl", value: "3rem (48px)" },
    { name: "3XL", var: "--spacing-3xl", value: "4rem (64px)" },
  ];

  const typography = [
    { name: "XS", var: "--text-xs", value: "0.75rem (12px)", class: "text-xs" },
    { name: "SM", var: "--text-sm", value: "0.875rem (14px)", class: "text-sm" },
    { name: "Base", var: "--text-base", value: "1rem (16px)", class: "text-base" },
    { name: "LG", var: "--text-lg", value: "1.125rem (18px)", class: "text-lg" },
    { name: "XL", var: "--text-xl", value: "1.25rem (20px)", class: "text-xl" },
    { name: "2XL", var: "--text-2xl", value: "1.5rem (24px)", class: "text-2xl" },
    { name: "3XL", var: "--text-3xl", value: "1.875rem (30px)", class: "text-3xl" },
    { name: "4XL", var: "--text-4xl", value: "2.25rem (36px)", class: "text-4xl" },
  ];

  const fontWeights = [
    { name: "Normal", var: "--font-normal", value: "400", class: "font-normal" },
    { name: "Medium", var: "--font-medium", value: "500", class: "font-medium" },
    { name: "Semibold", var: "--font-semibold", value: "600", class: "font-semibold" },
    { name: "Bold", var: "--font-bold", value: "700", class: "font-bold" },
  ];

  const radius = [
    { name: "SM", var: "--radius-sm", value: "0.375rem (6px)" },
    { name: "MD", var: "--radius-md", value: "0.5rem (8px)" },
    { name: "LG", var: "--radius-lg", value: "0.75rem (12px)" },
    { name: "XL", var: "--radius-xl", value: "1rem (16px)" },
    { name: "2XL", var: "--radius-2xl", value: "1.5rem (24px)" },
    { name: "Full", var: "--radius-full", value: "9999px" },
  ];

  const shadows = [
    { name: "SM", var: "--shadow-sm" },
    { name: "MD", var: "--shadow-md" },
    { name: "LG", var: "--shadow-lg" },
    { name: "XL", var: "--shadow-xl" },
  ];

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8 max-w-2xl" data-testid="design-system-page">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white">Design System</h1>
        <p className="text-xs sm:text-sm text-white/60">
          Comprehensive design tokens and components for Perth Saver
        </p>
      </div>

      <Separator className="bg-white/10" />

      {/* Colors Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Brand Colors</h2>
          <p className="text-sm text-white/60">Core brand and semantic color palette</p>
        </div>
        
        <div className="space-y-4">
          {colors.map((color) => (
            <Card key={color.var} className="glass overflow-hidden">
              <div className={`h-24 ${color.class}`} />
              <CardHeader className="p-4">
                <CardTitle className="text-sm">{color.name}</CardTitle>
                <CardDescription className="font-mono text-xs">{color.var}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-display font-semibold text-white mb-4 mt-6">Neutral Colors</h3>
        </div>
        
        <div className="space-y-4">
          {neutrals.map((color) => (
            <Card key={color.var} className="glass overflow-hidden">
              <div className={`h-20 ${color.class} border border-white/10`} />
              <CardHeader className="p-4">
                <CardTitle className="text-sm">{color.name}</CardTitle>
                <CardDescription className="font-mono text-xs">{color.var}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="bg-white/10" />

      {/* Typography Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Typography</h2>
          <p className="text-sm text-white/60">Font sizes and weights for consistent typography</p>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Type Scale</CardTitle>
            <CardDescription>Harmonious font size progression</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {typography.map((type) => (
              <div key={type.var} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-24 text-sm text-white/60 font-mono">{type.var}</div>
                <div className={`flex-1 ${type.class} text-white`}>
                  The quick brown fox jumps over the lazy dog
                </div>
                <div className="text-xs text-white/40 font-mono">{type.value}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Font Weights</CardTitle>
            <CardDescription>Available font weight options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fontWeights.map((weight) => (
              <div key={weight.var} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-32 text-sm text-white/60 font-mono">{weight.var}</div>
                <div className={`flex-1 text-lg ${weight.class} text-white`}>
                  The quick brown fox jumps over the lazy dog
                </div>
                <div className="text-xs text-white/40 font-mono">{weight.value}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Separator className="bg-white/10" />

      {/* Spacing Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Spacing Scale</h2>
          <p className="text-sm text-white/60">Consistent spacing for layouts and components</p>
        </div>

        <Card className="glass">
          <CardContent className="pt-6 space-y-4">
            {spacing.map((space) => (
              <div key={space.var} className="flex items-center gap-4">
                <div className="w-24 text-sm text-white/60 font-mono">{space.var}</div>
                <div className="flex-1">
                  <div 
                    className="bg-primary h-8" 
                    style={{ width: `var(${space.var})` }}
                  />
                </div>
                <div className="text-xs text-white/40 font-mono w-32 text-right">{space.value}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Separator className="bg-white/10" />

      {/* Border Radius Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Border Radius</h2>
          <p className="text-sm text-white/60">Consistent corner rounding for elements</p>
        </div>

        <div className="space-y-4">
          {radius.map((r) => (
            <Card key={r.var} className="glass">
              <CardContent className="pt-6 space-y-3">
                <div className="text-sm font-mono text-white/60">{r.var}</div>
                <div 
                  className="bg-primary h-20 w-full" 
                  style={{ borderRadius: `var(${r.var})` }}
                />
                <div className="text-xs text-white/40">{r.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="bg-white/10" />

      {/* Shadows Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Shadows</h2>
          <p className="text-sm text-white/60">Elevation and depth for components</p>
        </div>

        <div className="space-y-4">
          {shadows.map((shadow) => (
            <Card key={shadow.var} className="glass">
              <CardContent className="pt-6 space-y-4">
                <div className="text-sm font-mono text-white/60">{shadow.var}</div>
                <div 
                  className="bg-surface h-24 w-full rounded-lg" 
                  style={{ boxShadow: `var(${shadow.var})` }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="bg-white/10" />

      {/* Components Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Components</h2>
          <p className="text-sm text-white/60">Example components using the design system</p>
        </div>

        <div className="grid gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Various button styles and states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Status and label badges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-success text-white">Success</Badge>
                <Badge className="bg-warning text-white">Warning</Badge>
                <Badge className="bg-info text-white">Info</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Glassmorphic Card</CardTitle>
              <CardDescription>Using .glass utility class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="glass p-6 rounded-xl space-y-2">
                <h3 className="font-semibold text-white">Glass Effect</h3>
                <p className="text-sm text-white/60">
                  This card uses the glassmorphic effect with backdrop blur and semi-transparent background.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Text Utilities</CardTitle>
              <CardDescription>Color utility classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-primary font-semibold">.text-primary</p>
              <p className="text-accent font-semibold">.text-accent</p>
              <p className="text-success font-semibold">.text-success</p>
              <p className="text-warning font-semibold">.text-warning</p>
              <p className="text-error font-semibold">.text-error</p>
              <p className="text-info font-semibold">.text-info</p>
              <p className="text-muted">.text-muted</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="bg-white/10" />

      {/* Transitions Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Transitions</h2>
          <p className="text-sm text-white/60">Smooth animation timing functions</p>
        </div>

        <Card className="glass">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-mono text-white/60">--transition-fast (150ms)</div>
              <Button className="transition-fast">Hover me (Fast)</Button>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-mono text-white/60">--transition-base (300ms)</div>
              <Button className="transition-smooth">Hover me (Base)</Button>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-mono text-white/60">--transition-slow (500ms)</div>
              <Button className="transition-slow">Hover me (Slow)</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="bg-white/10" />

      {/* Z-Index Section */}
      <section className="space-y-4 pb-12">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white mb-2">Z-Index Scale</h2>
          <p className="text-sm text-white/60">Layering system for overlapping elements</p>
        </div>

        <Card className="glass">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between p-3 rounded bg-white/5">
              <span className="font-mono text-sm text-white/60">--z-base</span>
              <span className="text-white/40">0</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded bg-white/5">
              <span className="font-mono text-sm text-white/60">--z-dropdown</span>
              <span className="text-white/40">1000</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded bg-white/5">
              <span className="font-mono text-sm text-white/60">--z-sticky</span>
              <span className="text-white/40">1100</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded bg-white/5">
              <span className="font-mono text-sm text-white/60">--z-modal</span>
              <span className="text-white/40">1200</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded bg-white/5">
              <span className="font-mono text-sm text-white/60">--z-popover</span>
              <span className="text-white/40">1300</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded bg-white/5">
              <span className="font-mono text-sm text-white/60">--z-toast</span>
              <span className="text-white/40">1400</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
