import { useAppPreferences } from "@/context/AppPreferencesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sun, Moon, Palette, RefreshCw, Check, X, AlertTriangle, Info, Copy } from "lucide-react";
import { Link } from "wouter";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { TOKEN_VERSION } from "@/lib/tokens";
import perthSaverLogo from "@assets/generated_images/metallic_piggy_bank_coin_logo.png";

export default function ThemeDebug() {
  const { preferences, updatePreferences, resetTheme } = useAppPreferences();
  const [swStatus, setSwStatus] = useState<string>("checking...");
  const [cssVars, setCssVars] = useState<Record<string, string>>({});
  const [storageKeys, setStorageKeys] = useState<string[]>([]);

  useEffect(() => {
    checkServiceWorker();
    extractCSSVariables();
    listStorageKeys();
  }, []);

  const checkServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        setSwStatus(`Active (scope: ${registration.scope})`);
      } else {
        setSwStatus("Not registered (dev mode)");
      }
    } else {
      setSwStatus("Not supported");
    }
  };

  const extractCSSVariables = () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const vars: Record<string, string> = {
      '--cyan-bright': computedStyle.getPropertyValue('--cyan-bright').trim() || 'not set',
      '--emerald-bright': computedStyle.getPropertyValue('--emerald-bright').trim() || 'not set',
      '--obsidian': computedStyle.getPropertyValue('--obsidian').trim() || 'not set',
      '--accent-color': computedStyle.getPropertyValue('--accent-color').trim() || 'not set',
      '--base-font-size': computedStyle.getPropertyValue('--base-font-size').trim() || 'not set',
      '--animation-duration': computedStyle.getPropertyValue('--animation-duration').trim() || 'not set',
      '--glass-alpha': computedStyle.getPropertyValue('--glass-alpha').trim() || 'not set',
    };
    setCssVars(vars);
  };

  const listStorageKeys = () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }
    setStorageKeys(keys.sort());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const handleThemeToggle = () => {
    updatePreferences({ theme: preferences.theme === "dark" ? "light" : "dark" });
  };

  const handleResetTheme = async () => {
    await resetTheme();
    toast({ title: "Theme reset", description: "Cache cleared, reloading..." });
  };

  return (
    <div className="min-h-screen bg-obsidian p-6" data-testid="theme-debug-page">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="btn-cinematic-outline" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Theme Debug Panel
            </h1>
            <Badge variant="outline" className="text-purple-400 border-purple-400/30">DEV ONLY</Badge>
          </div>
          <Button onClick={handleResetTheme} variant="destructive" className="gap-2" data-testid="button-reset-theme">
            <RefreshCw className="h-4 w-4" />
            Reset Theme & Cache
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="card-dark lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Palette className="h-5 w-5 text-purple-400" />
                Current Theme State
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60 mb-1">Theme Mode</p>
                  <p className="text-xl font-semibold text-white flex items-center gap-2">
                    {preferences.theme === "dark" ? <Moon className="h-5 w-5 text-purple-400" /> : <Sun className="h-5 w-5 text-yellow-400" />}
                    {preferences.theme}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60 mb-1">Accent Color</p>
                  <p className="text-xl font-semibold text-purple-400">{preferences.accentColor}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60 mb-1">Animation Level</p>
                  <p className="text-xl font-semibold text-cyan-400">{preferences.animationLevel}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-white/60 mb-1">Font Size</p>
                  <p className="text-xl font-semibold text-white">{preferences.fontSize}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm text-purple-400 mb-1">Token Version</p>
                <p className="text-lg font-mono text-white">{TOKEN_VERSION}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Info className="h-5 w-5 text-purple-400" />
                Service Worker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-white/60 mb-1">Status</p>
                <p className="text-sm font-mono text-cyan-400 break-all">{swStatus}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-white/60 mb-1">data-theme Attribute</p>
                <p className="text-lg font-mono text-purple-400">{document.documentElement.getAttribute('data-theme') || 'not set'}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-white/60 mb-1">HTML Classes</p>
                <p className="text-sm font-mono text-white break-all">{document.documentElement.className || 'none'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="card-dark">
          <CardHeader>
            <CardTitle className="text-white">CSS Variables (Computed)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(cssVars).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => copyToClipboard(`${key}: ${value}`)}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors group"
                >
                  <p className="text-xs text-white/50 font-mono">{key}</p>
                  <p className="text-sm text-purple-400 font-mono truncate">{value}</p>
                  <Copy className="h-3 w-3 text-white/30 group-hover:text-white/60 absolute top-2 right-2 hidden group-hover:block" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-dark">
          <CardHeader>
            <CardTitle className="text-white">localStorage Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {storageKeys.map(key => (
                <Badge 
                  key={key} 
                  variant="outline" 
                  className={`font-mono text-xs ${key.includes('theme') || key.includes('preference') ? 'border-purple-500/50 text-purple-400' : 'border-white/20 text-white/60'}`}
                  onClick={() => copyToClipboard(`${key}: ${localStorage.getItem(key)}`)}
                >
                  {key}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-display font-bold text-white pt-8">UI Component Gallery</h2>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="text-white">Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button className="btn-cinematic" data-testid="button-primary">Primary</Button>
                <Button className="btn-cinematic-outline" data-testid="button-outline">Outline</Button>
                <Button variant="secondary" data-testid="button-secondary">Secondary</Button>
                <Button variant="ghost" data-testid="button-ghost">Ghost</Button>
                <Button variant="destructive" data-testid="button-destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" className="btn-cinematic">Small</Button>
                <Button size="default" className="btn-cinematic">Default</Button>
                <Button size="lg" className="btn-cinematic">Large</Button>
                <Button disabled className="btn-cinematic">Disabled</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="text-white">Forms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Text input" data-testid="input-text" />
              <Select>
                <SelectTrigger data-testid="select-example">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Option 1</SelectItem>
                  <SelectItem value="2">Option 2</SelectItem>
                  <SelectItem value="3">Option 3</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-3">
                <Switch id="switch-demo" data-testid="switch-demo" />
                <label htmlFor="switch-demo" className="text-white/80">Toggle switch</label>
              </div>
              <Slider defaultValue={[50]} max={100} step={1} data-testid="slider-demo" />
            </CardContent>
          </Card>

          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="text-white">Badges & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Cyan</Badge>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Emerald</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="secondary">Secondary</Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Check className="h-4 w-4" /> Success
                </div>
                <div className="flex items-center gap-2 text-red-400">
                  <X className="h-4 w-4" /> Error
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <AlertTriangle className="h-4 w-4" /> Warning
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <Info className="h-4 w-4" /> Info
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="text-white">Logo & Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <img src={perthSaverLogo} alt="Logo SM" className="perth-saver-logo perth-saver-logo-sm mx-auto mb-2" />
                  <p className="text-xs text-white/50">40x40</p>
                </div>
                <div className="text-center">
                  <img src={perthSaverLogo} alt="Logo MD" className="perth-saver-logo perth-saver-logo-md mx-auto mb-2" />
                  <p className="text-xs text-white/50">48x48</p>
                </div>
                <div className="text-center">
                  <img src={perthSaverLogo} alt="Logo LG" className="perth-saver-logo perth-saver-logo-lg mx-auto mb-2" />
                  <p className="text-xs text-white/50">64x64</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="text-white">Typography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Display Heading</h1>
              <h2 className="text-2xl font-display font-bold text-white">Title Heading</h2>
              <p className="text-base text-white/80">Body text - The quick brown fox jumps over the lazy dog.</p>
              <p className="text-sm text-white/60">Caption text - Secondary information</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-400">Micro Label</p>
            </CardContent>
          </Card>

          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="text-white">Glow Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="w-20 h-20 rounded-xl bg-purple-500/20 glow-cyan flex items-center justify-center">
                  <span className="text-purple-400 font-bold">Cyan</span>
                </div>
                <div className="w-20 h-20 rounded-xl bg-cyan-500/20 glow-emerald flex items-center justify-center">
                  <span className="text-cyan-400 font-bold">Emerald</span>
                </div>
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 glow-primary flex items-center justify-center">
                  <span className="text-white font-bold">Primary</span>
                </div>
              </div>
              <p className="glow-text text-xl font-bold">Glowing Cyan Text</p>
              <p className="glow-text-amber text-xl font-bold">Glowing Emerald Text</p>
            </CardContent>
          </Card>
        </div>

        <Card className="card-dark">
          <CardHeader>
            <CardTitle className="text-white">Theme Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-white/60">Theme Mode</label>
                <Button 
                  onClick={handleThemeToggle} 
                  className="w-full btn-cinematic-outline gap-2"
                  data-testid="button-toggle-theme"
                >
                  {preferences.theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {preferences.theme === "dark" ? "Switch to Light" : "Switch to Dark"}
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Accent Color</label>
                <Select 
                  value={preferences.accentColor} 
                  onValueChange={(v) => updatePreferences({ accentColor: v as any })}
                >
                  <SelectTrigger data-testid="select-accent-color">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cyan">Cyan</SelectItem>
                    <SelectItem value="teal">Teal</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Font Size</label>
                <Select 
                  value={preferences.fontSize} 
                  onValueChange={(v) => updatePreferences({ fontSize: v as any })}
                >
                  <SelectTrigger data-testid="select-font-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/60">Animation Level</label>
                <Select 
                  value={preferences.animationLevel} 
                  onValueChange={(v) => updatePreferences({ animationLevel: v as any })}
                >
                  <SelectTrigger data-testid="select-animation-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="reduced">Reduced</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-white/40 text-sm pb-8">
          Theme Debug Panel - Development Use Only
        </div>
      </div>
    </div>
  );
}
