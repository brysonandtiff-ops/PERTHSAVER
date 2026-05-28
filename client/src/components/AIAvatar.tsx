import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface AIAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  isThinking?: boolean;
  isSpeaking?: boolean;
  isListening?: boolean;
  mood?: "neutral" | "happy" | "thinking" | "excited" | "processing";
  className?: string;
}

const sizeMap = {
  sm: 48,
  md: 64,
  lg: 96,
  xl: 128,
};

export function AIAvatar({ 
  size = "md", 
  isThinking = false, 
  isSpeaking = false,
  isListening = false,
  mood = "neutral",
  className = ""
}: AIAvatarProps) {
  const [pulsePhase, setPulsePhase] = useState(0);
  const [wavePhase, setWavePhase] = useState(0);
  const dimension = sizeMap[size];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 2) % 360);
      setWavePhase((prev) => (prev + 5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getMoodColor = () => {
    switch (mood) {
      case "happy": return { primary: "#F59E0B", secondary: "#3B82F6", tertiary: "#60A5FA" };
      case "thinking": return { primary: "#8B5CF6", secondary: "#3B82F6", tertiary: "#A78BFA" };
      case "excited": return { primary: "#F59E0B", secondary: "#60A5FA", tertiary: "#FBBF24" };
      case "processing": return { primary: "#3B82F6", secondary: "#8B5CF6", tertiary: "#2563EB" };
      default: return { primary: "#3B82F6", secondary: "#F59E0B", tertiary: "#60A5FA" };
    }
  };

  const colors = getMoodColor();
  const isActive = isThinking || isSpeaking || isListening;

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: dimension, height: dimension }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotate: isThinking ? [0, 2, -2, 0] : 0,
      }}
      transition={{ 
        duration: 0.5, 
        ease: "easeOut",
        rotate: { duration: 0.5, repeat: isThinking ? Infinity : 0, ease: "easeInOut" }
      }}
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="avatarGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary}>
              <animate
                attributeName="stop-color"
                values={`${colors.primary};${colors.secondary};${colors.tertiary};${colors.primary}`}
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor={colors.secondary}>
              <animate
                attributeName="stop-color"
                values={`${colors.secondary};${colors.tertiary};${colors.primary};${colors.secondary}`}
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor={colors.tertiary}>
              <animate
                attributeName="stop-color"
                values={`${colors.tertiary};${colors.primary};${colors.secondary};${colors.tertiary}`}
                dur="3s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
          
          <radialGradient id="coreGlowMain" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="30%" stopColor="rgba(59,130,246,0.5)" />
            <stop offset="70%" stopColor="rgba(245,158,11,0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="70%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </radialGradient>
          
          <filter id="avatarGlowFilterMain" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
          </filter>
          
          <clipPath id="faceClip">
            <circle cx="64" cy="64" r="56" />
          </clipPath>
        </defs>

        <motion.circle
          cx="64"
          cy="64"
          r="60"
          fill="rgba(5,5,5,0.95)"
          stroke="url(#avatarGradMain)"
          strokeWidth={isActive ? 3 : 2}
          filter="url(#avatarGlowFilterMain)"
          animate={{
            strokeWidth: isThinking ? [2, 4, 2] : isActive ? 3 : 2,
            r: isSpeaking ? [60, 61, 60] : 60,
          }}
          transition={{
            duration: 0.8,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        <motion.circle
          cx="64"
          cy="64"
          r="52"
          stroke="url(#avatarGradMain)"
          strokeWidth="1"
          fill="none"
          opacity={0.4}
          strokeDasharray="6 4"
          animate={{
            rotate: 360,
            opacity: isThinking ? [0.4, 0.8, 0.4] : 0.4,
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            opacity: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ transformOrigin: "64px 64px" }}
        />

        <motion.circle
          cx="64"
          cy="64"
          r="44"
          stroke="url(#avatarGradMain)"
          strokeWidth="0.5"
          fill="none"
          opacity={0.25}
          strokeDasharray="3 6"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "64px 64px" }}
        />

        <g clipPath="url(#faceClip)">
          <motion.ellipse
            cx="64"
            cy="70"
            rx="32"
            ry="28"
            fill="url(#avatarGradMain)"
            opacity={0.95}
            animate={{
              ry: isSpeaking ? [28, 30, 28] : 28,
              opacity: isThinking ? [0.9, 1, 0.9] : 0.95,
            }}
            transition={{
              duration: isSpeaking ? 0.2 : 1.5,
              repeat: Infinity,
            }}
          />
          
          <motion.circle
            cx="64"
            cy="54"
            r="26"
            fill="url(#avatarGradMain)"
            opacity={0.95}
          />

          <ellipse cx="48" cy="42" rx="10" ry="14" fill="url(#avatarGradMain)" opacity={0.9} />
          <ellipse cx="80" cy="42" rx="10" ry="14" fill="url(#avatarGradMain)" opacity={0.9} />
          
          <ellipse cx="48" cy="40" rx="5" ry="7" fill="rgba(255,255,255,0.25)" />
          <ellipse cx="80" cy="40" rx="5" ry="7" fill="rgba(255,255,255,0.25)" />

          <motion.g
            animate={{
              y: mood === "happy" || mood === "excited" ? [-1, 1, -1] : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <circle cx="50" cy="54" r="7" fill="rgba(5,5,5,0.95)" filter="url(#innerShadow)" />
            <circle cx="78" cy="54" r="7" fill="rgba(5,5,5,0.95)" filter="url(#innerShadow)" />
            
            <motion.circle
              cx="51"
              cy="53"
              r="3"
              fill="url(#eyeGlow)"
              animate={{
                scale: isThinking ? [1, 1.3, 1] : isSpeaking ? [1, 1.1, 1] : [1, 1.05, 1],
                opacity: [0.9, 1, 0.9],
              }}
              transition={{
                duration: isThinking ? 0.4 : 1.5,
                repeat: Infinity,
              }}
            />
            <motion.circle
              cx="79"
              cy="53"
              r="3"
              fill="url(#eyeGlow)"
              animate={{
                scale: isThinking ? [1, 1.3, 1] : isSpeaking ? [1, 1.1, 1] : [1, 1.05, 1],
                opacity: [0.9, 1, 0.9],
              }}
              transition={{
                duration: isThinking ? 0.4 : 1.5,
                repeat: Infinity,
                delay: 0.15,
              }}
            />
            
            <circle cx="52" cy="52" r="1" fill="white" opacity={0.9} />
            <circle cx="80" cy="52" r="1" fill="white" opacity={0.9} />
          </motion.g>

          <motion.ellipse
            cx="64"
            cy="66"
            rx={isSpeaking ? 5 : 3}
            ry={isSpeaking ? 4 : 2}
            fill="rgba(5,5,5,0.6)"
            animate={{
              rx: isSpeaking ? [3, 6, 4, 5, 3] : 3,
              ry: isSpeaking ? [2, 5, 3, 4, 2] : 2,
            }}
            transition={{
              duration: 0.3,
              repeat: isSpeaking ? Infinity : 0,
              ease: "easeInOut",
            }}
          />

          {(mood === "happy" || mood === "excited") && (
            <motion.path
              d="M52 70 Q64 78 76 70"
              stroke="rgba(5,5,5,0.5)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </g>

        <motion.circle
          cx="64"
          cy="50"
          r="20"
          fill="url(#coreGlowMain)"
          opacity={0.4}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <AnimatePresence>
          {isThinking && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={`thought-${i}`}
                  cx={92 + i * 12}
                  cy={28 - i * 6}
                  r={5 - i}
                  fill="url(#avatarGradMain)"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.3, 1, 0.3],
                    y: [-2, 2, -2],
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.25,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isListening && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.rect
                  key={`wave-${i}`}
                  x={100 + i * 6}
                  y={56}
                  width="3"
                  height="16"
                  rx="1.5"
                  fill="url(#avatarGradMain)"
                  initial={{ scaleY: 0.3, opacity: 0 }}
                  animate={{
                    scaleY: [0.3, 1, 0.5, 0.8, 0.3],
                    opacity: 1,
                  }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: "center" }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <motion.path
          d="M38 98 L20 88 L18 112 Z"
          fill="url(#avatarGradMain)"
          opacity={0.7}
          animate={{ opacity: isActive ? [0.5, 0.8, 0.5] : 0.7 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.path
          d="M90 98 L108 88 L110 112 Z"
          fill="url(#avatarGradMain)"
          opacity={0.7}
          animate={{ opacity: isActive ? [0.5, 0.8, 0.5] : 0.7 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
      </svg>

      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `conic-gradient(from ${pulsePhase}deg, transparent, ${colors.primary}15, transparent, ${colors.secondary}10, transparent)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      {isActive && (
        <motion.div
          className="absolute inset-[-8px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, transparent 50%, ${colors.primary}20 70%, transparent 100%)`,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}

export function AIAvatarMini({ 
  className = "",
  isActive = false,
  isThinking = false,
}: { 
  className?: string;
  isActive?: boolean;
  isThinking?: boolean;
}) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <defs>
          <linearGradient id="miniGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6">
              <animate
                attributeName="stop-color"
                values="#3B82F6;#F59E0B;#60A5FA;#3B82F6"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#F59E0B">
              <animate
                attributeName="stop-color"
                values="#F59E0B;#60A5FA;#3B82F6;#F59E0B"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
          <radialGradient id="miniCoreGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        
        <motion.circle 
          cx="18" 
          cy="18" 
          r="16" 
          stroke="url(#miniGradActive)" 
          strokeWidth={isActive ? 2.5 : 1.5} 
          fill="rgba(5,5,5,0.95)"
          animate={{
            strokeWidth: isThinking ? [1.5, 3, 1.5] : isActive ? 2.5 : 1.5,
          }}
          transition={{ duration: 0.8, repeat: isThinking ? Infinity : 0 }}
        />
        
        <motion.circle 
          cx="18" 
          cy="18" 
          r="10" 
          fill="url(#miniGradActive)" 
          opacity={0.3}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <circle cx="18" cy="16" r="6" fill="url(#miniCoreGlow)" opacity={0.5} />
        
        <circle cx="13" cy="16" r="2.5" fill="rgba(5,5,5,0.9)" />
        <circle cx="23" cy="16" r="2.5" fill="rgba(5,5,5,0.9)" />
        
        <motion.circle
          cx="13.5"
          cy="15.5"
          r="1"
          fill="#3B82F6"
          animate={{ 
            opacity: [0.8, 1, 0.8],
            scale: isThinking ? [1, 1.3, 1] : 1,
          }}
          transition={{ duration: isThinking ? 0.4 : 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="23.5"
          cy="15.5"
          r="1"
          fill="#3B82F6"
          animate={{ 
            opacity: [0.8, 1, 0.8],
            scale: isThinking ? [1, 1.3, 1] : 1,
          }}
          transition={{ duration: isThinking ? 0.4 : 1.5, repeat: Infinity, delay: 0.2 }}
        />
        
        <circle cx="14" cy="15" r="0.4" fill="white" opacity={0.9} />
        <circle cx="24" cy="15" r="0.4" fill="white" opacity={0.9} />
        
        <ellipse cx="18" cy="20" rx="2" ry="1.2" fill="rgba(5,5,5,0.4)" />
      </svg>

      {isActive && (
        <motion.div
          className="absolute inset-[-4px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      {isThinking && (
        <motion.div
          className="absolute -top-1 -right-1"
          initial={{ scale: 0 }}
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400" />
        </motion.div>
      )}
    </motion.div>
  );
}

export function ThinkingIndicator({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center gap-1.5 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"
          animate={{
            y: [-3, 3, -3],
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}
