import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 96, height: 96 },
};

export function PerthSaverLogo({ size = "md", animated = true, className = "" }: LogoProps) {
  const { width, height } = sizeMap[size];

  const Logo = animated ? motion.svg : "svg";
  const logoProps = animated
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 },
      }
    : {};

  return (
    <Logo
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...logoProps}
    >
      <defs>
        <linearGradient id="logo-gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        <linearGradient id="logo-gradient-amber" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
        <linearGradient id="logo-gradient-silver" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8E8E8" />
          <stop offset="50%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#A8A8A8" />
        </linearGradient>
        <linearGradient id="coin-shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="inner-shadow">
          <feOffset dx="0" dy="2" />
          <feGaussianBlur stdDeviation="2" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          <feFlood floodColor="black" floodOpacity="0.2" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>

      <circle cx="50" cy="50" r="46" fill="url(#logo-gradient-blue)" filter="url(#logo-glow)" />
      <circle cx="50" cy="50" r="42" fill="#0A0A0A" />
      <circle cx="50" cy="50" r="38" fill="url(#logo-gradient-amber)" opacity="0.15" />

      <g filter="url(#inner-shadow)">
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="url(#logo-gradient-blue)" />
        <ellipse cx="50" cy="60" rx="20" ry="16" fill="#0A0A0A" />
        <ellipse cx="50" cy="59" rx="18" ry="14" fill="url(#logo-gradient-amber)" opacity="0.3" />
        
        <path
          d="M35 55 Q35 40 50 35 Q65 40 65 55"
          stroke="url(#logo-gradient-blue)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="38" cy="42" r="5" fill="url(#logo-gradient-blue)" />
        <circle cx="62" cy="42" r="5" fill="url(#logo-gradient-blue)" />
      </g>

      <g>
        <circle cx="74" cy="28" r="12" fill="url(#logo-gradient-silver)" />
        <circle cx="74" cy="28" r="10" fill="url(#logo-gradient-amber)" />
        <text
          x="74"
          y="32"
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          fontFamily="system-ui"
        >
          $
        </text>
        <circle cx="74" cy="28" r="12" fill="url(#coin-shine)" />
      </g>

      <path
        d="M15 75 Q25 65 35 70 Q45 75 50 68"
        stroke="url(#logo-gradient-blue)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M50 68 Q55 62 65 67 Q75 72 85 65"
        stroke="url(#logo-gradient-amber)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />

      <circle cx="50" cy="50" r="46" stroke="url(#logo-gradient-silver)" strokeWidth="1.5" fill="none" opacity="0.3" />
    </Logo>
  );
}

export function PerthSaverLogoText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="font-display text-2xl font-bold tracking-tight leading-none">
        <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">Perth</span>
        <span className="bg-gradient-to-r from-blue-400 via-amber-400 to-blue-500 bg-clip-text text-transparent">Saver</span>
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Smart Savings AI</span>
    </div>
  );
}

export function LogoWithText({ size = "md", animated = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <PerthSaverLogo size={size} animated={animated} />
      <PerthSaverLogoText />
    </div>
  );
}
