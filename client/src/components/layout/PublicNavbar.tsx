import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Maximize, Minimize, Cast, Menu, X } from "lucide-react";
import { useFullscreen } from "@/contexts/FullscreenContext";
import { useChromecast } from "@/contexts/ChromecastContext";
import { useState } from "react";

export function PublicNavbar() {
  const { isFullscreen, toggleFullscreen, isSupported: fullscreenSupported } = useFullscreen();
  const { isAvailable: chromecastAvailable, isConnected, connect, disconnect } = useChromecast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Investors", href: "/investors" },
  ];

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none" />
      
      <div className="relative flex h-20 items-center justify-between px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <Link href="/">
          <motion.div 
            className="flex items-center cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            data-testid="logo-public-navbar"
          >
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-tight leading-none">
                <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">Perth</span>
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">Saver</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Smart Savings AI</span>
            </div>
          </motion.div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="px-5 py-2.5 text-sm text-white/60 hover:text-white transition-colors font-medium">
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {fullscreenSupported && (
            <motion.button
              onClick={toggleFullscreen}
              className="hidden sm:flex h-10 w-10 items-center justify-center text-white/40 hover:text-white/80 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-fullscreen"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </motion.button>
          )}

          {chromecastAvailable && (
            <motion.button
              onClick={isConnected ? disconnect : connect}
              className={`hidden sm:flex h-10 w-10 items-center justify-center transition-colors ${
                isConnected 
                  ? 'text-purple-400 hover:text-purple-300' 
                  : 'text-white/40 hover:text-white/80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-chromecast"
              title={isConnected ? "Disconnect from Chromecast" : "Connect to Chromecast"}
            >
              <Cast className="h-5 w-5" />
            </motion.button>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <Link href="/auth" className="px-4 py-2.5 text-sm text-white/60 hover:text-white transition-colors font-medium">
              Sign In
            </Link>
            <Link 
              href="/auth"
              className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl hover:from-purple-400 hover:to-cyan-400 transition-all"
              style={{ 
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.3), 0 0 60px rgba(6, 182, 212, 0.15)'
              }}
              data-testid="button-get-started-nav"
            >
              Get Started
            </Link>
          </div>

          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-10 w-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden absolute top-20 left-0 right-0 glass-card mx-4 p-6 rounded-2xl"
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-white/70 hover:text-white transition-colors font-medium rounded-xl hover:bg-white/5"
              >
                {item.name}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Link 
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-white/70 hover:text-white transition-colors font-medium rounded-xl hover:bg-white/5"
            >
              Sign In
            </Link>
            <Link 
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-center text-white font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500"
            >
              Get Started
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
