import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bug, Check, X, AlertTriangle, RefreshCw, Trash2,
  Palette, Type, Layout, Image, Zap, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tokens, TOKEN_VERSION, TOKEN_TIMESTAMP } from "@/lib/tokens";

interface HealthCheckItem {
  id: string;
  name: string;
  status: "pass" | "warn" | "fail";
  message: string;
  category: "colors" | "assets" | "layout" | "typography" | "animation";
}

/**
 * Runtime Theme Health Check Panel
 * Hidden dev menu for instant diagnosis
 * 
 * Shows:
 * - Current token stamp
 * - CSS variables present
 * - Logo asset resolved
 * - Header/footer layout version
 * - Route using Layout yes/no
 */

export function ThemeHealthCheck() {
  const [isOpen, setIsOpen] = useState(false);
  const [checks, setChecks] = useState<HealthCheckItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Keyboard shortcut: Ctrl+Shift+T to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runHealthChecks = async () => {
    setIsRunning(true);
    const results: HealthCheckItem[] = [];

    // 1. Check CSS Variables
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    const cssVars = [
      { name: "--color-purple-500", expected: "#06b6d4" },
      { name: "--color-cyan-500", expected: "#10b981" },
      { name: "--background", expected: true },
      { name: "--foreground", expected: true },
    ];

    for (const cssVar of cssVars) {
      const value = computedStyle.getPropertyValue(cssVar.name).trim();
      results.push({
        id: `css-${cssVar.name}`,
        name: `CSS Variable: ${cssVar.name}`,
        status: value ? "pass" : "warn",
        message: value ? `Value: ${value}` : "Not defined",
        category: "colors",
      });
    }

    // 2. Check Logo Assets
    const logoSelectors = [
      '[data-testid="logo-public-navbar"]',
      '[data-testid="logo-sidebar"]',
      '[data-testid="logo-footer-main"]',
    ];

    for (const selector of logoSelectors) {
      const el = document.querySelector(selector) as HTMLImageElement | null;
      results.push({
        id: `logo-${selector}`,
        name: `Logo: ${selector.replace('[data-testid="', '').replace('"]', '')}`,
        status: el && el.complete && el.naturalWidth > 0 ? "pass" : "fail",
        message: el ? (el.complete ? "Loaded" : "Loading...") : "Not found in DOM",
        category: "assets",
      });
    }

    // 3. Check Layout Elements
    const layoutElements = [
      { selector: "header", name: "Header" },
      { selector: "footer", name: "Footer" },
      { selector: "nav", name: "Navigation" },
      { selector: "main", name: "Main Content" },
    ];

    for (const elem of layoutElements) {
      const el = document.querySelector(elem.selector);
      results.push({
        id: `layout-${elem.selector}`,
        name: `Layout: ${elem.name}`,
        status: el ? "pass" : "warn",
        message: el ? "Present" : "Not found",
        category: "layout",
      });
    }

    // 4. Check Typography
    const bodyStyle = getComputedStyle(document.body);
    const fontFamily = bodyStyle.fontFamily;
    const hasInterFont = fontFamily.toLowerCase().includes("inter");
    
    results.push({
      id: "typography-font",
      name: "Primary Font (Inter)",
      status: hasInterFont ? "pass" : "warn",
      message: fontFamily.slice(0, 50),
      category: "typography",
    });

    // 5. Check Framer Motion
    const motionElements = document.querySelectorAll("[data-framer-portal-id], [style*='transform']");
    results.push({
      id: "animation-framer",
      name: "Framer Motion Active",
      status: motionElements.length > 0 ? "pass" : "warn",
      message: `${motionElements.length} animated elements`,
      category: "animation",
    });

    // 6. Check Theme Version
    results.push({
      id: "token-version",
      name: "Token Version",
      status: "pass",
      message: `${TOKEN_VERSION} (${new Date(TOKEN_TIMESTAMP).toLocaleTimeString()})`,
      category: "colors",
    });

    setChecks(results);
    setIsRunning(false);
  };

  const forceRefreshTheme = () => {
    // Clear cached styles
    const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
    styleSheets.forEach((sheet) => {
      const href = sheet.getAttribute("href");
      if (href) {
        sheet.setAttribute("href", `${href.split("?")[0]}?_cb=${Date.now()}`);
      }
    });

    // Force re-render
    window.location.reload();
  };

  const clearUICache = () => {
    // Clear localStorage UI cache
    const keysToRemove = [
      "sidebar:state",
      "perthsaver.ai.chatHistory.v1",
      "perthsaver.theme.cache",
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear sessionStorage
    sessionStorage.clear();

    alert("UI cache cleared. Refresh to see changes.");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "colors": return Palette;
      case "assets": return Image;
      case "layout": return Layout;
      case "typography": return Type;
      case "animation": return Zap;
      default: return Settings;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass": return "text-cyan-400";
      case "warn": return "text-cyan-400";
      case "fail": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass": return Check;
      case "warn": return AlertTriangle;
      case "fail": return X;
      default: return Bug;
    }
  };

  const passCount = checks.filter(c => c.status === "pass").length;
  const warnCount = checks.filter(c => c.status === "warn").length;
  const failCount = checks.filter(c => c.status === "fail").length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-[100] w-96 max-h-[80vh] overflow-hidden"
      >
        <Card className="glass-strong border-purple-500/20 shadow-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bug className="w-5 h-5 text-purple-400" />
                Theme Health Check
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Badge variant="outline" className="text-xs">
                {TOKEN_VERSION}
              </Badge>
              <span>Press Ctrl+Shift+T to toggle</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={runHealthChecks}
                disabled={isRunning}
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600"
              >
                {isRunning ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Bug className="w-4 h-4 mr-2" />
                )}
                Run Checks
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={forceRefreshTheme}
                className="border-purple-500/30"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearUICache}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Summary */}
            {checks.length > 0 && (
              <div className="flex gap-4 text-sm">
                <span className="text-cyan-400">{passCount} Pass</span>
                <span className="text-cyan-400">{warnCount} Warn</span>
                <span className="text-red-400">{failCount} Fail</span>
              </div>
            )}

            {/* Results */}
            <div className="max-h-60 overflow-y-auto space-y-2">
              {checks.map((check) => {
                const Icon = getCategoryIcon(check.category);
                const StatusIcon = getStatusIcon(check.status);
                return (
                  <motion.div
                    key={check.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-2 p-2 rounded-lg bg-white/5"
                  >
                    <Icon className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(check.status)}`} />
                        <span className="text-sm text-white/80 truncate">{check.name}</span>
                      </div>
                      <span className="text-xs text-white/40 truncate block">{check.message}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {checks.length === 0 && (
              <div className="text-center py-8 text-white/40">
                <Bug className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click "Run Checks" to diagnose</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default ThemeHealthCheck;
