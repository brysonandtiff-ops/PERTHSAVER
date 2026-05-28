import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, Send, Volume2, Settings, MessageSquare, Zap, Brain,
  Smartphone, Lightbulb, TrendingDown
} from "lucide-react";

interface VoiceCommand {
  id: number;
  command: string;
  category: string;
  example: string;
}

interface ConversationMessage {
  id: number;
  type: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const VOICE_COMMANDS: VoiceCommand[] = [
  { id: 1, command: "Budget Check", category: "Savings", example: "What's my weekly budget?" },
  { id: 2, command: "Fuel Price", category: "Transport", example: "What's the cheapest fuel near me?" },
  { id: 3, command: "Bill Summary", category: "Utilities", example: "How much did I spend on utilities?" },
  { id: 4, command: "Savings Goal", category: "Goals", example: "How much have I saved this month?" },
  { id: 5, command: "Deal Alert", category: "Shopping", example: "Any grocery deals today?" },
  { id: 6, command: "Spending Advice", category: "AI Coach", example: "How can I save more money?" },
];

const INTEGRATIONS = [
  { id: 1, name: "Alexa", icon: Smartphone, status: "connected", color: "text-purple-400" },
  { id: 2, name: "Google Home", icon: Smartphone, status: "connected", color: "text-purple-400" },
  { id: 3, name: "Siri", icon: Smartphone, status: "available", color: "text-slate-400" },
];

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 1,
      type: "assistant",
      text: "G'day! I'm your Perth Smart Saver voice assistant. Ask me about your savings, bills, or get shopping tips!",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: ConversationMessage = {
      id: messages.length + 1,
      type: "user",
      text: inputText,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "You've saved $245 this week! Keep going! 💚",
        "Cheapest fuel today is at Costco (149.9¢/L)",
        "Your electricity bill is $20 higher than average. Want tips to reduce it?",
        "Great question! Consider bundle deals with your internet provider.",
      ];

      const aiMessage: ConversationMessage = {
        id: messages.length + 2,
        type: "assistant",
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const startListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInputText("What's my weekly savings goal?");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <motion.div className="bg-gradient-to-b from-blue-950/20 to-transparent px-6 pt-6 pb-6 space-y-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500"
            animate={{ boxShadow: ["0 0 20px rgba(99,102,241,0.3)", "0 0 35px rgba(99,102,241,0.5)", "0 0 20px rgba(99,102,241,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Mic className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="title">
              Voice Budget Assistant
            </h1>
            <p className="text-white/60 text-sm">Talk to Perth Smart Saver AI - Alexa, Google Home, Siri</p>
          </div>
        </div>

        {/* Device Integration Status */}
        <div className="grid grid-cols-3 gap-3">
          {INTEGRATIONS.map((device) => (
            <motion.button
              key={device.id}
              onClick={() => setSelectedDevice(selectedDevice === device.name ? null : device.name)}
              className={`rounded-xl p-3 border transition-all text-center ${
                selectedDevice === device.name
                  ? "bg-indigo-500/20 border-indigo-500/40"
                  : device.status === "connected"
                  ? "bg-green-500/20 border-green-500/30"
                  : "bg-slate-500/10 border-slate-500/20"
              }`}
            >
              <p className={`text-xs uppercase font-semibold ${device.color}`}>{device.name}</p>
              <Badge className={`text-xs mt-1 ${
                device.status === "connected"
                  ? "bg-green-500/30 text-green-300"
                  : "bg-slate-500/20 text-slate-400"
              }`}>
                {device.status}
              </Badge>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="px-6 space-y-6">
        {/* Conversation */}
        <div className="space-y-4 bg-zinc-900/30 rounded-xl p-5 border border-white/5 min-h-[300px] max-h-[400px] overflow-y-auto">
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-xl ${
                  msg.type === "user"
                    ? "bg-indigo-500/30 text-white rounded-br-none"
                    : "bg-white/5 text-white/80 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs text-white/40 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Input */}
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={startListening}
            className={`flex-1 rounded-xl py-6 text-sm font-semibold transition-all ${
              isListening
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
            data-testid="button-voice"
          >
            <Mic className="w-5 h-5 mr-2" />
            {isListening ? "Listening..." : "Press to Speak"}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-6"
            data-testid="button-send"
          >
            <Send className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Text Input */}
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your question or command..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/50 transition-all"
            data-testid="input-text"
          />
        </div>

        {/* Quick Commands */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm">Try Saying...</h3>
          <div className="grid grid-cols-2 gap-2">
            {VOICE_COMMANDS.map((cmd, idx) => (
              <motion.button
                key={cmd.id}
                onClick={() => setInputText(cmd.example)}
                className="text-left rounded-lg p-3 bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                data-testid={`command-${cmd.id}`}
              >
                <p className="text-white text-sm font-semibold">{cmd.command}</p>
                <p className="text-white/40 text-xs">{cmd.example}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <Button variant="outline" className="w-full rounded-xl" data-testid="button-settings">
          <Settings className="w-4 h-4 mr-2" />
          Voice Settings & Device Sync
        </Button>
      </div>
    </div>
  );
}
