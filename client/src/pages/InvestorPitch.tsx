import { useState } from "react";
import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, BarChart3, Zap, Users, TrendingUp, Check, Brain, Layers, Target, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import perthSaverLogo from "@assets/generated_images/metallic_piggy_bank_coin_logo.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function InvestorPitch() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPitch = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/investors/pitch-document", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to generate document");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Perth-Saver-Investor-Pitch-2025.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Successful",
        description: "Investor pitch document downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the investor pitch document",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const highlights = [
    {
      icon: TrendingUp,
      title: "55+ Fully Functional Pages",
      description: "Comprehensive savings platform with 49+ categories",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Users,
      title: "10K+ Active Users",
      description: "$2.1M+ total savings by Perth families",
      gradient: "from-cyan-500 to-cyan-600",
    },
    {
      icon: Brain,
      title: "Multi-Model AI Intelligence",
      description: "Claude 4.5, Gemini 3 Pro & GPT-5.1 integration",
      gradient: "from-purple-500 to-cyan-500",
    },
    {
      icon: BarChart3,
      title: "Scalable Architecture",
      description: "PostgreSQL, React, Express, TypeScript - enterprise-grade",
      gradient: "from-slate-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-obsidian">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          className="relative py-20 md:py-32 px-4 md:px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center top, rgba(var(--purple-500), 0.08) 0%, transparent 50%)'
            }}
          />
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center space-y-6">
              {/* Logo */}
              <motion.div variants={itemVariants} className="flex justify-center mb-8">
                <motion.img 
                  src={perthSaverLogo} 
                  alt="Perth Saver" 
                  className="w-20 h-20 rounded-2xl"
                  style={{ 
                    boxShadow: '0 0 40px rgba(var(--purple-500), 0.4), 0 0 80px rgba(var(--cyan-500), 0.2)'
                  }}
                  whileHover={{ scale: 1.1 }}
                  animate={{ 
                    boxShadow: [
                      '0 0 40px rgba(var(--purple-500), 0.4), 0 0 80px rgba(var(--cyan-500), 0.2)',
                      '0 0 60px rgba(var(--purple-500), 0.6), 0 0 100px rgba(var(--cyan-500), 0.3)',
                      '0 0 40px rgba(var(--purple-500), 0.4), 0 0 80px rgba(var(--cyan-500), 0.2)',
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              {/* Badge */}
              <motion.div 
                variants={itemVariants} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mx-auto"
                style={{
                  background: 'linear-gradient(135deg, rgba(var(--purple-500), 0.15), rgba(var(--cyan-500), 0.1))',
                  boxShadow: '0 0 20px rgba(var(--purple-500), 0.2)'
                }}
              >
                <FileText className="h-4 w-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-semibold uppercase tracking-wider">Investor Resources</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Perth Saver
                </span>
                <br />
                <span className="text-white">Investor Pitch</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
                Download our comprehensive investor pitch containing business overview, market analysis, financial projections, and $55-92M valuation details.
              </motion.p>

              <motion.div variants={itemVariants} className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleDownloadPitch}
                    disabled={isDownloading}
                    className="text-white font-bold px-8 py-6 gap-2 text-lg rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgb(var(--purple-500)), rgb(var(--cyan-500)))',
                      boxShadow: '0 0 40px rgba(var(--purple-500), 0.4), 0 0 80px rgba(var(--cyan-500), 0.2)'
                    }}
                    data-testid="button-download-pitch"
                  >
                    <Download className="h-5 w-5" />
                    {isDownloading ? "Generating..." : "Download Pitch Deck"}
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Highlights Section */}
        <motion.section
          className="py-20 md:py-24 px-4 md:px-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <motion.span variants={itemVariants} className="text-purple-400 text-sm font-semibold uppercase tracking-widest">
                Investment Opportunity
              </motion.span>
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-display font-bold text-white mt-4">
                Key Investment Highlights
              </motion.h2>
            </div>

            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-2 gap-6"
            >
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={idx} 
                    variants={itemVariants}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Card 
                      className="h-full transition-all duration-300"
                      style={{
                        background: 'rgba(var(--charcoal), 0.8)',
                        border: '1px solid rgba(var(--purple-500), 0.1)',
                        boxShadow: '0 8px 32px rgba(var(--black), 0.4)'
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <motion.div 
                            className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} flex-shrink-0`}
                            style={{ boxShadow: '0 0 20px rgba(var(--purple-500), 0.3)' }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                            <p className="text-white/50">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.section>

        {/* Document Contents Section */}
        <motion.section
          className="py-20 md:py-24 px-4 md:px-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(var(--cyan-500), 0.05) 0%, transparent 60%)'
            }}
          />
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-12">
              <motion.span variants={itemVariants} className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">
                What's Included
              </motion.span>
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-display font-bold text-white mt-4">
                Document Contents
              </motion.h2>
            </div>

            <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Executive Summary", desc: "Business overview, vision, mission, and key metrics" },
                { title: "Product Overview", desc: "55+ pages, 49+ savings categories, AI-powered features" },
                { title: "Key Features", desc: "Price tracking, alerts, community, AI coach, family logins" },
                { title: "Market Opportunity", desc: "$15K-25K annual savings per user, 50K+ target Perth families" },
                { title: "Financial Projections", desc: "Revenue model, growth projections, profitability timeline" },
                { title: "Technology Stack", desc: "React, Express, PostgreSQL, TypeScript, Multi-Model AI" },
                { title: "Competitive Advantage", desc: "Perth-specific data, V7 PRO design system, family-friendly UX" },
                { title: "Valuation & Funding", desc: "$55-92M current valuation, $200-400M exit potential" },
                { title: "Team & Vision", desc: "Experienced developers, growth mindset, Perth-focused strategy" },
                { title: "Go-to-Market Strategy", desc: "User acquisition, retention, community building, partnerships" },
                { title: "Roadmap", desc: "V8 features, international expansion, enterprise solutions" },
                { title: "Financial Metrics", desc: "CAC, LTV, churn rate, ARR growth, unit economics" },
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  variants={itemVariants} 
                  className="flex gap-3 p-4 rounded-xl transition-all"
                  style={{
                    background: 'rgba(var(--charcoal), 0.5)',
                    border: '1px solid rgba(var(--white), 0.05)'
                  }}
                  whileHover={{ background: 'rgba(var(--charcoal), 0.8)', x: 4 }}
                >
                  <Check className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-white/50">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-20 md:py-24 px-4 md:px-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto max-w-3xl">
            <motion.div
              variants={itemVariants}
              className="p-8 md:p-12 rounded-3xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(var(--purple-500), 0.1), rgba(var(--cyan-500), 0.1))',
                border: '1px solid rgba(var(--purple-500), 0.2)',
                boxShadow: '0 0 60px rgba(var(--purple-500), 0.1), 0 0 120px rgba(var(--cyan-500), 0.05)'
              }}
            >
              <motion.div variants={itemVariants} className="flex justify-center mb-6">
                <Sparkles className="h-12 w-12 text-purple-400" style={{ filter: 'drop-shadow(0 0 20px rgba(var(--purple-500), 0.5))' }} />
              </motion.div>
              
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Ready to Invest in Perth Saver?
              </motion.h2>
              
              <motion.p variants={itemVariants} className="text-white/70 max-w-xl mx-auto mb-8">
                Download the comprehensive investor pitch document to learn more about our vision, metrics, and growth potential.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleDownloadPitch}
                    disabled={isDownloading}
                    className="text-white font-bold px-8 py-6 gap-2 text-lg rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgb(var(--purple-500)), rgb(var(--cyan-500)))',
                      boxShadow: '0 0 40px rgba(var(--purple-500), 0.4), 0 0 80px rgba(var(--cyan-500), 0.2)'
                    }}
                    data-testid="button-download-pitch-cta"
                  >
                    <Download className="h-5 w-5" />
                    Download Full Pitch Deck
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/auth'}
                    className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-2xl"
                  >
                    Try the App
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
