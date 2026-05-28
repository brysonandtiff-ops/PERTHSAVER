import { motion, type Variants } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AchievementBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  points: number;
  isUnlocked?: boolean;
  delay?: number;
}

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0, rotateZ: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateZ: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
  hover: {
    scale: 1.1,
    boxShadow: "0 0 30px rgba(168, 85, 247, 0.5)",
    transition: { duration: 0.3 },
  },
  unlock: {
    scale: [1, 1.2, 1],
    rotateZ: [0, 10, -10, 0],
    transition: { duration: 0.6 },
  },
};

const pulseVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2, repeat: Infinity },
  },
};

export function AchievementBadge({
  icon: Icon,
  title,
  description,
  points,
  isUnlocked = false,
  delay = 0,
}: AchievementBadgeProps) {
  return (
    <motion.div
      className={`relative flex flex-col items-center p-4 rounded-2xl border-2 ${
        isUnlocked
          ? "bg-gradient-to-br from-purple-500/20 to-purple-500/10 border-purple-500/50"
          : "bg-white/5 border-white/10"
      } backdrop-blur-sm hover:border-purple-500/70 transition-all duration-300`}
      variants={badgeVariants}
      initial="hidden"
      animate={isUnlocked ? ["visible", "unlock"] : "visible"}
      whileHover="hover"
      transition={{ delay }}
    >
      {/* Unlock glow effect */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-transparent rounded-2xl pointer-events-none"
          variants={pulseVariants}
          animate="animate"
        />
      )}

      {/* Icon */}
      <motion.div
        className={`relative p-3 rounded-xl mb-3 ${
          isUnlocked
            ? "bg-gradient-to-br from-purple-500/30 to-purple-500/20"
            : "bg-white/10"
        }`}
        animate={isUnlocked ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon
          className={`h-6 w-6 ${isUnlocked ? "text-purple-400" : "text-white/40"}`}
        />
      </motion.div>

      {/* Content */}
      <h3
        className={`font-display font-bold text-sm text-center ${
          isUnlocked ? "text-white" : "text-white/60"
        }`}
      >
        {title}
      </h3>
      <p className="text-xs text-white/50 text-center mt-1">{description}</p>

      {/* Points badge */}
      <motion.div
        className={`relative mt-3 px-3 py-1 rounded-full text-xs font-bold ${
          isUnlocked
            ? "bg-green-500/30 text-green-300"
            : "bg-white/10 text-white/40"
        }`}
        animate={isUnlocked ? { y: [0, 2, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {isUnlocked ? `+${points} pts` : "Locked"}
      </motion.div>
    </motion.div>
  );
}
