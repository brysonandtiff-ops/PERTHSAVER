import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const DashboardIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="url(#dashGrad)" />
    <circle cx="7" cy="8" r="2" fill="rgba(255,255,255,0.4)" />
    <circle cx="17" cy="16" r="2" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const GroceryIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="grocGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="url(#grocGrad)" />
    <circle cx="12" cy="9" r="1.5" fill="rgba(255,255,255,0.5)" />
  </svg>
);

export const FuelIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="fuelGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="50%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5z" fill="url(#fuelGrad)" />
    <rect x="7" y="6" width="4" height="3" rx="0.5" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const DealsIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="dealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" fill="url(#dealGrad)" />
    <circle cx="5.5" cy="5.5" r="1" fill="rgba(255,255,255,0.6)" />
    <path d="M10 12l2 2 4-4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BillsIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="billGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="url(#billGrad)" />
    <rect x="8" y="12" width="4" height="1" rx="0.5" fill="rgba(255,255,255,0.4)" />
    <rect x="8" y="16" width="6" height="1" rx="0.5" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const SubscriptionsIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="subGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="url(#subGrad)" />
    <rect x="6" y="14" width="4" height="2" rx="0.5" fill="rgba(255,255,255,0.4)" />
    <circle cx="16" cy="15" r="1.5" fill="rgba(255,255,255,0.3)" />
  </svg>
);

export const GoalsIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#goalGrad)" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="6" stroke="url(#goalGrad)" strokeWidth="2" fill="none" opacity="0.7" />
    <circle cx="12" cy="12" r="2" fill="url(#goalGrad)" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="url(#goalGrad)" strokeWidth="1" opacity="0.5" />
  </svg>
);

export const AnalyticsIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="analGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z" fill="url(#analGrad)" />
    <rect x="5" y="9" width="3" height="2" fill="rgba(255,255,255,0.4)" />
    <rect x="10.6" y="5" width="2.8" height="2" fill="rgba(255,255,255,0.4)" />
    <rect x="16.2" y="13" width="2.8" height="2" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const ReportsIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="repGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" fill="url(#repGrad)" />
    <circle cx="16" cy="6" r="2" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const AlertsIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="alertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="url(#alertGrad)" />
    <circle cx="12" cy="11" r="2" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const RewardsIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="rewGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" fill="url(#rewGrad)" />
    <rect x="4" y="16" width="8" height="1.5" rx="0.5" fill="rgba(255,255,255,0.3)" />
  </svg>
);

export const CalculatorIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="calcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 16H5v-2h8v2zm0-4H5v-2h8v2zm0-4H5V9h8v2zm6 8h-4v-6h4v6zm0-8h-4V5h4v6z" fill="url(#calcGrad)" />
    <rect x="6" y="10" width="6" height="1" rx="0.5" fill="rgba(255,255,255,0.4)" />
    <rect x="6" y="14" width="4" height="1" rx="0.5" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const ScannerIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5zM19 13h-1.5v1.5H19V13z" fill="url(#scanGrad)" />
    <rect x="6" y="7" width="2" height="2" rx="0.3" fill="rgba(255,255,255,0.5)" />
    <rect x="6" y="15" width="2" height="2" rx="0.3" fill="rgba(255,255,255,0.5)" />
    <rect x="14" y="7" width="2" height="2" rx="0.3" fill="rgba(255,255,255,0.5)" />
  </svg>
);

export const MealIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="mealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" fill="url(#mealGrad)" />
    <rect x="7.5" y="14" width="2" height="4" rx="0.5" fill="rgba(255,255,255,0.3)" />
  </svg>
);

export const TutorialIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="tutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M8 5v14l11-7z" fill="url(#tutGrad)" />
    <circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const NewsIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="newsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M22 3l-1.67 1.67L18.67 3 17 4.67 15.33 3l-1.66 1.67L12 3l-1.67 1.67L8.67 3 7 4.67 5.33 3 3.67 4.67 2 3v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V3zM11 19H4v-6h7v6zm9 0h-7v-2h7v2zm0-4h-7v-2h7v2zm0-4H4V8h16v3z" fill="url(#newsGrad)" />
    <rect x="5" y="14" width="5" height="3" rx="0.5" fill="rgba(255,255,255,0.3)" />
    <rect x="5" y="9" width="10" height="1.5" rx="0.5" fill="rgba(255,255,255,0.3)" />
  </svg>
);

export const ChallengesIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="chalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path d="M7 2v11h3v9l7-12h-4l4-8z" fill="url(#chalGrad)" />
    <path d="M10 8l2-4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CommunityIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="commGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="url(#commGrad)" />
    <circle cx="8" cy="8" r="1.5" fill="rgba(255,255,255,0.4)" />
    <circle cx="16" cy="8" r="1.5" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const LeaderboardIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="leadGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" fill="url(#leadGrad)" />
    <rect x="9" y="6" width="6" height="1" rx="0.5" fill="rgba(255,255,255,0.4)" />
    <rect x="9" y="8" width="4" height="1" rx="0.5" fill="rgba(255,255,255,0.3)" />
  </svg>
);

export const ReferralIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="refGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="url(#refGrad)" />
    <circle cx="15" cy="8" r="2" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const SearchIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <circle cx="11" cy="11" r="6" stroke="url(#searchGrad)" strokeWidth="2" fill="none" />
    <path d="M16 16l4 4" stroke="url(#searchGrad)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="11" cy="11" r="2" fill="rgba(6,182,212,0.3)" />
  </svg>
);

export const FamilyIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="famGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="4" r="2" fill="url(#famGrad)" />
    <circle cx="6" cy="8" r="1.5" fill="url(#famGrad)" opacity="0.8" />
    <circle cx="18" cy="8" r="1.5" fill="url(#famGrad)" opacity="0.8" />
    <path d="M12 6c-1.1 0-2 .9-2 2v4h4V8c0-1.1-.9-2-2-2z" fill="url(#famGrad)" />
    <path d="M6 9.5c-.83 0-1.5.67-1.5 1.5v3h3v-3c0-.83-.67-1.5-1.5-1.5zM18 9.5c-.83 0-1.5.67-1.5 1.5v3h3v-3c0-.83-.67-1.5-1.5-1.5z" fill="url(#famGrad)" opacity="0.7" />
    <path d="M3 16v4h6v-4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zM15 16v4h6v-4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2zM9 14v6h6v-6c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2z" fill="url(#famGrad)" />
  </svg>
);

export const SettingsIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="setGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="url(#setGrad)" />
    <circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.4)" />
  </svg>
);

export const AICoachIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="50%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
      <filter id="aiGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#aiGrad)" strokeWidth="1.5" fill="rgba(6,182,212,0.1)" filter="url(#aiGlow)" />
    <circle cx="12" cy="12" r="6" stroke="url(#aiGrad)" strokeWidth="1" fill="none" opacity="0.6" />
    <circle cx="12" cy="12" r="3" fill="url(#aiGrad)" />
    <circle cx="12" cy="12" r="1.5" fill="rgba(255,255,255,0.6)" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="url(#aiGrad)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    <path d="M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" stroke="url(#aiGrad)" strokeWidth="0.75" strokeLinecap="round" opacity="0.3" />
  </svg>
);

export const QuokkaIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="quokGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <ellipse cx="12" cy="14" rx="8" ry="6" fill="url(#quokGrad)" />
    <circle cx="12" cy="10" r="6" fill="url(#quokGrad)" />
    <ellipse cx="7" cy="7" rx="2" ry="3" fill="url(#quokGrad)" />
    <ellipse cx="17" cy="7" rx="2" ry="3" fill="url(#quokGrad)" />
    <ellipse cx="7" cy="6" rx="1" ry="1.5" fill="rgba(255,255,255,0.3)" />
    <ellipse cx="17" cy="6" rx="1" ry="1.5" fill="rgba(255,255,255,0.3)" />
    <circle cx="9" cy="9" r="1.2" fill="white" />
    <circle cx="15" cy="9" r="1.2" fill="white" />
    <circle cx="9.3" cy="9" r="0.6" fill="#1a1a1a" />
    <circle cx="15.3" cy="9" r="0.6" fill="#1a1a1a" />
    <ellipse cx="12" cy="12" rx="1.5" ry="1" fill="rgba(0,0,0,0.3)" />
    <path d="M10 14q2 1 4 0" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" fill="none" />
  </svg>
);
