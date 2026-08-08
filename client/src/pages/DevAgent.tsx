import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, Code, Wrench, Sparkles, Brain, Zap, RefreshCw, 
  CheckCircle, XCircle, AlertTriangle, Loader2, Send,
  FileCode, Palette, Database, Server, Layout, Shield,
  Play, Pause, Terminal, Eye, Bug, Lightbulb, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AnalysisResult {
  id: string;
  category: string;
  severity: "critical" | "warning" | "info" | "success";
  title: string;
  description: string;
  suggestion?: string;
  file?: string;
  line?: number;
  aiModel: string;
  timestamp: Date;
}

interface AgentMessage {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  model?: string;
  timestamp: Date;
}

const ANALYSIS_CATEGORIES = [
  { id: "theme", name: "Theme & Styling", icon: Palette, color: "text-purple-400" },
  { id: "code", name: "Code Quality", icon: FileCode, color: "text-cyan-400" },
  { id: "api", name: "API & Backend", icon: Server, color: "text-purple-400" },
  { id: "database", name: "Database", icon: Database, color: "text-purple-400" },
  { id: "ui", name: "UI/UX", icon: Layout, color: "text-pink-400" },
  { id: "security", name: "Security", icon: Shield, color: "text-red-400" },
];

const AI_MODELS = {
  gemini: { name: "Gemini Pro", color: "bg-cyan-500/20 text-cyan-400", icon: Sparkles },
  gpt: { name: "GPT-5.1", color: "bg-purple-500/20 text-purple-400", icon: Zap },
  claude: { name: "Claude 4.5", color: "bg-purple-500/20 text-purple-400", icon: Brain },
};

const DEMO_MODE = true;

export default function DevAgent() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: "welcome",
      role: "system",
      content: DEMO_MODE 
        ? "⚠️ DEMO MODE: Developer Agent simulation. Analysis results below are pre-generated samples for demonstration purposes. Connect to real AI backend for live codebase analysis."
        : "Developer Agent initialized. I can analyze your codebase, find issues, and suggest fixes using Gemini Pro and GPT-5.1. What would you like me to help with?",
      timestamp: new Date(),
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeModel, setActiveModel] = useState<"gemini" | "gpt" | "both">("both");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const runFullAnalysis = async () => {
    setIsAnalyzing(true);
    setResults([]);
    setAnalysisProgress(0);

    const tasks = [
      { name: "Scanning theme consistency...", category: "theme" },
      { name: "Analyzing code quality...", category: "code" },
      { name: "Checking API endpoints...", category: "api" },
      { name: "Reviewing database schema...", category: "database" },
      { name: "Evaluating UI/UX patterns...", category: "ui" },
      { name: "Auditing security...", category: "security" },
    ];

    const mockResults: AnalysisResult[] = [];

    for (let i = 0; i < tasks.length; i++) {
      setCurrentTask(tasks[i].name);
      setAnalysisProgress((i / tasks.length) * 100);
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      const categoryResults = generateMockResults(tasks[i].category);
      mockResults.push(...categoryResults);
      setResults([...mockResults]);
    }

    setAnalysisProgress(100);
    setCurrentTask("Analysis complete!");
    
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Analysis complete!", {
        description: `Found ${mockResults.length} items to review`
      });
    }, 500);
  };

  const generateMockResults = (category: string): AnalysisResult[] => {
    const resultsByCategory: Record<string, AnalysisResult[]> = {
      theme: [
        {
          id: `theme-1`,
          category: "theme",
          severity: "success",
          title: "Color palette consistency verified",
          description: "All pages use the correct cyan/emerald/silver theme colors.",
          aiModel: "gemini",
          timestamp: new Date(),
        },
        {
          id: `theme-2`,
          category: "theme",
          severity: "success",
          title: "Logo unified across all pages",
          description: "Metallic piggy bank PNG logo is used consistently in PublicNavbar, Navbar, Footer, Sidebar, and all major pages.",
          aiModel: "gpt",
          timestamp: new Date(),
        },
        {
          id: `theme-3`,
          category: "theme",
          severity: "info",
          title: "Glassmorphism effects applied",
          description: "All glass-card and glass-strong classes use proper backdrop-blur and saturation values.",
          aiModel: "gemini",
          timestamp: new Date(),
        },
      ],
      code: [
        {
          id: `code-1`,
          category: "code",
          severity: "success",
          title: "TypeScript types properly defined",
          description: "All shared schemas have proper Zod validation and type inference.",
          aiModel: "gpt",
          timestamp: new Date(),
        },
        {
          id: `code-2`,
          category: "code",
          severity: "info",
          title: "55+ pages with lazy loading",
          description: "Non-critical pages use React.lazy() for better performance.",
          aiModel: "gemini",
          timestamp: new Date(),
        },
        {
          id: `code-3`,
          category: "code",
          severity: "success",
          title: "Error boundaries implemented",
          description: "ErrorBoundary component wraps the app for graceful error handling.",
          aiModel: "gpt",
          timestamp: new Date(),
        },
      ],
      api: [
        {
          id: `api-1`,
          category: "api",
          severity: "success",
          title: "50+ API endpoints functional",
          description: "All REST endpoints properly defined with Zod validation.",
          aiModel: "gemini",
          timestamp: new Date(),
        },
        {
          id: `api-2`,
          category: "api",
          severity: "success",
          title: "AI orchestrator with failover",
          description: "Multi-model AI (Claude → Gemini → GPT) with automatic rate limit handling.",
          aiModel: "gpt",
          timestamp: new Date(),
        },
        {
          id: `api-3`,
          category: "api",
          severity: "success",
          title: "Stripe webhooks configured",
          description: "Payment webhooks properly handle subscription events.",
          aiModel: "gemini",
          timestamp: new Date(),
        },
      ],
      database: [
        {
          id: `db-1`,
          category: "database",
          severity: "success",
          title: "17 database tables defined",
          description: "Drizzle ORM schema covers all app features with proper relations.",
          aiModel: "gpt",
          timestamp: new Date(),
        },
        {
          id: `db-2`,
          category: "database",
          severity: "success",
          title: "UUID primary keys implemented",
          description: "All tables use gen_random_uuid() for secure ID generation.",
          aiModel: "gemini",
          timestamp: new Date(),
        },
        {
          id: `db-3`,
          category: "database",
          severity: "info",
          title: "Perth market data seeded",
          description: "284 products, 85 deals, 15 fuel stations in database.",
          aiModel: "gpt",
          timestamp: new Date(),
        },
      ],
      ui: [
        {
          id: `ui-1`,
          category: "ui",
          severity: "success",
          title: "Responsive design verified",
          description: "All pages support mobile, tablet, and desktop breakpoints.",
          aiModel: "gemini",
          timestamp: new Date(),
        },
        {
          id: `ui-2`,
          category: "ui",
          severity: "success",
          title: "Framer Motion animations",
          description: "Smooth animations throughout with consistent motion patterns.",
          aiModel: "gpt",
          timestamp: new Date(),
        },
        {
          id: `ui-3`,
          category: "ui",
          severity: "success",
          title: "Data-testid attributes",
          description: "Interactive elements have testable identifiers for E2E testing.",
          aiModel: "gemini",
          timestamp: new Date(),
        },
      ],
      security: [
        {
          id: `sec-1`,
          category: "security",
          severity: "success",
          title: "Password hashing with bcrypt",
          description: "User passwords are properly hashed with 10 salt rounds.",
          aiModel: "gpt",
          timestamp: new Date(),
        },
        {
          id: `sec-2`,
          category: "security",
          severity: "success",
          title: "Session-based authentication",
          description: "HTTP-only cookies with PostgreSQL session store.",
          aiModel: "gemini",
          timestamp: new Date(),
        },
        {
          id: `sec-3`,
          category: "security",
          severity: "success",
          title: "In-app browser domain allowlist",
          description: "External links restricted to trusted Perth retail domains.",
          aiModel: "gpt",
          timestamp: new Date(),
        },
      ],
    };

    return resultsByCategory[category] || [];
  };

  const sendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;

    const userMessage: AgentMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput("");
    setIsProcessing(true);

    try {
      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: `As a developer agent for Perth Saver, help with: ${userInput}. 
          
          Context: Perth Saver is a PWA with 55+ pages, React/TypeScript frontend, Express backend, PostgreSQL database, and multi-model AI integration (Claude, Gemini, GPT). The theme uses cyan/emerald colors with glassmorphism.
          
          Provide specific, actionable developer guidance.`,
          model: activeModel === "gemini" ? "gemini-2.5-pro" : activeModel === "gpt" ? "gpt-5" : "gpt-5",
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      
      const agentMessage: AgentMessage = {
        id: `agent-${Date.now()}`,
        role: "agent",
        content: data.response || data.content || "I analyzed your request but couldn't generate a specific response.",
        model: data.provider || (activeModel === "gemini" ? "gemini" : "gpt"),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage: AgentMessage = {
        id: `error-${Date.now()}`,
        role: "system",
        content: "Failed to process request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error("Failed to get AI response");
    } finally {
      setIsProcessing(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <XCircle className="h-5 w-5 text-red-400" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-cyan-400" />;
      case "info": return <Lightbulb className="h-5 w-5 text-purple-400" />;
      case "success": return <CheckCircle className="h-5 w-5 text-cyan-400" />;
      default: return <Bug className="h-5 w-5 text-white/40" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/10 border-red-500/20";
      case "warning": return "bg-cyan-500/10 border-cyan-500/20";
      case "info": return "bg-purple-500/10 border-purple-500/20";
      case "success": return "bg-cyan-500/10 border-cyan-500/20";
      default: return "bg-white/5 border-white/10";
    }
  };

  const filteredResults = selectedCategory 
    ? results.filter(r => r.category === selectedCategory)
    : results;

  const stats = {
    total: results.length,
    critical: results.filter(r => r.severity === "critical").length,
    warning: results.filter(r => r.severity === "warning").length,
    success: results.filter(r => r.severity === "success").length,
    info: results.filter(r => r.severity === "info").length,
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="p-4 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(16, 185, 129, 0.2))',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
            }}
            animate={{ 
              boxShadow: [
                '0 0 30px rgba(6, 182, 212, 0.3)',
                '0 0 50px rgba(16, 185, 129, 0.4)',
                '0 0 30px rgba(6, 182, 212, 0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Bot className="h-10 w-10 text-purple-400" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white" data-testid="text-page-title">
              Developer Agent
            </h1>
            <p className="text-white/60">AI-powered code analysis with Gemini Pro & GPT-5.1</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5">
            <Button
              variant={activeModel === "gemini" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveModel("gemini")}
              className={activeModel === "gemini" ? "bg-cyan-500/20 text-cyan-400" : "text-white/60"}
              data-testid="button-model-gemini"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Gemini
            </Button>
            <Button
              variant={activeModel === "gpt" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveModel("gpt")}
              className={activeModel === "gpt" ? "bg-purple-500/20 text-purple-400" : "text-white/60"}
              data-testid="button-model-gpt"
            >
              <Zap className="h-4 w-4 mr-1" />
              GPT
            </Button>
            <Button
              variant={activeModel === "both" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveModel("both")}
              className={activeModel === "both" ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white" : "text-white/60"}
              data-testid="button-model-both"
            >
              <Cpu className="h-4 w-4 mr-1" />
              Both
            </Button>
          </div>

          <Button
            onClick={runFullAnalysis}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
            style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' }}
            data-testid="button-run-analysis"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Full Analysis
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="glass-card border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-6 w-6 text-purple-400" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-white font-medium">{currentTask}</p>
                  <p className="text-white/40 text-sm">Using Gemini Pro & GPT-5.1</p>
                </div>
                <span className="text-purple-400 font-mono">{Math.round(analysisProgress)}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="bg-white/5 p-1">
              <TabsTrigger value="chat" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <Terminal className="h-4 w-4 mr-2" />
                Agent Chat
              </TabsTrigger>
              <TabsTrigger value="results" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                <Eye className="h-4 w-4 mr-2" />
                Analysis Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-2xl ${
                              msg.role === "user"
                                ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white"
                                : msg.role === "system"
                                ? "bg-white/5 text-white/70"
                                : "bg-white/10 text-white"
                            }`}
                          >
                            {msg.role === "agent" && msg.model && (
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={AI_MODELS[msg.model as keyof typeof AI_MODELS]?.color || "bg-white/10"}>
                                  {AI_MODELS[msg.model as keyof typeof AI_MODELS]?.name || msg.model}
                                </Badge>
                              </div>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p className="text-xs text-white/30 mt-2">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      {isProcessing && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-white/40"
                        >
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Agent is thinking...</span>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-white/10">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                      }}
                      className="flex gap-3"
                    >
                      <Input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask the agent to analyze or fix something..."
                        className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        disabled={isProcessing}
                        data-testid="input-agent-message"
                      />
                      <Button
                        type="submit"
                        disabled={!userInput.trim() || isProcessing}
                        className="bg-gradient-to-r from-purple-500 to-cyan-500"
                        data-testid="button-send-message"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="mt-4">
              <Card className="glass-card border-white/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Analysis Results</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-cyan-500/20 text-cyan-400">{stats.success} Passed</Badge>
                      <Badge className="bg-purple-500/20 text-purple-400">{stats.info} Info</Badge>
                      <Badge className="bg-cyan-500/20 text-cyan-400">{stats.warning} Warnings</Badge>
                      <Badge className="bg-red-500/20 text-red-400">{stats.critical} Critical</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant={selectedCategory === null ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                      className={selectedCategory === null ? "bg-purple-500/20 text-purple-400" : "text-white/60"}
                    >
                      All
                    </Button>
                    {ANALYSIS_CATEGORIES.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={selectedCategory === cat.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={selectedCategory === cat.id ? "bg-white/10 text-white" : "text-white/60"}
                      >
                        <cat.icon className={`h-4 w-4 mr-1 ${cat.color}`} />
                        {cat.name}
                      </Button>
                    ))}
                  </div>

                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      <AnimatePresence>
                        {filteredResults.length === 0 ? (
                          <div className="text-center py-12 text-white/40">
                            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Run analysis to see results</p>
                          </div>
                        ) : (
                          filteredResults.map((result, index) => (
                            <motion.div
                              key={result.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-4 rounded-xl border ${getSeverityColor(result.severity)}`}
                            >
                              <div className="flex items-start gap-3">
                                {getSeverityIcon(result.severity)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-white font-medium">{result.title}</h4>
                                    <Badge className={AI_MODELS[result.aiModel as keyof typeof AI_MODELS]?.color || "bg-white/10"} variant="outline">
                                      {result.aiModel === "gemini" ? "Gemini" : "GPT"}
                                    </Badge>
                                  </div>
                                  <p className="text-white/60 text-sm">{result.description}</p>
                                  {result.suggestion && (
                                    <p className="text-purple-400 text-sm mt-2">
                                      💡 {result.suggestion}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-400" />
                AI Models
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(AI_MODELS).map(([key, model]) => {
                const Icon = model.icon;
                return (
                  <motion.div
                    key={key}
                    className={`p-4 rounded-xl ${model.color} flex items-center gap-3`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Icon className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{model.name}</p>
                      <p className="text-xs opacity-70">
                        {key === "gemini" && "Complex reasoning & analysis"}
                        {key === "gpt" && "Code generation & fixes"}
                        {key === "claude" && "Primary AI coach"}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wrench className="h-5 w-5 text-cyan-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Check theme consistency", icon: Palette },
                { label: "Analyze API endpoints", icon: Server },
                { label: "Review database schema", icon: Database },
                { label: "Audit security", icon: Shield },
                { label: "Optimize performance", icon: Zap },
              ].map((action, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => {
                    setUserInput(action.label);
                    setTimeout(() => sendMessage(), 100);
                  }}
                  data-testid={`button-quick-action-${i}`}
                >
                  <action.icon className="h-4 w-4 mr-2 text-purple-400" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card 
            className="border-0 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(16, 185, 129, 0.15))',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)'
            }}
          >
            <CardContent className="p-6 text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Bot className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              </motion.div>
              <h3 className="text-white font-bold mb-2">Developer Agent</h3>
              <p className="text-white/60 text-sm">
                Powered by Gemini Pro & GPT-5.1 for intelligent code analysis and fixes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
