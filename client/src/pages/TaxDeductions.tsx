import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Receipt, Calculator, FileText, CheckCircle2, AlertTriangle,
  DollarSign, Building2, Car, Briefcase, Home, Laptop, Heart,
  Sparkles, ArrowRight, Download, Shield
} from "lucide-react";

const deductionCategories = [
  {
    category: "Work From Home",
    icon: Home,
    deductions: [
      { name: "Home office equipment (desk, chair)", amount: 800, claimed: false },
      { name: "Internet (work portion 40%)", amount: 480, claimed: true },
      { name: "Electricity (work portion)", amount: 320, claimed: false },
      { name: "Phone expenses (work calls)", amount: 240, claimed: true },
      { name: "Stationery & supplies", amount: 150, claimed: false },
    ]
  },
  {
    category: "Vehicle & Travel",
    icon: Car,
    deductions: [
      { name: "Work-related car expenses (5,000 km @ 85c)", amount: 4250, claimed: false },
      { name: "Parking fees (work meetings)", amount: 360, claimed: false },
      { name: "Tolls (work travel)", amount: 180, claimed: true },
      { name: "Public transport (work travel)", amount: 520, claimed: true },
    ]
  },
  {
    category: "Professional Development",
    icon: Briefcase,
    deductions: [
      { name: "Course fees & certifications", amount: 2500, claimed: false },
      { name: "Professional memberships", amount: 450, claimed: true },
      { name: "Industry magazines & journals", amount: 180, claimed: false },
      { name: "Conference attendance", amount: 800, claimed: false },
    ]
  },
  {
    category: "Technology",
    icon: Laptop,
    deductions: [
      { name: "Laptop/computer (work portion)", amount: 1200, claimed: false },
      { name: "Software subscriptions", amount: 480, claimed: true },
      { name: "Cloud storage", amount: 120, claimed: false },
      { name: "Cybersecurity tools", amount: 150, claimed: false },
    ]
  },
  {
    category: "Charitable & Other",
    icon: Heart,
    deductions: [
      { name: "Donations to registered charities", amount: 1500, claimed: true },
      { name: "Income protection insurance", amount: 960, claimed: false },
      { name: "Tax agent fees (last year)", amount: 350, claimed: true },
      { name: "Union fees", amount: 520, claimed: true },
    ]
  }
];

const businessDeductions = [
  { name: "Rent/Mortgage interest (home office %)", amount: 8400, category: "Premises" },
  { name: "Equipment depreciation", amount: 4500, category: "Assets" },
  { name: "Business insurance", amount: 2400, category: "Insurance" },
  { name: "Accounting & legal fees", amount: 3500, category: "Professional" },
  { name: "Marketing & advertising", amount: 2800, category: "Marketing" },
  { name: "Staff wages & super", amount: 45000, category: "Wages" },
  { name: "Utilities (business portion)", amount: 1800, category: "Utilities" },
];

export default function TaxDeductions() {
  const [claimedDeductions, setClaimedDeductions] = useState<Set<string>>(new Set());

  const toggleDeduction = (name: string) => {
    const newSet = new Set(claimedDeductions);
    if (newSet.has(name)) {
      newSet.delete(name);
    } else {
      newSet.add(name);
    }
    setClaimedDeductions(newSet);
  };

  const totalPotential = deductionCategories.reduce((sum, cat) => 
    sum + cat.deductions.reduce((s, d) => s + d.amount, 0), 0);
  
  const totalClaimed = deductionCategories.reduce((sum, cat) => 
    sum + cat.deductions.filter(d => d.claimed).reduce((s, d) => s + d.amount, 0), 0);
  
  const missedDeductions = totalPotential - totalClaimed;
  const taxSavings = Math.round(missedDeductions * 0.325);

  return (
    <div className="min-h-full">
      <motion.div
        className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Receipt className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Tax Deductions Scanner</h1>
              <p className="text-white/60 text-sm">Find missed deductions & maximize your refund</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-zinc-900/80 border-purple-500/10">
              <CardContent className="p-4">
                <p className="text-white/60 text-xs uppercase tracking-wide">Potential Deductions</p>
                <p className="text-2xl font-bold text-purple-400">${totalPotential.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/80 border-yellow-500/10">
              <CardContent className="p-4">
                <p className="text-white/60 text-xs uppercase tracking-wide">Unclaimed Amount</p>
                <p className="text-2xl font-bold text-yellow-400">${missedDeductions.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500/20 to-purple-500/10 border-green-500/20">
              <CardContent className="p-4">
                <p className="text-white/60 text-xs uppercase tracking-wide">Tax Savings</p>
                <p className="text-2xl font-bold text-green-400">${taxSavings.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid grid-cols-2 bg-zinc-900/80 border border-purple-500/10">
            <TabsTrigger value="personal" data-testid="tab-personal">
              <FileText className="h-4 w-4 mr-2" />
              Personal Tax
            </TabsTrigger>
            <TabsTrigger value="business" data-testid="tab-business">
              <Building2 className="h-4 w-4 mr-2" />
              Business Tax
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            {deductionCategories.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <Card className="bg-zinc-900/80 border-purple-500/10 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-500/5 to-transparent">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <category.icon className="h-5 w-5 text-purple-400" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    {category.deductions.map((deduction, i) => (
                      <div
                        key={deduction.name}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          deduction.claimed 
                            ? "bg-green-500/10 border border-green-500/20" 
                            : "bg-zinc-800/50 border border-white/5 hover:border-yellow-500/30"
                        }`}
                        data-testid={`deduction-${catIndex}-${i}`}
                      >
                        <Checkbox
                          checked={deduction.claimed}
                          className="border-purple-500/50"
                        />
                        <div className="flex-1">
                          <p className="text-white text-sm">{deduction.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-purple-400">${deduction.amount}</span>
                          {deduction.claimed ? (
                            <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Claimed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Missed
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Calculator className="h-10 w-10 text-purple-400" />
                    <div>
                      <h3 className="font-semibold text-white">Your Potential Tax Refund Increase</h3>
                      <p className="text-purple-400 text-3xl font-bold">${taxSavings.toLocaleString()}</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-500 to-cyan-500" data-testid="btn-claim-all">
                    Claim All Deductions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <Card className="bg-zinc-900/80 border-purple-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-400" />
                  Business Expense Deductions
                </CardTitle>
                <CardDescription>Common business deductions for Perth small businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {businessDeductions.map((item, i) => (
                  <motion.div
                    key={item.name}
                    className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-white/5 hover:border-purple-500/30 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    data-testid={`business-deduction-${i}`}
                  >
                    <div>
                      <Badge variant="outline" className="mb-1 text-xs">{item.category}</Badge>
                      <p className="text-white">{item.name}</p>
                    </div>
                    <p className="text-xl font-bold text-purple-400">${item.amount.toLocaleString()}</p>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-white font-semibold">Total Business Deductions</span>
                  <span className="text-2xl font-bold text-green-400">
                    ${businessDeductions.reduce((s, d) => s + d.amount, 0).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Shield className="h-10 w-10 text-cyan-400" />
                  <div>
                    <h3 className="font-semibold text-white">Estimated Business Tax Savings</h3>
                    <p className="text-cyan-400 text-3xl font-bold">
                      ${Math.round(businessDeductions.reduce((s, d) => s + d.amount, 0) * 0.25).toLocaleString()}
                    </p>
                    <p className="text-sm text-white/60">Based on 25% company tax rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 h-12 border-purple-500/30" data-testid="btn-export">
            <Download className="h-4 w-4 mr-2" />
            Export for Tax Agent
          </Button>
          <Button className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-cyan-500" data-testid="btn-scan">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Deduction Scan
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
