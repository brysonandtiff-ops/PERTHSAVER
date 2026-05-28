import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, TrendingDown, ShoppingCart, Bell, DollarSign, Cpu, Zap, Brain, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { AIAvatarMini, ThinkingIndicator } from "@/components/AIAvatar";

interface Message {
  role: "user" | "assistant";
  content: string;
  actions?: ActionChip[];
  provider?: string;
}

interface ActionChip {
  label: string;
  icon: string;
  link?: string;
  action?: string;
}

const SUGGESTED_QUESTIONS = [
  "How can I save $15K+ this year in Perth?",
  "What are today's best Perth grocery deals?",
  "Which Perth stores have the cheapest fuel right now?",
  "Analyze my spending and find hidden savings",
  "Help me reduce utility bills with Synergy",
  "Compare super fund fees - am I paying too much?",
  "What tax deductions am I probably missing?",
  "Best time to shop for supermarket markdowns?",
];

const STORAGE_KEY = "perth-saver-chat-history";
const DAILY_TIP_KEY = "perth-saver-daily-tip";

const AI_PROVIDERS = {
  claude: { name: "Claude 4.5 Sonnet", color: "text-purple-400", bg: "bg-purple-500/20", icon: Brain },
  gemini: { name: "Gemini 2.5 Flash", color: "text-cyan-400", bg: "bg-cyan-500/20", icon: Sparkles },
  openai: { name: "GPT-5", color: "text-white", bg: "bg-white/10", icon: Zap },
};

function parseMarkdown(text: string): React.ReactElement {
  const lines = text.split('\n');
  const elements: React.ReactElement[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      const bulletText = line.trim().substring(2);
      elements.push(
        <li key={key++} className="ml-4 mb-1">
          {parseInlineMarkdown(bulletText)}
        </li>
      );
    } else if (line.trim()) {
      elements.push(
        <p key={key++} className="mb-2 last:mb-0">
          {parseInlineMarkdown(line)}
        </p>
      );
    } else {
      elements.push(<br key={key++} />);
    }
  }

  return <div className="space-y-1">{elements}</div>;
}

function parseInlineMarkdown(text: string): (string | React.ReactElement)[] {
  const parts: (string | React.ReactElement)[] = [];
  let currentText = '';
  let i = 0;
  let key = 0;

  while (i < text.length) {
    if (text[i] === '*' && text[i + 1] === '*') {
      if (currentText) {
        parts.push(currentText);
        currentText = '';
      }
      
      i += 2;
      let boldText = '';
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '*')) {
        boldText += text[i];
        i++;
      }
      
      if (i < text.length) {
        parts.push(<strong key={key++} className="font-semibold text-white">{boldText}</strong>);
        i += 2;
      } else {
        currentText += '**' + boldText;
      }
    } else {
      currentText += text[i];
      i++;
    }
  }

  if (currentText) {
    parts.push(currentText);
  }

  return parts;
}

function extractActionChips(text: string): ActionChip[] {
  const actions: ActionChip[] = [];
  const lowerText = text.toLowerCase();

  if (lowerText.includes('deal') || lowerText.includes('discount') || lowerText.includes('sale') || 
      lowerText.includes('special') || lowerText.includes('woolworth') || lowerText.includes('coles') || 
      lowerText.includes('aldi') || lowerText.includes('spudshed')) {
    actions.push({ label: 'View Deals', icon: 'trending-down', link: '/grocery-comparison' });
  }

  if (lowerText.includes('grocery') || lowerText.includes('shopping') || lowerText.includes('meal') ||
      lowerText.includes('recipe') || lowerText.includes('food') || lowerText.includes('cook')) {
    actions.push({ label: 'Meal Planner', icon: 'shopping-cart', link: '/meal-planner' });
  }

  if (lowerText.includes('alert') || lowerText.includes('track') || lowerText.includes('price') ||
      lowerText.includes('notify') || lowerText.includes('watch') || lowerText.includes('monitor')) {
    actions.push({ label: 'Set Price Alert', icon: 'bell', link: '/price-alerts' });
  }

  if (lowerText.includes('bill') || lowerText.includes('subscription') || lowerText.includes('utility') ||
      lowerText.includes('synergy') || lowerText.includes('electricity') || lowerText.includes('gas') ||
      lowerText.includes('internet') || lowerText.includes('phone')) {
    actions.push({ label: 'Track Bills', icon: 'dollar-sign', link: '/bill-tracker' });
  }

  if (lowerText.includes('saving') || lowerText.includes('goal') || lowerText.includes('super') || 
      lowerText.includes('invest') || lowerText.includes('wealth') || lowerText.includes('retire') ||
      lowerText.includes('fund') || lowerText.includes('portfolio')) {
    actions.push({ label: 'Wealth Optimizer', icon: 'dollar-sign', link: '/wealth' });
  }

  if (lowerText.includes('tax') || lowerText.includes('deduct') || lowerText.includes('claim') ||
      lowerText.includes('ato') || lowerText.includes('refund')) {
    actions.push({ label: 'Tax Deductions', icon: 'dollar-sign', link: '/tax-deductions' });
  }

  if (lowerText.includes('fuel') || lowerText.includes('petrol') || lowerText.includes('diesel') ||
      lowerText.includes('costco')) {
    actions.push({ label: 'Fleet Manager', icon: 'trending-down', link: '/fleet' });
  }

  if (lowerText.includes('basket') || lowerText.includes('optimize') || lowerText.includes('compare') ||
      lowerText.includes('cheapest') || lowerText.includes('best price')) {
    actions.push({ label: 'Basket Optimizer', icon: 'shopping-cart', link: '/basket-optimizer' });
  }

  return actions.slice(0, 4);
}

function getIconComponent(iconName: string) {
  switch (iconName) {
    case 'trending-down':
      return TrendingDown;
    case 'shopping-cart':
      return ShoppingCart;
    case 'bell':
      return Bell;
    case 'dollar-sign':
      return DollarSign;
    default:
      return Sparkles;
  }
}

function getProviderInfo(provider: string) {
  if (provider?.includes('claude') || provider?.includes('anthropic')) return AI_PROVIDERS.claude;
  if (provider?.includes('gemini') || provider?.includes('google')) return AI_PROVIDERS.gemini;
  return AI_PROVIDERS.openai;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDailyTip, setShowDailyTip] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<string>("claude");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMessages(parsed.filter((m: any) => m && typeof m.content === "string"));
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      checkDailyTip();
    }
  }, [isOpen]);

  const checkDailyTip = async () => {
    const today = new Date().toDateString();
    const lastTipDate = localStorage.getItem(DAILY_TIP_KEY);

    if (lastTipDate !== today && messages.length === 0) {
      setShowDailyTip(true);
      localStorage.setItem(DAILY_TIP_KEY, today);
      
      try {
        const response = await fetch("/api/ai/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "Give me a quick daily savings tip to help me save $15K-25K this year",
            conversationHistory: [],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let tipContent = "💡 **Daily Tip:** " + data.reply;
          
          if (data.dailyInsight && data.dailyInsight.trim()) {
            tipContent = "💡 **Daily Insight:**\n" + data.dailyInsight + "\n\n" + data.reply;
          }

          const dailyTipMessage: Message = {
            role: "assistant",
            content: tipContent,
            provider: data.provider || "claude",
          };
          setMessages([dailyTipMessage]);
          setCurrentProvider(data.provider || "claude");
        }
      } catch (error) {
        console.error("Failed to fetch daily tip:", error);
      } finally {
        setShowDailyTip(false);
      }
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const actions = extractActionChips(data.reply);
      const provider = data.provider || "claude";
      
      setCurrentProvider(provider);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
        actions: actions.length > 0 ? actions : undefined,
        provider: provider,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm temporarily unavailable. Please try again in a moment.",
        provider: "system",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleActionClick = (action: ActionChip) => {
    if (action.link) {
      navigate(action.link);
      setIsOpen(false);
    }
  };

  const providerInfo = getProviderInfo(currentProvider);

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            data-testid="button-open-ai-chat"
            className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-shadow duration-300 flex items-center justify-center"
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(var(--purple-500),0.4), rgba(var(--cyan-500),0.2), rgba(var(--obsidian),0.95))",
              boxShadow: "0 0 40px rgba(var(--purple-500),0.5), 0 0 80px rgba(var(--cyan-500),0.2), inset 0 1px 0 rgba(var(--white),0.15)"
            }}
          >
            <AIAvatarMini isActive className="w-10 h-10" />
            <motion.span 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Cpu className="h-3 w-3 text-white" />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          data-testid="container-ai-chat"
          className="fixed inset-0 z-50 flex flex-col rounded-none shadow-2xl"
          style={{
            background: "linear-gradient(180deg, rgba(2,2,8,0.99) 0%, rgba(5,5,10,1) 100%)",
            backdropFilter: "blur(40px)",
          }}
        >
          <div 
            className="flex items-center justify-between p-4 border-b border-white/5"
            style={{
              background: "linear-gradient(90deg, rgba(var(--purple-500),0.12) 0%, rgba(var(--cyan-500),0.08) 50%, rgba(var(--purple-500),0.04) 100%)",
            }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="relative"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <AIAvatarMini isActive={isLoading} isThinking={isLoading} className="w-8 h-8" />
                </div>
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="h-2.5 w-2.5 text-white" />
                </motion.div>
              </motion.div>
              <div>
                <h3 className="font-bold text-white text-base tracking-tight" data-testid="text-ai-title">
                  Perth Smart Saver AI
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">Powered by</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-medium text-purple-400">Claude</span>
                    <span className="text-white/30">•</span>
                    <span className="text-[10px] font-medium text-cyan-400">Gemini</span>
                    <span className="text-white/30">•</span>
                    <span className="text-[10px] font-medium text-white/80">GPT-5.1</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  data-testid="button-clear-chat"
                  className="text-white/50 hover:text-white hover:bg-white/5 h-8 px-2 text-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Clear
                </Button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                data-testid="button-close-ai-chat"
                className="h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div ref={scrollRef} className="space-y-4">
              {messages.length === 0 && !showDailyTip && (
                <div className="text-center py-6 space-y-6">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative h-20 w-20 mx-auto"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                      <Sparkles className="h-10 w-10 text-purple-400" />
                    </div>
                    <motion.div 
                      className="absolute -inset-2 rounded-3xl border border-purple-500/20"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-1" data-testid="text-welcome">
                      Perth Smart Saver AI
                    </h4>
                    <p className="text-sm text-white/50 mb-2">
                      Save <span className="text-purple-400 font-semibold">$15K-25K</span> annually
                    </p>
                    <div className="flex justify-center gap-2">
                      {Object.entries(AI_PROVIDERS).map(([key, info]) => {
                        const Icon = info.icon;
                        return (
                          <Badge key={key} variant="outline" className={`${info.bg} ${info.color} border-none text-[10px] px-2 py-0.5`}>
                            <Icon className="h-3 w-3 mr-1" />
                            {info.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2 max-w-sm mx-auto">
                    <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">Ask me anything</p>
                    {SUGGESTED_QUESTIONS.map((question, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuggestedQuestion(question)}
                        data-testid={`button-suggested-${index}`}
                        className="block w-full text-left px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-200 text-sm text-white/70 hover:text-white border border-white/5 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <div
                    data-testid={`message-${message.role}-${index}`}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                          : "bg-white/[0.03] text-white/90 border border-white/5"
                      }`}
                    >
                      {message.role === "assistant" && message.provider && (
                        <div className="flex items-center gap-1.5 mb-2">
                          {(() => {
                            const info = getProviderInfo(message.provider);
                            const Icon = info.icon;
                            return (
                              <Badge variant="outline" className={`${info.bg} ${info.color} border-none text-[9px] px-1.5 py-0`}>
                                <Icon className="h-2.5 w-2.5 mr-0.5" />
                                {info.name}
                              </Badge>
                            );
                          })()}
                        </div>
                      )}
                      <div className="text-sm leading-relaxed">
                        {message.role === "assistant" ? (
                          parseMarkdown(message.content)
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {message.role === "assistant" && message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 ml-2" data-testid={`action-chips-${index}`}>
                      {message.actions.map((action, actionIndex) => {
                        const IconComponent = getIconComponent(action.icon);
                        return (
                          <motion.button
                            key={actionIndex}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleActionClick(action)}
                            data-testid={`button-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500/20 hover:to-cyan-500/20 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200 text-xs text-white/90 hover:text-white"
                          >
                            <IconComponent className="h-3.5 w-3.5 text-purple-400" />
                            <span>{action.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ))}

              {(isLoading || showDailyTip) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/[0.03] rounded-2xl px-4 py-3 border border-white/5">
                    <ThinkingIndicator />
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t border-white/5">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about savings, deals, bills..."
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-purple-500/50"
                disabled={isLoading}
                data-testid="input-ai-message"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white"
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
