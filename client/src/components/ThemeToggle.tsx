import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "dark" | "light" | "system";

const THEME_STORAGE_KEY = "perth-saver-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (newTheme === "system") {
      root.classList.toggle("dark", systemDark);
      root.classList.toggle("light", !systemDark);
    } else {
      root.classList.toggle("dark", newTheme === "dark");
      root.classList.toggle("light", newTheme === "light");
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) return null;

  const iconMap = {
    dark: Moon,
    light: Sun,
    system: Monitor,
  };

  const CurrentIcon = iconMap[theme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
          data-testid="theme-toggle-button"
        >
          <motion.div
            key={theme}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentIcon className="h-4 w-4" />
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-36 bg-slate-900/95 border-purple-500/20 backdrop-blur-xl"
      >
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className={`text-white/80 hover:text-white hover:bg-white/10 cursor-pointer ${theme === "light" ? "bg-purple-500/20" : ""}`}
          data-testid="theme-light"
        >
          <Sun className="h-4 w-4 mr-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className={`text-white/80 hover:text-white hover:bg-white/10 cursor-pointer ${theme === "dark" ? "bg-purple-500/20" : ""}`}
          data-testid="theme-dark"
        >
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className={`text-white/80 hover:text-white hover:bg-white/10 cursor-pointer ${theme === "system" ? "bg-purple-500/20" : ""}`}
          data-testid="theme-system"
        >
          <Monitor className="h-4 w-4 mr-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
