import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Lock, CheckCircle2, Award, Zap } from "lucide-react";

interface Course {
  id: number;
  title: string;
  category: string;
  lessons: number;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  enrolled: boolean;
  progress: number;
}

const COURSES: Course[] = [
  { id: 1, title: "Property Investment 101", category: "Real Estate", lessons: 12, duration: "4 weeks", level: "beginner", price: 49, enrolled: true, progress: 60 },
  { id: 2, title: "Stock Market Mastery", category: "Stocks", lessons: 15, duration: "5 weeks", level: "intermediate", price: 79, enrolled: true, progress: 30 },
  { id: 3, title: "ETF & Dividend Strategy", category: "Passive Income", lessons: 10, duration: "3 weeks", level: "beginner", price: 39, enrolled: false, progress: 0 },
  { id: 4, title: "Crypto & DeFi Basics", category: "Crypto", lessons: 8, duration: "2 weeks", level: "beginner", price: 29, enrolled: false, progress: 0 },
];

export default function InvestmentCourses() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState<Set<number>>(new Set([1, 2]));

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-cyan-500/20 text-cyan-300";
      case "intermediate": return "bg-cyan-500/20 text-cyan-300";
      case "advanced": return "bg-red-500/20 text-red-300";
      default: return "bg-purple-500/20 text-purple-300";
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <motion.div className="bg-gradient-to-b from-blue-950/20 to-transparent px-6 pt-6 pb-6 space-y-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-500"
            animate={{ boxShadow: ["0 0 20px rgba(249,115,22,0.3)", "0 0 35px rgba(249,115,22,0.5)", "0 0 20px rgba(249,115,22,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <BookOpen className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="title">
              Investment Micro-Courses
            </h1>
            <p className="text-white/60 text-sm">Wealth building education</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.div className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-xl p-3 border border-orange-500/30">
            <p className="text-white/60 text-xs uppercase">Enrolled</p>
            <p className="text-2xl font-bold text-orange-400">{enrolled.size}</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl p-3 border border-purple-500/30">
            <p className="text-white/60 text-xs uppercase">Courses</p>
            <p className="text-2xl font-bold text-purple-400">{COURSES.length}</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 rounded-xl p-3 border border-cyan-500/30">
            <p className="text-white/60 text-xs uppercase">Certificates</p>
            <p className="text-2xl font-bold text-cyan-400">2</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-6 space-y-6">
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Available Courses</h3>
          {COURSES.map((course, idx) => (
            <motion.div
              key={course.id}
              className={`rounded-xl p-4 border cursor-pointer transition-all ${
                selectedCourse?.id === course.id
                  ? "bg-gradient-to-r from-orange-500/15 to-yellow-500/10 border-orange-500/40"
                  : "bg-zinc-900/50 border-white/5 hover:border-orange-500/20"
              }`}
              onClick={() => setSelectedCourse(selectedCourse?.id === course.id ? null : course)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-testid={`course-${course.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{course.title}</p>
                    <p className="text-white/40 text-xs">{course.category} • {course.lessons} lessons</p>
                  </div>
                  <Badge className={`${getLevelColor(course.level)} text-xs border`}>
                    {course.level}
                  </Badge>
                </div>

                {enrolled.has(course.id) && course.progress > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white/60 text-xs">Progress</p>
                      <p className="text-white text-xs font-semibold">{course.progress}%</p>
                    </div>
                    <Progress value={course.progress} className="bg-white/10" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-white/60 text-xs">{course.duration}</p>
                  <p className="text-orange-400 font-bold">${course.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedCourse && (
          <motion.div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl p-5 border border-orange-500/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="space-y-3">
              <p className="text-white font-semibold">{selectedCourse.title}</p>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-sm" data-testid="button-start">
                <Play className="w-4 h-4 mr-2" />
                {enrolled.has(selectedCourse.id) ? "Continue Learning" : "Enroll Now"}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
