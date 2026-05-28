import { motion } from "framer-motion";

export function AppleCinematicBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Deep ultra-dark base with subtle gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0A0A0A 0%, #0A0A0F 50%, #0D0D12 100%)"
        }}
      />
      
      {/* Animated Purple & Cyan Gradient Mesh - Primary brand colors */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(ellipse 80% 60% at 20% 30%, rgba(168, 85, 247, 0.18) 0%, transparent 50%), 
             radial-gradient(ellipse 60% 50% at 80% 70%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), 
             radial-gradient(ellipse 70% 55% at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)`,
            `radial-gradient(ellipse 70% 55% at 30% 60%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), 
             radial-gradient(ellipse 80% 60% at 70% 30%, rgba(6, 182, 212, 0.18) 0%, transparent 50%), 
             radial-gradient(ellipse 60% 50% at 50% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`,
            `radial-gradient(ellipse 60% 50% at 80% 40%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), 
             radial-gradient(ellipse 70% 55% at 20% 70%, rgba(168, 85, 247, 0.18) 0%, transparent 50%), 
             radial-gradient(ellipse 80% 60% at 60% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)`,
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Large Floating Purple Orb - Primary - Top Left */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%)",
          filter: "blur(120px)",
          left: "-10%",
          top: "-10%",
        }}
        animate={{
          x: [0, 120, 0],
          y: [0, 100, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Cyan Orb - Secondary - Top Right */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.08) 40%, transparent 70%)",
          filter: "blur(100px)",
          right: "-8%",
          top: "5%",
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, 80, 0],
          scale: [1.1, 0.9, 1.1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Violet Accent Orb - Center */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(139, 92, 246, 0.06) 40%, transparent 70%)",
          filter: "blur(90px)",
          left: "30%",
          top: "20%",
        }}
        animate={{
          x: [0, 140, 0],
          y: [0, -60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Deep Cyan Orb - Bottom Center */}
      <motion.div
        className="absolute w-[750px] h-[750px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, rgba(34, 211, 238, 0.06) 40%, transparent 70%)",
          filter: "blur(110px)",
          left: "25%",
          bottom: "-15%",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -120, 0],
          scale: [0.95, 1.2, 0.95],
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Purple Glow - Bottom Right */}
      <motion.div
        className="absolute w-[550px] h-[550px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.05) 40%, transparent 70%)",
          filter: "blur(85px)",
          right: "5%",
          bottom: "10%",
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, -80, 0],
          scale: [1.05, 0.88, 1.05],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Floating particle accents */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 60%)",
          filter: "blur(60px)",
          left: "55%",
          top: "55%",
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute w-[280px] h-[280px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 60%)",
          filter: "blur(50px)",
          left: "10%",
          bottom: "20%",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -60, 0],
          opacity: [0.4, 0.9, 0.4],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* Small floating sparkles for premium feel */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 50%)",
          filter: "blur(40px)",
          right: "30%",
          top: "40%",
        }}
        animate={{
          x: [0, 80, 0],
          y: [0, 50, 0],
          opacity: [0.3, 0.8, 0.3],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute w-[180px] h-[180px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, transparent 50%)",
          filter: "blur(35px)",
          left: "45%",
          top: "70%",
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          opacity: [0.35, 0.85, 0.35],
          scale: [0.9, 1.3, 0.9],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Futuristic Grid Lines - subtle purple/cyan */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Premium vignette for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Subtle noise texture for premium feel */}
      <div 
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
