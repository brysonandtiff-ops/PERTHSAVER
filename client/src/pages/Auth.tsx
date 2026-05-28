import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.5, rotateZ: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateZ: 0,
    transition: { duration: 1 },
  },
  hover: {
    scale: 1.05,
    rotateZ: 5,
    transition: { duration: 0.4 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: {
    opacity: 1,
    transition: { duration: 1 },
  },
};

const inputVariants = {
  focus: {
    scale: 1.02,
    transition: { duration: 0.3 },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    boxShadow: "0 0 20px rgba(45, 212, 191, 0.4)",
    transition: { duration: 0.3 },
  },
  tap: {
    scale: 0.98,
  },
};

const bgGradientVariants = {
  animate: {
    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
    transition: {
      duration: 15,
      repeat: Infinity,
    },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
    },
  },
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    firstName: "", 
    lastName: "",
    email: "", 
    password: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });

        setLocation("/dashboard");
      } else {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            location: "Perth, WA",
            household: "single",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Signup failed");
        }

        toast({
          title: "Account created!",
          description: "Welcome to Perth Saver. Let's start saving!",
        });

        setLocation("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="fixed inset-0 z-0"
        variants={bgGradientVariants}
        animate="animate"
        style={{
          background: "linear-gradient(-45deg, rgba(45, 212, 191, 0.1), rgba(34, 211, 238, 0.1), rgba(168, 85, 247, 0.1), rgba(45, 212, 191, 0.1))",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Animated orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 sm:top-20 left-5 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-teal-500/20 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <PublicNavbar />
        
        <div className="flex-1 container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-12 md:py-20 max-w-md flex flex-col justify-center">
          {/* Logo with animation */}
          <motion.div
            className="mb-8 sm:mb-12"
            variants={logoVariants}
            whileHover="hover"
          >
            <motion.div
              className="flex items-center justify-center gap-3 mb-2"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <motion.img
                src="/logo.png"
                alt="Perth Saver"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl drop-shadow-lg"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.h1
                className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-purple-400 via-teal-400 to-purple-500 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Perth Saver
              </motion.h1>
            </motion.div>
            <motion.p
              className="text-center text-white/60 text-xs sm:text-sm font-light tracking-wide"
              variants={itemVariants}
            >
              Smart savings for Perth families
            </motion.p>
          </motion.div>

          {/* Main Card with glassmorphism */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardVariants}
              className="relative group"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <Card className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border-white/20 shadow-2xl">
                <CardHeader className="space-y-2 p-4 sm:p-6">
                  <motion.div variants={itemVariants}>
                    <CardTitle className="font-display text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {isLogin ? "Welcome Back" : "Get Started"}
                    </CardTitle>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <CardDescription className="text-white/60 text-xs sm:text-sm md:text-base">
                      {isLogin 
                        ? "Sign in to unlock your savings potential" 
                        : "Join thousands saving thousands"}
                    </CardDescription>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-4 p-4 sm:p-6">
                  <motion.form onSubmit={handleSubmit} variants={containerVariants}>
                    {!isLogin && (
                      <motion.div className="space-y-4 mb-4" variants={itemVariants}>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">First Name</label>
                          <motion.div
                            className="relative"
                            whileFocus="focus"
                            variants={inputVariants}
                          >
                            <User className="absolute left-3 top-3.5 h-4 w-4 text-purple-400/60" />
                            <Input
                              placeholder="John"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              required={!isLogin}
                              data-testid="input-firstname"
                              className="pl-10 h-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 text-sm"
                            />
                          </motion.div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">Last Name</label>
                          <motion.div
                            className="relative"
                            whileFocus="focus"
                            variants={inputVariants}
                          >
                            <User className="absolute left-3 top-3.5 h-4 w-4 text-purple-400/60" />
                            <Input
                              placeholder="Doe"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              required={!isLogin}
                              data-testid="input-lastname"
                              className="pl-10 h-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 text-sm"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    <motion.div className="space-y-2 mb-4" variants={itemVariants}>
                      <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">Email</label>
                      <motion.div
                        className="relative"
                        whileFocus="focus"
                        variants={inputVariants}
                      >
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-purple-400/60" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          data-testid="input-email"
                          className="pl-10 h-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 text-sm"
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div className="space-y-2 mb-6" variants={itemVariants}>
                      <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">Password</label>
                      <motion.div
                        className="relative"
                        whileFocus="focus"
                        variants={inputVariants}
                      >
                        <Lock className="absolute left-3 top-3.5 h-4 w-4 text-purple-400/60" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          data-testid="input-password"
                          className="pl-10 h-10 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 text-sm"
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        data-testid="button-submit"
                        className="w-full bg-gradient-to-r from-purple-500 via-teal-500 to-purple-500 hover:from-purple-400 hover:via-teal-400 hover:to-purple-400 text-background font-bold h-10 sm:h-12 rounded-lg shadow-lg shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="h-4 w-4 border-2 border-background border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            <span>{isLogin ? "Sign In" : "Create Account"}</span>
                            <motion.div
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </motion.div>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </motion.form>

                  <motion.div className="relative py-4" variants={itemVariants}>
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-gradient-to-br from-white/10 to-transparent text-white/50">OR</span>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <motion.button
                      className="w-full border border-white/20 text-white hover:bg-white/10 h-10 sm:h-12 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm"
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                      Continue with Google
                    </motion.button>
                  </motion.div>

                  <motion.div
                    className="text-center text-xs sm:text-sm text-white/60"
                    variants={itemVariants}
                  >
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <motion.button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      data-testid="button-toggle-mode"
                      className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </motion.button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Footer text */}
          <motion.p
            className="text-xs text-white/40 text-center mt-6 sm:mt-8 leading-relaxed px-2"
            variants={itemVariants}
          >
            By signing up, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
