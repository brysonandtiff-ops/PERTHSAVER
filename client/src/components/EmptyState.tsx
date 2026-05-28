import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20, delay: 0.1 },
  },
  animate: {
    y: [0, -8, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <motion.div
      className="flex items-center justify-center min-h-[400px] p-4"
      data-testid="empty-state"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="glass-strong border-white/15 max-w-md w-full backdrop-blur-xl">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icon with animation */}
          <motion.div
            className="flex justify-center"
            variants={iconVariants}
            initial="hidden"
            animate={["visible", "animate"]}
          >
            <motion.div
              className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 backdrop-blur-sm border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <Icon
                className="h-12 w-12 text-purple-400"
                data-testid="empty-icon"
              />
            </motion.div>
          </motion.div>

          {/* Content with staggered animation */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2
              className="text-2xl font-display font-bold text-white"
              data-testid="empty-title"
            >
              {title}
            </h2>
            <p
              className="text-white/70 text-sm leading-relaxed"
              data-testid="empty-description"
            >
              {description}
            </p>
          </motion.div>

          {/* Buttons with animation */}
          {(actionLabel || secondaryActionLabel) && (
            <motion.div
              className="flex flex-col gap-3 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {actionLabel && onAction && (
                <motion.button
                  onClick={onAction}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-background font-bold py-2 px-4 w-full touch-target rounded-lg transition-all duration-300"
                  data-testid="button-action"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {actionLabel}
                </motion.button>
              )}

              {secondaryActionLabel && onSecondaryAction && (
                <motion.button
                  onClick={onSecondaryAction}
                  className="border border-white/20 text-white hover:bg-white/10 font-bold py-2 px-4 w-full touch-target rounded-lg transition-all duration-300"
                  data-testid="button-secondary-action"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {secondaryActionLabel}
                </motion.button>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
