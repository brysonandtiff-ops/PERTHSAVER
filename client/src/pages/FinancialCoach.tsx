import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/PageLoader";
import { AuthRequired } from "@/components/AuthRequired";
import { useAuth } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { AIAvatar, AIAvatarMini } from "@/components/AIAvatar";
import { 
  Brain, Send, Sparkles, TrendingUp, DollarSign, Target, Lightbulb, 
  Fuel, ShoppingCart, Zap, ChevronDown, Bot, Cpu
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface Message {
  id?: string;
  type: "user" | "coach";
  text: string;
  category?: string;
  timestamp: Date;
  model?: string;
  provider?: string;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
}

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

const messageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const getProviderBadgeClass = (provider: string) => {
  switch (provider) {
    case "openai":
      return "bg-gradient-to-r from-slate-500 to-slate-600 text-white";
    case "gemini":
      return "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white";
    case "anthropic":
      return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
    default:
      return "bg-slate-600 text-white";
  }
};

const getProviderIcon = (provider: string) => {
  switch (provider) {
    case "openai":
      return <Bot className="h-3 w-3" />;
    case "gemini":
      return <Sparkles className="h-3 w-3" />;
    case "anthropic":
      return <Cpu className="h-3 w-3" />;
    default:
      return <Brain className="h-3 w-3" />;
  }
};

export default function FinancialCoach() {
  const { data: user, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("claude-sonnet-4-5");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: models } = useQuery({
    queryKey: ["/api/ai/models"],
    queryFn: async () => {
      const res = await fetch("/api/ai/models");
      if (!res.ok) throw new Error("Failed to fetch models");
      const data = await res.json();
      return data.models as AIModel[];
    },
  });

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["/api/coach/history"],
    queryFn: async () => {
      const res = await fetch("/api/coach/history");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const data = await res.json();
      return data.conversations || [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (conversations) {
      const loadedMessages: Message[] = conversations.map((conv: any) => [
        { type: "user" as const, text: conv.userMessage, timestamp: new Date(conv.createdAt) },
        { type: "coach" as const, text: conv.coachResponse, category: conv.category, timestamp: new Date(conv.createdAt) },
      ]).flat();
      setMessages(loadedMessages);
    }
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    const userMsg: Message = {
      type: "user",
      text: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingResponse(true);

    try {
      const response = await fetch("/api/coach/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, model: selectedModel }),
      });

      if (!response.ok) {
        throw new Error("Failed to get coach response");
      }

      const data = await response.json();

      const coachMsg: Message = {
        type: "coach",
        text: data.response,
        category: data.category,
        timestamp: new Date(),
        model: data.model,
        provider: data.provider,
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get coach response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const selectedModelInfo = models?.find(m => m.id === selectedModel);

  if (authLoading) return <PageLoader />;
  if (!user) return <AuthRequired />;
  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
      <motion.div
        className="container max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-6 sm:mb-8 text-center" variants={itemVariants}>
          <div className="flex flex-col sm:items-center sm:justify-center gap-2 mb-3 sm:mb-4">
            <AIAvatar 
              size="lg" 
              isThinking={isLoadingResponse} 
              mood={messages.length > 0 ? "happy" : "neutral"}
              className="mx-auto"
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white" data-testid="text-coach-title">
              Perth Smart Saver AI
            </h1>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-white/60 max-w-xl mx-auto mb-4">
            Multi-model AI coach powered by <span className="text-purple-400">Claude 4.5</span>, <span className="text-cyan-400">Gemini 3 Pro</span> & <span className="text-white/80">GPT-5.1</span>
          </p>
          
          {/* Model Selector */}
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-2 glass-card border-white/10 hover:bg-white/10 shadow-sm"
                  data-testid="button-model-selector"
                >
                  {selectedModelInfo && getProviderIcon(selectedModelInfo.provider)}
                  <span className="font-medium">{selectedModelInfo?.name || "Select Model"}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-72 bg-zinc-900/95 backdrop-blur-md border-white/10">
                <DropdownMenuLabel className="text-xs text-purple-400 font-semibold">Anthropic Claude (Primary)</DropdownMenuLabel>
                {models?.filter(m => m.provider === "anthropic").map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`cursor-pointer ${selectedModel === model.id ? "bg-purple-500/20" : "hover:bg-white/10"}`}
                    data-testid={`menu-item-${model.id}`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Cpu className="h-4 w-4 text-purple-400" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-white">{model.name}</p>
                        <p className="text-xs text-white/50">{model.description}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuLabel className="text-xs text-cyan-400 font-semibold">Google Gemini</DropdownMenuLabel>
                {models?.filter(m => m.provider === "gemini").map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`cursor-pointer ${selectedModel === model.id ? "bg-cyan-500/20" : "hover:bg-white/10"}`}
                    data-testid={`menu-item-${model.id}`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Sparkles className="h-4 w-4 text-cyan-400" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-white">{model.name}</p>
                        <p className="text-xs text-white/50">{model.description}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuLabel className="text-xs text-white/60 font-semibold">OpenAI</DropdownMenuLabel>
                {models?.filter(m => m.provider === "openai").map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`cursor-pointer ${selectedModel === model.id ? "bg-white/20" : "hover:bg-white/10"}`}
                    data-testid={`menu-item-${model.id}`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Bot className="h-4 w-4 text-white/70" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-white">{model.name}</p>
                        <p className="text-xs text-white/50">{model.description}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Perth-Specific Quick Questions */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-6"
          variants={itemVariants}
        >
          {[
            { icon: Fuel, title: "Cheapest Fuel", text: "Where's the cheapest fuel in Perth today?", color: "from-purple-500 to-purple-600" },
            { icon: ShoppingCart, title: "Grocery Savings", text: "How can I save on groceries at ALDI vs Coles?", color: "from-cyan-500 to-cyan-600" },
            { icon: Zap, title: "Power Bills", text: "Should I switch to Synergy Midday Saver?", color: "from-purple-500 to-cyan-500" },
            { icon: Target, title: "Save $1000", text: "How can I save $1000 this month in Perth?", color: "from-cyan-500 to-purple-500" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={idx}
                onClick={() => setInput(item.text)}
                className="p-4 rounded-xl glass-card border-white/10 text-left transition-all duration-300 hover:border-purple-500/30"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-testid={`button-quick-${idx}`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-2 shadow-sm`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-white/50 mt-1 line-clamp-2">{item.text}</p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Chat Messages */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-white/10 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-white/50">
                    <AIAvatar size="xl" mood="neutral" className="mb-4" />
                    <p className="font-medium text-white/70">Start a Conversation</p>
                    <p className="text-sm mt-1 text-white/50">Ask me about saving money in Perth!</p>
                  </div>
                )}
                
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.type === "user"
                            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                            : "glass-card border-white/10 text-white shadow-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        {msg.type === "coach" && msg.provider && msg.model && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                            <Badge className={`text-[10px] px-2 py-0.5 ${getProviderBadgeClass(msg.provider)}`}>
                              {getProviderIcon(msg.provider)}
                              <span className="ml-1">{msg.model}</span>
                            </Badge>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoadingResponse && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="glass-card border-white/10 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
                      <AIAvatarMini />
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-4 w-4 text-purple-400" />
                        </motion.div>
                        <span className="text-sm text-white/70">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about fuel prices, grocery deals, utility savings..."
                    className="min-h-[48px] max-h-[120px] resize-none glass-input text-white placeholder:text-white/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    data-testid="input-message"
                  />
                  <Button
                    type="submit"
                    disabled={isLoadingResponse || !input.trim()}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25 px-6"
                    data-testid="button-send"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-white/40 mt-2 text-center">
                  Powered by GPT-5, Gemini Pro & Claude 4.5 Sonnet
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
