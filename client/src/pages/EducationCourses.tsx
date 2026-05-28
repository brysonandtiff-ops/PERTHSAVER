import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, DollarSign } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3 },
  },
};

export default function EducationCourses() {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Education & Courses</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Save 70-90% on online learning, books, certifications</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-4 mb-8" variants={containerVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-textbooks" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-textbooks-label">Textbook Savings/yr</p>
                <p className="text-3xl font-display font-bold text-primary mt-2" data-testid="text-textbooks-amount">$540</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-free-courses" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-free-label">Free Courses</p>
                <p className="text-3xl font-display font-bold text-accent mt-2" data-testid="text-free-count">500+</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-certs" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-certs-label">Certs Compared</p>
                <p className="text-3xl font-display font-bold text-purple-400 mt-2" data-testid="text-certs-count">200+</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-4" variants={containerVariants}>
          <p className="text-xs font-semibold text-white/60 uppercase">Popular Courses - Free vs Paid</p>
          {[
            { course: "Python Programming", price: "$99", free: "Codecademy/freeCodeCamp", save: "100%" },
            { course: "Data Science", price: "$299", free: "Google/AWS skill builders", save: "100%" },
            { course: "Digital Marketing", price: "$199", free: "Google/HubSpot academy", save: "100%" },
            { course: "Web Development", price: "$159", free: "The Odin Project", save: "100%" },
          ].map((item, i) => (
            <motion.div key={`course-${i}`} variants={itemVariants}>
              <Card data-testid={`card-course-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white" data-testid={`text-course-name-${i}`}>{item.course}</p>
                    <p className="text-xs text-white/60 mt-1" data-testid={`text-course-free-${i}`}>Free: {item.free}</p>
                  </div>
                  <Badge data-testid={`badge-save-${i}`} className="bg-accent/20 text-accent">Save {item.save}</Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card data-testid="card-education-tips" className="mt-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 backdrop-blur">
            <CardContent className="p-6 space-y-3">
              <p className="text-sm font-semibold text-white mb-3">📚 Education Money Hacks</p>
              {[
                "Library cards: Free access to Skillshare, Lynda.com, Hoopla",
                "Student discounts: UWA/Curtin = 50-70% off software & services",
                "Used textbooks: Facebook marketplace & Amazon 70-80% cheaper",
                "OpenStax: Free peer-reviewed college textbooks (no paywalls!)",
                "YouTube & open source: MIT OpenCourseWare, Khan Academy 100% free",
              ].map((hack, i) => (
                <p key={`hack-${i}`} className="text-xs text-white/70" data-testid={`text-hack-${i}`}>• {hack}</p>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
}
