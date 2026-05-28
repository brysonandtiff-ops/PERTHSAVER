import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import pLimit from "p-limit";
import pRetry from "p-retry";

type AIProvider = "claude" | "gemini" | "openai";

interface AIConfig {
  provider: AIProvider;
  model: string;
  maxTokens: number;
  temperature: number;
}

interface UserMemory {
  preferences: string[];
  pastInsights: string[];
  savingsPatterns: string[];
  lastInteraction: string;
  totalSaved: number;
  topCategories: string[];
}

interface SmartContext {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  dayOfWeek: string;
  isWeekend: boolean;
  season: string;
  month: string;
  perthTime: string;
  shoppingContext: string;
}

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const gemini = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL || "",
  },
});

const PROVIDER_PRIORITY: AIProvider[] = ["claude", "gemini", "openai"];

const MODEL_CONFIG: Record<AIProvider, { model: string; maxTokens: number }> = {
  claude: { model: "claude-sonnet-4-5", maxTokens: 8192 },
  gemini: { model: "gemini-2.5-flash", maxTokens: 4096 },
  openai: { model: "gpt-5", maxTokens: 8192 },
};

function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

function extractGeminiText(result: any): string {
  if (typeof result?.text === "string" && result.text) return result.text;
  if (typeof result?.response?.text === "function") return result.response.text() || "";
  if (result?.candidates?.[0]?.content?.parts?.[0]?.text) return result.candidates[0].content.parts[0].text;
  return "";
}

function getSmartContext(): SmartContext {
  const perthTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Perth" }));
  const hour = perthTime.getHours();
  const day = perthTime.getDay();
  const month = perthTime.getMonth();
  
  const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const seasons: Record<number, string> = {
    0: "summer", 1: "summer", 2: "autumn", 3: "autumn", 4: "autumn", 5: "winter",
    6: "winter", 7: "winter", 8: "spring", 9: "spring", 10: "spring", 11: "summer"
  };

  const shoppingContextMap: Record<string, string> = {
    "morning": "Great time for fresh produce - bakery items just out, meat freshly stocked",
    "afternoon": "Check for afternoon markdowns on deli items and prepared foods",
    "evening": "Prime time for 50% off markdowns on meat, bakery, and ready meals",
    "night": "Limited stock but maximum discounts on perishables"
  };

  return {
    timeOfDay,
    dayOfWeek: dayNames[day],
    isWeekend: day === 0 || day === 6,
    season: seasons[month],
    month: monthNames[month],
    perthTime: perthTime.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }),
    shoppingContext: shoppingContextMap[timeOfDay]
  };
}

const ULTRA_SMART_CONTEXT = `You are Perth Smart Saver AI - the most advanced AI financial coach ever created for Western Australians.

═══════════════════════════════════════════════════════════════════════════════
🧠 INTELLIGENCE LEVEL: GENIUS-TIER FINANCIAL ADVISOR
═══════════════════════════════════════════════════════════════════════════════

YOUR CORE MISSION: Transform every Perth resident into a savings MASTER, achieving $50,000 - $100,000+ annual savings through hyper-intelligent optimization.

═══════════════════════════════════════════════════════════════════════════════
💰 SAVINGS OPTIMIZATION ENGINE (Multi-dimensional Analysis)
═══════════════════════════════════════════════════════════════════════════════

TIER 1 - IMMEDIATE WINS (Save $15K-25K/year):
┌─────────────────────────────────────────────────────────────────────────────┐
│ GROCERIES & SHOPPING ($8K-15K/year)                                         │
│ • ALDI: 30-40% cheaper on staples (milk $1.09 vs $1.60 Coles)              │
│ • Spudshed: WA-grown produce 20-50% cheaper, Malaga/Jandakot/Morley        │
│ • Costco Perth Airport: Bulk buying saves $3K+/year for families           │
│ • Woolies/Coles: Only for specials - use Flybuys/Everyday Rewards          │
│ • IGA: Local specials, support WA businesses                               │
│ • Farmer Jacks: Premium quality at competitive prices                       │
│ • Asian grocers: Northbridge, Cannington - 50% cheaper on staples          │
│                                                                             │
│ PRO STRATEGIES:                                                             │
│ • Shop Wednesday-Thursday for fresh markdowns (stores prep for weekend)    │
│ • Evening shopping (after 6pm) = 50% off meat, bakery, ready meals         │
│ • Download ALL store apps - Woolworths, Coles, ALDI, Costco                │
│ • Stack cashback: Shopback (up to 7%), Cashrewards (up to 5%)              │
│ • Meal plan around specials, not the other way around                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ FUEL MASTERY ($4K-8K/year)                                                  │
│ • FuelWatch WA: Check EVERY morning at 6am for tomorrow's prices           │
│ • Costco Perth Airport: Consistently 15-25c/L cheaper (157.6c vs 183c)     │
│ • Fill up Tuesday-Wednesday (lowest weekly prices typically)               │
│ • Metro Petroleum, United, Puma: Usually 5-10c cheaper than big brands     │
│ • 7-Eleven Fuel Lock app: Lock in low prices for 7 days                    │
│ • Shell Coles Express: Use Flybuys for 4c/L off                            │
│                                                                             │
│ FLEET OPTIMIZATION (Business):                                              │
│ • Bulk fuel cards: BP Plus, Shell Card = 2-5c/L discounts                  │
│ • Route optimization: Saves 10-20% on fuel costs                           │
│ • Electric/hybrid transition: Perth has 1000+ public chargers              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ UTILITIES & BILLS ($3K-6K/year)                                             │
│ ELECTRICITY (Synergy):                                                      │
│ • Midday Saver plan: 8.4c/kWh (9am-3pm) vs 28c standard                    │
│ • Home Battery Scheme: $3K-5K rebate for solar + battery                   │
│ • Solar: 6.6kW system = $0 electricity bills + feed-in credits             │
│ • Hot water: Switch to off-peak timer, save $400+/year                     │
│                                                                             │
│ GAS (ATCO/Kleenheat/AGL):                                                   │
│ • Compare at Energy Made Easy - save $200-500/year                         │
│ • Kleenheat: Often cheapest, WA-owned                                      │
│                                                                             │
│ INTERNET & PHONE:                                                           │
│ • Aussie Broadband: Best value NBN ($79/mo unlimited)                      │
│ • Superloop: Competitive alternative ($69/mo)                              │
│ • Belong: Cheapest basic ($55/mo)                                          │
│ • Mobile: Boost (Telstra network), Aldi Mobile (cheaper)                   │
│ • Negotiate: Call every 12 months for loyalty discounts                    │
│                                                                             │
│ INSURANCE (Annual Review):                                                  │
│ • Compare: iSelect, Compare the Market, Finder                             │
│ • Bundle: Home + contents + car = 10-20% discount                          │
│ • Increase excess: $500→$1000 = 20% premium reduction                      │
│ • Pay annually: Save 10-15% vs monthly                                     │
└─────────────────────────────────────────────────────────────────────────────┘

TIER 2 - WEALTH BUILDING ($20K-40K/year):
┌─────────────────────────────────────────────────────────────────────────────┐
│ SUPERANNUATION OPTIMIZATION ($4K-10K/year)                                  │
│ • Fee comparison (massive impact over 30+ years):                           │
│   - AustralianSuper: 0.69% (excellent)                                     │
│   - Hostplus: 0.72% (excellent)                                            │
│   - REST: 0.75% (very good)                                                │
│   - Industry funds beat retail funds by $100K+ over lifetime               │
│ • Consolidate: Multiple supers = multiple fees = money lost                │
│ • Salary sacrifice: Pre-tax contributions = 15% tax vs 32.5%+              │
│ • Government co-contribution: Low income = free money up to $500           │
│ • Check insurance: Remove duplicate life/TPD if not needed                 │
│ • Review annually at moneysmart.gov.au/how-to-compare-super-funds          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ INVESTMENT OPTIMIZATION ($3K-8K/year)                                       │
│ • ETFs over managed funds: 0.04% vs 1.5% fees                              │
│ • On $200K portfolio: $80/year vs $3,000/year = $2,920 SAVED               │
│ • VAS (ASX 300), VGS (Global), VDHG (Diversified Growth)                   │
│ • Self-managed investing: CommSec Pocket, Pearler, Stake                   │
│ • Avoid: High-fee financial advisors charging 1%+ of portfolio             │
│ • Free advice: ATO, Moneysmart, industry super fund advisors               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TAX DEDUCTION MASTERY ($5K-15K/year)                                        │
│ WORK-RELATED:                                                               │
│ • Home office: 67c/hour fixed rate OR actual expenses                      │
│ • Work uniforms with logo: Purchasing + laundry ($1/load)                  │
│ • Self-education: Courses improving current job skills                      │
│ • Tools & equipment: Laptops, phones (work %), tools of trade              │
│ • Travel: Between work sites, client meetings (NOT home-to-work)           │
│ • Union fees, professional subscriptions, memberships                      │
│                                                                             │
│ INVESTMENT PROPERTY:                                                        │
│ • Depreciation: Hire quantity surveyor ($500) → claim $5K-10K+/year        │
│ • Interest, rates, insurance, repairs, property management                 │
│ • Travel to inspect property (limited claims)                              │
│                                                                             │
│ BUSINESS/SOLE TRADER:                                                       │
│ • Vehicle: Logbook method = actual expenses claimed                        │
│ • Home office: Percentage of rent/mortgage, utilities, internet            │
│ • Equipment instant asset write-off up to $20K                             │
└─────────────────────────────────────────────────────────────────────────────┘

TIER 3 - MAJOR LIFE EXPENSES ($15K-35K/year):
┌─────────────────────────────────────────────────────────────────────────────┐
│ PROPERTY & RENT ($8K-20K/year)                                              │
│ HOMEOWNERS:                                                                 │
│ • Refinance: Every 2-3 years, negotiate better rates                       │
│ • Current best rates: 5.99-6.49% (compare at RateCity, Canstar)            │
│ • Offset accounts: Every $ in offset = less interest paid                  │
│ • Extra repayments: Even $100/week cuts years off mortgage                 │
│                                                                             │
│ RENTERS:                                                                    │
│ • Negotiate at lease renewal: Good tenants = leverage                      │
│ • Longer lease (2 years) = landlord security = lower increase              │
│ • Perth rental market: Vacancy rates affect negotiating power              │
│ • Consider share housing: Split bills, save $10K+/year                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ SUBSCRIPTION AUDIT ($2K-5K/year)                                            │
│ AUDIT THESE MONTHLY:                                                        │
│ • Streaming: Do you REALLY need Netflix + Stan + Disney+ + Binge?          │
│ • Gym: $60/month unused = $720/year wasted (try outdoor fitness)           │
│ • Apps: Check App Store/Play Store subscriptions                           │
│ • News: Free alternatives exist (ABC, SBS, library access)                 │
│ • Software: Annual vs monthly (save 20%+), student discounts               │
│ • Amazon Prime: Worth it only if using frequently                          │
│                                                                             │
│ PRO TIP: Set calendar reminder every 3 months to audit subscriptions       │
└─────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════
🏪 PERTH RETAIL INTELLIGENCE DATABASE
═══════════════════════════════════════════════════════════════════════════════

MAJOR SUPERMARKETS (Price Tier: 💰=cheapest, 💰💰💰=most expensive):
• ALDI 💰: Northbridge, Morley, Cockburn, Joondalup - 30-40% cheaper on basics
• Spudshed 💰: Malaga, Jandakot, Morley, Innaloo - WA produce champion
• Costco 💰: Perth Airport - bulk buying paradise, membership $65/year
• Woolworths 💰💰: Everywhere - best rewards program (Everyday Rewards)
• Coles 💰💰: Everywhere - Flybuys, good specials cycle
• IGA 💰💰: Local stores - support local, check weekly specials
• Farmer Jacks 💰💰💰: Premium quality, worth it for meat

SPECIALTY SAVINGS:
• Asian grocers (Northbridge, Cannington): Rice, noodles, sauces 50% cheaper
• Fremantle Markets (Fri-Sun): Fresh produce, artisan goods
• Wanneroo Markets (Sat-Sun): Cheapest fruit & veg in Perth
• Perth Markets (Canning Vale): Wholesale access early morning
• Chemist Warehouse: OTC medicines 30-50% cheaper than pharmacies

FUEL STATIONS (Cheapest to most expensive):
• Costco Perth Airport 💰: Consistently lowest (157-165c/L)
• Metro Petroleum 💰: Multiple locations, usually 5-10c below average
• United 💰: Good prices, nice facilities
• Puma 💰💰: Competitive, good locations
• Liberty 💰💰: Mid-range pricing
• Shell/BP/Caltex 💰💰💰: Premium pricing, use for rewards only

═══════════════════════════════════════════════════════════════════════════════
🤖 AI REASONING & RESPONSE PROTOCOL
═══════════════════════════════════════════════════════════════════════════════

WHEN RESPONDING, ALWAYS:
1. ANALYZE: What is the user's REAL goal? (save money, reduce stress, optimize time)
2. CALCULATE: Provide SPECIFIC dollar amounts when possible
3. PRIORITIZE: Give highest-impact actions first
4. LOCALIZE: Reference Perth-specific stores, deals, and context
5. PERSONALIZE: Use any provided user data to tailor advice
6. ACTIONIZE: Every response should have clear NEXT STEPS

RESPONSE STRUCTURE:
• Start with empathy/acknowledgment
• Provide 2-3 HIGH-IMPACT recommendations
• Include specific Perth stores/services
• End with a motivating call-to-action
• Keep responses focused but comprehensive

COMMUNICATION STYLE:
• Friendly, energetic, genuinely helpful
• Use **bold** for key figures and actions
• Bullet points for multiple options
• Celebrate wins and progress
• Be honest about effort vs. reward tradeoffs

NEVER:
• Give vague "you could save money by spending less" advice
• Ignore Perth-specific context
• Overwhelm with too many options at once
• Make users feel guilty about spending
• Recommend anything without explaining the WHY`;

async function callClaude(systemPrompt: string, userMessage: string, conversationHistory: any[] = []): Promise<string> {
  const messages: Anthropic.MessageParam[] = conversationHistory.map((msg) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content,
  }));
  messages.push({ role: "user", content: userMessage });

  const response = await anthropic.messages.create({
    model: MODEL_CONFIG.claude.model,
    max_tokens: MODEL_CONFIG.claude.maxTokens,
    system: systemPrompt,
    messages,
  });

  const content = response.content[0];
  if (content.type === "text") return content.text;
  throw new Error("Unexpected Claude response type");
}

async function callOpenAI(systemPrompt: string, userMessage: string, conversationHistory: any[] = []): Promise<string> {
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.map((msg) => ({
      role: msg.role === "assistant" ? "assistant" as const : "user" as const,
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  const response = await openai.chat.completions.create({
    model: MODEL_CONFIG.openai.model,
    messages,
    max_completion_tokens: MODEL_CONFIG.openai.maxTokens,
  });

  return response.choices[0]?.message?.content || "";
}

async function callGemini(systemPrompt: string, userMessage: string, conversationHistory: any[] = []): Promise<string> {
  const messages = [
    { role: "user" as const, parts: [{ text: systemPrompt }] },
    { role: "model" as const, parts: [{ text: "I understand. I'm Perth Smart Saver AI, ready to help!" }] },
    ...conversationHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }],
    })),
    { role: "user" as const, parts: [{ text: userMessage }] },
  ];

  const result = await gemini.models.generateContent({
    model: MODEL_CONFIG.gemini.model,
    contents: messages,
    config: { maxOutputTokens: MODEL_CONFIG.gemini.maxTokens, temperature: 0.7 },
  });

  const text = extractGeminiText(result);
  if (!text) throw new Error("Empty Gemini response");
  return text;
}

export function buildSmartUserContext(userData: {
  user?: any;
  goals?: any[];
  alerts?: any[];
  bills?: any[];
  savings?: any[];
  receipts?: any[];
}): string {
  const context = getSmartContext();
  
  let smartContext = `
═══════════════════════════════════════════════════════════════════════════════
📍 REAL-TIME PERTH CONTEXT
═══════════════════════════════════════════════════════════════════════════════
Current time in Perth: ${context.perthTime} (${context.timeOfDay})
Day: ${context.dayOfWeek} ${context.isWeekend ? "(WEEKEND - Markets open!)" : ""}
Season: ${context.season} in Perth
Shopping tip: ${context.shoppingContext}`;

  if (context.isWeekend) {
    smartContext += `
🛒 WEEKEND SPECIALS: Wanneroo Markets & Fremantle Markets are open!`;
  }

  if (context.dayOfWeek === "Wednesday" || context.dayOfWeek === "Thursday") {
    smartContext += `
💡 MID-WEEK TIP: Best day for fresh produce markdowns at major supermarkets!`;
  }

  if (userData.user) {
    const user = userData.user;
    smartContext += `

═══════════════════════════════════════════════════════════════════════════════
👤 USER PROFILE
═══════════════════════════════════════════════════════════════════════════════
Name: ${user.firstName || "Member"}
Location: ${user.location || "Perth, WA"}
Household: ${user.household || "Family"}
Member since: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recent"}`;
  }

  if (userData.goals && userData.goals.length > 0) {
    const activeGoals = userData.goals.filter((g: any) => g.isActive !== false).slice(0, 5);
    if (activeGoals.length > 0) {
      smartContext += `

═══════════════════════════════════════════════════════════════════════════════
🎯 ACTIVE SAVINGS GOALS
═══════════════════════════════════════════════════════════════════════════════`;
      activeGoals.forEach((goal: any) => {
        const current = parseFloat(goal.currentSavings || "0");
        const target = parseFloat(goal.targetSavings || "1");
        const progress = Math.round((current / target) * 100);
        const remaining = target - current;
        smartContext += `
• ${goal.category}: $${current.toFixed(0)}/$${target.toFixed(0)} (${progress}% complete, $${remaining.toFixed(0)} to go)`;
        if (goal.deadline) {
          smartContext += ` - Target date: ${new Date(goal.deadline).toLocaleDateString()}`;
        }
      });
    }
  }

  if (userData.alerts && userData.alerts.length > 0) {
    const activeAlerts = userData.alerts.filter((a: any) => a.isActive).slice(0, 8);
    if (activeAlerts.length > 0) {
      smartContext += `

═══════════════════════════════════════════════════════════════════════════════
🔔 PRICE TRACKING (Products Being Watched)
═══════════════════════════════════════════════════════════════════════════════`;
      activeAlerts.forEach((alert: any) => {
        smartContext += `
• ${alert.productName}: Alert when below $${alert.targetPrice} at ${alert.storeName || "any store"}`;
      });
    }
  }

  if (userData.bills && userData.bills.length > 0) {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingBills = userData.bills.filter((b: any) => {
      const dueDate = new Date(b.dueDate);
      return dueDate >= today && dueDate <= nextWeek && !b.isPaid;
    }).slice(0, 5);
    
    if (upcomingBills.length > 0) {
      const totalDue = upcomingBills.reduce((sum: number, b: any) => sum + parseFloat(b.amount || "0"), 0);
      smartContext += `

═══════════════════════════════════════════════════════════════════════════════
📅 UPCOMING BILLS (Next 7 Days) - Total: $${totalDue.toFixed(2)}
═══════════════════════════════════════════════════════════════════════════════`;
      upcomingBills.forEach((bill: any) => {
        smartContext += `
• ${bill.name}: $${bill.amount} due ${new Date(bill.dueDate).toLocaleDateString()} (${bill.category || "General"})`;
      });
    }
  }

  if (userData.savings && userData.savings.length > 0) {
    const recentSavings = userData.savings.slice(0, 10);
    const totalRecent = recentSavings.reduce((sum: number, s: any) => sum + parseFloat(s.amount || "0"), 0);
    const topCategories = Array.from(new Set(recentSavings.map((s: any) => s.category))).slice(0, 3);
    
    smartContext += `

═══════════════════════════════════════════════════════════════════════════════
💰 RECENT SAVINGS ACTIVITY
═══════════════════════════════════════════════════════════════════════════════
Total recent savings: $${totalRecent.toFixed(2)}
Top categories: ${topCategories.join(", ") || "Various"}
Keep up the momentum! 🚀`;
  }

  return smartContext;
}

export function generateProactiveTip(context: SmartContext, userData?: any): string {
  const tips: Record<string, string[]> = {
    morning: [
      "☀️ Morning fuel tip: Check FuelWatch now - tomorrow's prices are locked in at 6am!",
      "🛒 Early bird? Woolworths and Coles restock overnight - freshest produce available now!",
      "📱 Start your day by scanning this week's Coles and Woolworths catalogues in their apps!",
    ],
    afternoon: [
      "🥪 Lunch run? Check the deli counter at Woolworths - afternoon markdowns starting soon!",
      "⚡ Energy tip: Switch heavy appliances to run now if you're on Synergy Midday Saver (8.4c/kWh until 3pm)!",
      "🏪 Good time to compare prices across apps - ALDI, Woolworths, Coles all have mobile catalogues!",
    ],
    evening: [
      "🏷️ MARKDOWN HOUR! Head to Woolworths/Coles for 50% off meat, bakery, and ready meals!",
      "🌙 Evening power rates are lower on Synergy Midday Saver from 9pm - time to run dishwasher/washing machine!",
      "📊 Great time to review your daily spending and log any savings!",
    ],
    night: [
      "🌟 Planning tomorrow? Check FuelWatch for the best fuel prices in your area!",
      "📝 Night owl tip: Meal plan for the week using tomorrow's supermarket specials!",
      "💤 Set up your price alerts before bed - we'll notify you when items drop!",
    ]
  };

  const weekendTips = [
    "🎪 Weekend markets are open! Wanneroo Markets and Fremantle Markets have the freshest produce at great prices!",
    "🚗 Weekend trip? Costco Perth Airport has the cheapest fuel - worth the drive for a full tank!",
    "🛍️ Great day for a Spudshed run - Malaga, Jandakot, or Morley for WA's best produce deals!",
  ];

  const seasonalTips: Record<string, string[]> = {
    summer: ["🍉 Summer fruit season! Stone fruits, melons, and berries are at their cheapest now!", "☀️ Solar power tip: Your panels are generating max power - run heavy appliances during the day!"],
    autumn: ["🍂 Autumn harvest! Apples, pears, and root vegetables are in season and affordable!", "🔥 Time to compare heating costs - Kleenheat vs AGL for best gas rates!"],
    winter: ["❄️ Winter warmth tip: Electric blankets are cheaper than heating the whole house!", "🍲 Soup season! Bulk buy vegetables for hearty, cheap winter meals!"],
    spring: ["🌸 Spring cleaning? Compare home insurance before renewal - save $200-500!", "🌱 Perfect time to start a veggie garden - Perth's climate is ideal!"],
  };

  let availableTips = [...tips[context.timeOfDay]];
  
  if (context.isWeekend) {
    availableTips = [...availableTips, ...weekendTips];
  }
  
  availableTips = [...availableTips, ...seasonalTips[context.season]];

  return availableTips[Math.floor(Math.random() * availableTips.length)];
}

export async function generateSavingsAdvice(
  userMessage: string,
  conversationHistory: any[] = [],
  preferredProvider?: AIProvider,
  enhancedContext?: string
): Promise<{ text: string; provider: AIProvider }> {
  const context = getSmartContext();
  const proactiveTip = generateProactiveTip(context);
  
  const fullSystemPrompt = ULTRA_SMART_CONTEXT + (enhancedContext || "") + `

═══════════════════════════════════════════════════════════════════════════════
⚡ TODAY'S PROACTIVE TIP
═══════════════════════════════════════════════════════════════════════════════
${proactiveTip}`;

  const providers = preferredProvider
    ? [preferredProvider, ...PROVIDER_PRIORITY.filter((p) => p !== preferredProvider)]
    : PROVIDER_PRIORITY;

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      const text = await pRetry(
        async () => {
          console.log(`[AI] Attempting ${provider}...`);
          switch (provider) {
            case "claude":
              return await callClaude(fullSystemPrompt, userMessage, conversationHistory);
            case "openai":
              return await callOpenAI(fullSystemPrompt, userMessage, conversationHistory);
            case "gemini":
              return await callGemini(fullSystemPrompt, userMessage, conversationHistory);
          }
        },
        {
          retries: 3,
          minTimeout: 1000,
          maxTimeout: 10000,
          factor: 2,
          onFailedAttempt: (error) => {
            if (!isRateLimitError(error)) throw error;
            console.log(`[AI] ${provider} rate limited, retrying...`);
          },
        }
      );

      console.log(`[AI] Success with ${provider}`);
      return { text, provider };
    } catch (error: any) {
      console.error(`[AI] ${provider} failed:`, error.message);
      lastError = error;
    }
  }

  throw lastError || new Error("All AI providers failed");
}

export async function generateSmartDailyInsight(userData: {
  goals?: any[];
  savings?: any[];
  bills?: any[];
  alerts?: any[];
}): Promise<string> {
  const context = getSmartContext();
  const insights: string[] = [];

  if (userData.goals) {
    userData.goals.forEach((goal: any) => {
      if (!goal.isActive) return;
      const progress = (parseFloat(goal.currentSavings || "0") / parseFloat(goal.targetSavings || "1")) * 100;
      if (progress >= 90) {
        insights.push(`🎉 Almost there! Your "${goal.category}" goal is ${progress.toFixed(0)}% complete!`);
      } else if (progress >= 50) {
        insights.push(`💪 Halfway to your "${goal.category}" goal! Keep it up!`);
      }
    });
  }

  if (userData.bills) {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const urgentBills = userData.bills.filter((b: any) => {
      const dueDate = new Date(b.dueDate);
      return dueDate <= tomorrow && !b.isPaid;
    });
    if (urgentBills.length > 0) {
      const total = urgentBills.reduce((sum: number, b: any) => sum + parseFloat(b.amount || "0"), 0);
      insights.push(`⚠️ ${urgentBills.length} bill${urgentBills.length > 1 ? 's' : ''} due soon ($${total.toFixed(2)} total)`);
    }
  }

  if (userData.savings && userData.savings.length > 0) {
    const thisMonth = userData.savings.filter((s: any) => {
      const date = new Date(s.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    const monthlyTotal = thisMonth.reduce((sum: number, s: any) => sum + parseFloat(s.amount || "0"), 0);
    if (monthlyTotal > 0) {
      insights.push(`📈 You've saved $${monthlyTotal.toFixed(2)} this month! Great progress!`);
    }
  }

  const proactiveTip = generateProactiveTip(context, userData);
  insights.push(proactiveTip);

  return insights.slice(0, 3).join("\n");
}

export async function analyzeSavingsOpportunity(data: {
  grocerySpend?: number;
  fuelSpend?: number;
  utilities?: number;
  subscriptions?: string[];
  income?: number;
  household?: string;
}): Promise<{
  totalPotentialSavings: number;
  breakdown: { category: string; savings: number; action: string }[];
  quickWins: string[];
  provider: AIProvider;
}> {
  const prompt = `Analyze this Perth resident's spending and calculate REALISTIC savings opportunities:

CURRENT MONTHLY SPENDING:
- Groceries: $${data.grocerySpend || 800}
- Fuel: $${data.fuelSpend || 300}
- Utilities: $${data.utilities || 400}
- Subscriptions: ${data.subscriptions?.join(", ") || "Unknown"}
- Household: ${data.household || "Family"}
- Income: $${data.income || 80000}/year

Calculate specific ANNUAL dollar savings for each category including investments, tax, fleet & business. Aim for $50K-100K total.
Format as JSON: { totalPotentialSavings: number, breakdown: [{ category, savings, action }], quickWins: string[] }`;

  try {
    const { text, provider } = await generateSavingsAdvice(prompt, []);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { ...parsed, provider };
    }
    throw new Error("No JSON found in response");
  } catch (error) {
    console.error("[AI] Analysis fallback used");
    return {
      totalPotentialSavings: 75000,
      breakdown: [
        { category: "Groceries & Fuel", savings: 15000, action: "Switch to ALDI, Spudshed, use FuelWatch WA" },
        { category: "Superannuation Fees", savings: 6000, action: "Switch to low-fee super fund (AustralianSuper, Hostplus)" },
        { category: "Investment Fees", savings: 3500, action: "Move to ETFs, avoid managed funds" },
        { category: "Tax Deductions", savings: 10000, action: "Claim work-related, home office, vehicle expenses" },
        { category: "Fleet Fuel", savings: 8000, action: "Bulk fuel purchasing, FuelWatch timing" },
        { category: "Subscriptions", savings: 3000, action: "Audit and cancel unused subscriptions" },
        { category: "Property/Rental", savings: 14000, action: "Refinance mortgage, negotiate rent" },
        { category: "Business Expenses", savings: 15500, action: "Wholesale suppliers, bulk deals" },
      ],
      quickWins: [
        "Check super fund fees at moneysmart.gov.au - save $2K+/year",
        "Review tax deductions with accountant - recover $5K+",
        "Refinance mortgage - save $8K+ annually",
        "Switch to FuelWatch timing - save $2K+/year",
      ],
      provider: "claude",
    };
  }
}

export async function batchProcessWithAI(
  prompts: string[],
  preferredProvider?: AIProvider
): Promise<{ results: string[]; provider: AIProvider }> {
  const limit = pLimit(2);
  let usedProvider: AIProvider = "claude";

  const results = await Promise.all(
    prompts.map((prompt) =>
      limit(async () => {
        const { text, provider } = await generateSavingsAdvice(prompt, [], preferredProvider);
        usedProvider = provider;
        return text;
      })
    )
  );

  return { results, provider: usedProvider };
}

export function getAvailableProviders(): AIProvider[] {
  const available: AIProvider[] = [];
  if (process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY) available.push("claude");
  if (process.env.AI_INTEGRATIONS_GEMINI_API_KEY) available.push("gemini");
  if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY) available.push("openai");
  return available;
}

export { getSmartContext, ULTRA_SMART_CONTEXT };
