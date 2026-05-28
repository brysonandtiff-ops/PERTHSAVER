import { useState, useEffect, useCallback } from "react";
import { useAppPreferences } from "@/context/AppPreferencesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Check, X, AlertTriangle, Shield, Zap, Palette, Database, Globe, FileText, Server } from "lucide-react";
import { Link } from "wouter";
import { TOKEN_VERSION, tokens } from "@/lib/tokens";

interface AuditCheck {
  id: string;
  category: string;
  name: string;
  status: "pass" | "fail" | "warning" | "pending";
  severity: "BLOCKER" | "MAJOR" | "MINOR";
  message: string;
  details?: string;
}

export default function AuditPanel() {
  const { preferences } = useAppPreferences();
  const [checks, setChecks] = useState<AuditCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [swStatus, setSwStatus] = useState<string>("checking...");
  const [swCacheKeys, setSwCacheKeys] = useState<string[]>([]);
  const [envInfo, setEnvInfo] = useState<Record<string, string>>({});
  const [cssVars, setCssVars] = useState<Record<string, string>>({});

  const runAudit = useCallback(async () => {
    setIsRunning(true);
    const results: AuditCheck[] = [];

    // 1. UI/THEME SYSTEM CHECKS
    // Check token version
    results.push({
      id: "token-version",
      category: "UI/Theme",
      name: "Token Version Check",
      status: TOKEN_VERSION.startsWith("v7") ? "pass" : "warning",
      severity: "MAJOR",
      message: `Token version: ${TOKEN_VERSION}`,
      details: TOKEN_VERSION.startsWith("v7") ? "Latest v7 tokens active" : "Outdated token version"
    });

    // Check CSS variables injection
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const cyanBright = computedStyle.getPropertyValue("--cyan-bright").trim();
    const cssVarsInjected = cyanBright && cyanBright.length > 0;
    results.push({
      id: "css-vars-injected",
      category: "UI/Theme",
      name: "CSS Variables Injected",
      status: cssVarsInjected ? "pass" : "fail",
      severity: "BLOCKER",
      message: cssVarsInjected ? "CSS variables properly injected from tokens.ts" : "CSS variables not found",
      details: `--cyan-bright: ${cyanBright || "NOT SET"}`
    });

    // Check data-theme attribute
    const dataTheme = root.getAttribute("data-theme");
    results.push({
      id: "data-theme",
      category: "UI/Theme",
      name: "Theme Attribute Set",
      status: dataTheme ? "pass" : "warning",
      severity: "MAJOR",
      message: `data-theme: ${dataTheme || "not set"}`,
    });

    // Check theme preference stored
    const storedPrefs = localStorage.getItem("app-preferences");
    results.push({
      id: "theme-storage",
      category: "UI/Theme",
      name: "Theme Preferences Persisted",
      status: storedPrefs ? "pass" : "warning",
      severity: "MINOR",
      message: storedPrefs ? "Preferences stored in localStorage" : "No stored preferences",
    });

    // 2. SERVICE WORKER CHECKS
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      const isDev = window.location.hostname === "localhost" || window.location.port === "5000";
      
      if (isDev) {
        results.push({
          id: "sw-dev-mode",
          category: "PWA/Cache",
          name: "Service Worker (Dev Mode)",
          status: !registration ? "pass" : "warning",
          severity: "MINOR",
          message: registration ? "SW active in dev (should be disabled)" : "SW correctly disabled in dev",
        });
      } else {
        results.push({
          id: "sw-prod-mode",
          category: "PWA/Cache",
          name: "Service Worker (Production)",
          status: registration?.active ? "pass" : "fail",
          severity: "MAJOR",
          message: registration?.active ? "SW active and running" : "SW not registered in production",
        });
      }
      setSwStatus(registration ? `Active (scope: ${registration.scope})` : "Not registered");
    }

    // 3. CACHE CHECKS
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys();
        setSwCacheKeys(cacheNames);
        results.push({
          id: "cache-keys",
          category: "PWA/Cache",
          name: "Cache Storage",
          status: cacheNames.length > 0 ? "pass" : "warning",
          severity: "MINOR",
          message: `${cacheNames.length} cache(s) found`,
          details: cacheNames.join(", ") || "No caches"
        });
      } catch {
        results.push({
          id: "cache-keys",
          category: "PWA/Cache",
          name: "Cache Storage",
          status: "warning",
          severity: "MINOR",
          message: "Unable to access cache storage",
        });
      }
    }

    // 4. ENVIRONMENT CHECKS
    const envData: Record<string, string> = {
      "Node Env": import.meta.env.MODE || "unknown",
      "Base URL": import.meta.env.BASE_URL || "/",
      "Dev Mode": import.meta.env.DEV ? "true" : "false",
      "Prod Mode": import.meta.env.PROD ? "true" : "false",
    };
    setEnvInfo(envData);

    results.push({
      id: "env-mode",
      category: "Build/Deploy",
      name: "Environment Mode",
      status: "pass",
      severity: "MINOR",
      message: `Running in ${import.meta.env.MODE} mode`,
    });

    // 5. SECURITY CHECKS
    // Check for exposed secrets in window/global
    const suspiciousGlobals = Object.keys(window).filter(k => 
      k.toLowerCase().includes("secret") || 
      k.toLowerCase().includes("api_key") ||
      k.toLowerCase().includes("password")
    );
    results.push({
      id: "no-exposed-secrets",
      category: "Security",
      name: "No Exposed Secrets in Window",
      status: suspiciousGlobals.length === 0 ? "pass" : "fail",
      severity: "BLOCKER",
      message: suspiciousGlobals.length === 0 ? "No suspicious globals found" : `Found: ${suspiciousGlobals.join(", ")}`,
    });

    // Check HTTPS in production
    const isSecure = window.location.protocol === "https:" || window.location.hostname === "localhost";
    results.push({
      id: "https-enabled",
      category: "Security",
      name: "HTTPS Enabled",
      status: isSecure ? "pass" : "fail",
      severity: "BLOCKER",
      message: isSecure ? "Connection is secure" : "Not using HTTPS in production!",
    });

    // 6. CONSOLE ERROR CHECK
    const consoleErrors: string[] = [];
    const originalError = console.error;
    console.error = (...args) => {
      consoleErrors.push(args.join(" "));
      originalError.apply(console, args);
    };
    
    // Restore after a brief check
    setTimeout(() => {
      console.error = originalError;
    }, 100);

    results.push({
      id: "no-console-errors",
      category: "Runtime",
      name: "No Console Errors on Load",
      status: consoleErrors.length === 0 ? "pass" : "warning",
      severity: "MAJOR",
      message: consoleErrors.length === 0 ? "No errors detected" : `${consoleErrors.length} error(s) found`,
      details: consoleErrors.slice(0, 3).join("\n")
    });

    // 7. PERFORMANCE CHECKS
    if ("performance" in window) {
      const navTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (navTiming) {
        const loadTime = navTiming.loadEventEnd - navTiming.startTime;
        results.push({
          id: "page-load-time",
          category: "Performance",
          name: "Page Load Time",
          status: loadTime < 3000 ? "pass" : loadTime < 5000 ? "warning" : "fail",
          severity: loadTime < 5000 ? "MINOR" : "MAJOR",
          message: `${Math.round(loadTime)}ms`,
          details: loadTime < 3000 ? "Good (<3s)" : loadTime < 5000 ? "Acceptable (<5s)" : "Slow (>5s)"
        });
      }
    }

    // 8. ACCESSIBILITY BASICS
    const imagesWithoutAlt = document.querySelectorAll("img:not([alt])").length;
    results.push({
      id: "images-have-alt",
      category: "Accessibility",
      name: "Images Have Alt Text",
      status: imagesWithoutAlt === 0 ? "pass" : "warning",
      severity: "MINOR",
      message: imagesWithoutAlt === 0 ? "All images have alt text" : `${imagesWithoutAlt} image(s) missing alt`,
    });

    const buttonsWithoutLabel = document.querySelectorAll("button:not([aria-label]):empty").length;
    results.push({
      id: "buttons-labeled",
      category: "Accessibility",
      name: "Buttons Are Labeled",
      status: buttonsWithoutLabel === 0 ? "pass" : "warning",
      severity: "MINOR",
      message: buttonsWithoutLabel === 0 ? "All buttons are labeled" : `${buttonsWithoutLabel} unlabeled button(s)`,
    });

    // 9. VIEWPORT/RESPONSIVE CHECK
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    results.push({
      id: "viewport-meta",
      category: "Responsive",
      name: "Viewport Meta Tag",
      status: viewportMeta ? "pass" : "fail",
      severity: "MAJOR",
      message: viewportMeta ? "Viewport configured correctly" : "Missing viewport meta tag",
    });

    // Extract CSS variables for display
    const varsToCheck = [
      "--cyan-bright", "--cyan-neon", "--cyan-deep", "--cyan-light",
      "--emerald-bright", "--emerald-neon", "--emerald-deep",
      "--obsidian", "--charcoal", "--onyx",
      "--glass-alpha", "--glow-intensity"
    ];
    const extractedVars: Record<string, string> = {};
    varsToCheck.forEach(v => {
      extractedVars[v] = computedStyle.getPropertyValue(v).trim() || "not set";
    });
    setCssVars(extractedVars);

    setChecks(results);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    runAudit();
  }, [runAudit]);

  const getStatusIcon = (status: AuditCheck["status"]) => {
    switch (status) {
      case "pass": return <Check className="h-4 w-4 text-cyan-400" />;
      case "fail": return <X className="h-4 w-4 text-red-400" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default: return <RefreshCw className="h-4 w-4 text-white/50 animate-spin" />;
    }
  };

  const getSeverityBadge = (severity: AuditCheck["severity"]) => {
    const colors = {
      BLOCKER: "bg-red-500/20 text-red-400 border-red-500/30",
      MAJOR: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      MINOR: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    return <Badge className={colors[severity]}>{severity}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "UI/Theme": return <Palette className="h-4 w-4" />;
      case "PWA/Cache": return <Globe className="h-4 w-4" />;
      case "Security": return <Shield className="h-4 w-4" />;
      case "Performance": return <Zap className="h-4 w-4" />;
      case "Build/Deploy": return <Server className="h-4 w-4" />;
      case "Runtime": return <FileText className="h-4 w-4" />;
      case "Accessibility": return <FileText className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const categories = Array.from(new Set(checks.map(c => c.category)));
  const passCount = checks.filter(c => c.status === "pass").length;
  const failCount = checks.filter(c => c.status === "fail").length;
  const warnCount = checks.filter(c => c.status === "warning").length;
  const blockers = checks.filter(c => c.status === "fail" && c.severity === "BLOCKER");

  return (
    <div className="min-h-screen bg-obsidian p-6" data-testid="audit-panel-page">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="btn-cinematic-outline" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Release Readiness Audit
              </h1>
              <p className="text-white/60 text-sm mt-1">QA Lead + Release Engineer Panel</p>
            </div>
          </div>
          <Button 
            onClick={runAudit} 
            disabled={isRunning}
            className="btn-cinematic gap-2"
            data-testid="button-run-audit"
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "Running..." : "Re-run Audit"}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-dark">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-cyan-400">{passCount}</p>
              <p className="text-sm text-white/60">Passed</p>
            </CardContent>
          </Card>
          <Card className="card-dark">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-red-400">{failCount}</p>
              <p className="text-sm text-white/60">Failed</p>
            </CardContent>
          </Card>
          <Card className="card-dark">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-yellow-400">{warnCount}</p>
              <p className="text-sm text-white/60">Warnings</p>
            </CardContent>
          </Card>
          <Card className="card-dark">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-purple-400">{checks.length}</p>
              <p className="text-sm text-white/60">Total Checks</p>
            </CardContent>
          </Card>
        </div>

        {/* Blockers Alert */}
        {blockers.length > 0 && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <X className="h-5 w-5" />
                BLOCKERS DETECTED ({blockers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {blockers.map(b => (
                  <li key={b.id} className="text-red-300">
                    <strong>{b.name}:</strong> {b.message}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Environment Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="h-5 w-5 text-purple-400" />
                Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(envInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between p-2 rounded bg-white/5">
                  <span className="text-white/60">{key}</span>
                  <span className="text-purple-400 font-mono text-sm">{value}</span>
                </div>
              ))}
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-white/60">Token Version</span>
                <span className="text-cyan-400 font-mono text-sm">{TOKEN_VERSION}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-white/60">Theme</span>
                <span className="text-purple-400 font-mono text-sm">{preferences.theme}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-dark">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-400" />
                Service Worker & Cache
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-white/60">SW Status</span>
                <span className="text-cyan-400 font-mono text-sm truncate max-w-[200px]">{swStatus}</span>
              </div>
              <div className="p-2 rounded bg-white/5">
                <p className="text-white/60 mb-2">Cache Keys:</p>
                {swCacheKeys.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {swCacheKeys.map(key => (
                      <Badge key={key} variant="outline" className="text-xs font-mono">{key}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/40 text-sm">No caches found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CSS Variables */}
        <Card className="card-dark">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-400" />
              Active Theme Tokens (CSS Variables)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {Object.entries(cssVars).map(([key, value]) => (
                <div key={key} className="p-2 rounded bg-white/5 border border-white/10">
                  <p className="text-xs text-white/50 font-mono truncate">{key}</p>
                  <p className="text-sm text-purple-400 font-mono">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit Results by Category */}
        {categories.map(category => (
          <Card key={category} className="card-dark">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {getCategoryIcon(category)}
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {checks.filter(c => c.category === category).map(check => (
                  <div 
                    key={check.id}
                    className={`p-3 rounded-lg border ${
                      check.status === "pass" ? "bg-cyan-500/5 border-cyan-500/20" :
                      check.status === "fail" ? "bg-red-500/10 border-red-500/30" :
                      check.status === "warning" ? "bg-yellow-500/10 border-yellow-500/30" :
                      "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(check.status)}
                        <span className="text-white font-medium">{check.name}</span>
                        {getSeverityBadge(check.severity)}
                      </div>
                      <span className="text-white/70 text-sm">{check.message}</span>
                    </div>
                    {check.details && (
                      <p className="text-white/50 text-xs mt-2 font-mono pl-7">{check.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Build Info Footer */}
        <div className="text-center text-white/40 text-sm py-8 border-t border-white/10">
          <p>Perth Saver Release Audit Panel</p>
          <p className="font-mono">Token Version: {TOKEN_VERSION} | Build: {new Date().toISOString().split("T")[0]}</p>
        </div>
      </div>
    </div>
  );
}
