import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Store, MapPin, TrendingDown, ArrowRight, Plus,
  Trash2, RefreshCw, CheckCircle, AlertCircle, DollarSign, Clock,
  ChevronDown, ChevronUp, Car, Fuel, Zap, Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface BasketItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  prices: {
    store: string;
    price: number;
    unitPrice: number;
    inStock: boolean;
    special?: string;
  }[];
}

interface StoreResult {
  store: string;
  logo: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  savings: number;
  distance: number;
  driveTime: number;
}

interface OptimizationResult {
  strategy: "single" | "split";
  stores: StoreResult[];
  totalCost: number;
  totalSavings: number;
  savingsPercent: number;
  estimatedTime: number;
  fuelCost: number;
}

const PERTH_STORES = [
  { id: "woolworths", name: "Woolworths", logo: "🛒", color: "bg-green-600" },
  { id: "coles", name: "Coles", logo: "🔴", color: "bg-red-600" },
  { id: "aldi", name: "ALDI", logo: "🟡", color: "bg-cyan-500" },
  { id: "iga", name: "IGA", logo: "🏪", color: "bg-purple-600" },
  { id: "spudshed", name: "Spudshed", logo: "🥔", color: "bg-orange-500" },
  { id: "costco", name: "Costco Perth", logo: "📦", color: "bg-red-700" },
];

// Comprehensive Perth grocery and retail product database
// Prices are based on typical Perth metro prices from Woolworths, Coles, ALDI, IGA, Spudshed, and Costco
const PERTH_PRODUCTS: BasketItem[] = [
  // === DAIRY & EGGS ===
  { id: "milk-2l", name: "Full Cream Milk 2L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 1.75, inStock: true },
    { store: "Coles", price: 3.40, unitPrice: 1.70, inStock: true },
    { store: "ALDI", price: 2.89, unitPrice: 1.45, inStock: true, special: "Everyday low" },
    { store: "IGA", price: 3.80, unitPrice: 1.90, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 1.50, inStock: true },
    { store: "Costco Perth", price: 2.49, unitPrice: 1.25, inStock: true },
  ]},
  { id: "milk-skim-2l", name: "Skim Milk 2L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 1.75, inStock: true },
    { store: "Coles", price: 3.40, unitPrice: 1.70, inStock: true },
    { store: "ALDI", price: 2.89, unitPrice: 1.45, inStock: true },
    { store: "IGA", price: 3.90, unitPrice: 1.95, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 1.50, inStock: true },
  ]},
  { id: "eggs-12", name: "Free Range Eggs 12pk", quantity: 1, unit: "dozen", prices: [
    { store: "Woolworths", price: 7.50, unitPrice: 0.63, inStock: true },
    { store: "Coles", price: 7.00, unitPrice: 0.58, inStock: true, special: "Half price" },
    { store: "ALDI", price: 5.99, unitPrice: 0.50, inStock: true },
    { store: "IGA", price: 8.00, unitPrice: 0.67, inStock: true },
    { store: "Spudshed", price: 5.49, unitPrice: 0.46, inStock: true },
    { store: "Costco Perth", price: 11.99, unitPrice: 0.40, inStock: true },
  ]},
  { id: "butter-500g", name: "Butter 500g", quantity: 1, unit: "block", prices: [
    { store: "Woolworths", price: 7.00, unitPrice: 14.00, inStock: true },
    { store: "Coles", price: 6.80, unitPrice: 13.60, inStock: true },
    { store: "ALDI", price: 5.49, unitPrice: 10.98, inStock: true },
    { store: "IGA", price: 7.50, unitPrice: 15.00, inStock: true },
    { store: "Spudshed", price: 5.99, unitPrice: 11.98, inStock: true },
  ]},
  { id: "cheese-tasty-500g", name: "Tasty Cheese Block 500g", quantity: 1, unit: "block", prices: [
    { store: "Woolworths", price: 8.50, unitPrice: 17.00, inStock: true },
    { store: "Coles", price: 8.00, unitPrice: 16.00, inStock: true, special: "Save $2" },
    { store: "ALDI", price: 6.49, unitPrice: 12.98, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 18.00, inStock: true },
    { store: "Spudshed", price: 6.99, unitPrice: 13.98, inStock: true },
    { store: "Costco Perth", price: 15.99, unitPrice: 8.00, inStock: true },
  ]},
  { id: "yogurt-greek-1kg", name: "Greek Yogurt 1kg", quantity: 1, unit: "tub", prices: [
    { store: "Woolworths", price: 7.00, unitPrice: 7.00, inStock: true },
    { store: "Coles", price: 6.50, unitPrice: 6.50, inStock: true },
    { store: "ALDI", price: 4.99, unitPrice: 4.99, inStock: true },
    { store: "IGA", price: 7.50, unitPrice: 7.50, inStock: true },
    { store: "Spudshed", price: 5.49, unitPrice: 5.49, inStock: true },
  ]},
  { id: "cream-300ml", name: "Thickened Cream 300ml", quantity: 1, unit: "carton", prices: [
    { store: "Woolworths", price: 3.80, unitPrice: 12.67, inStock: true },
    { store: "Coles", price: 3.50, unitPrice: 11.67, inStock: true },
    { store: "ALDI", price: 2.69, unitPrice: 8.97, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 13.33, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 9.97, inStock: true },
  ]},

  // === BREAD & BAKERY ===
  { id: "bread-white", name: "White Bread Loaf", quantity: 1, unit: "loaf", prices: [
    { store: "Woolworths", price: 3.00, unitPrice: 3.00, inStock: true },
    { store: "Coles", price: 2.80, unitPrice: 2.80, inStock: true },
    { store: "ALDI", price: 1.89, unitPrice: 1.89, inStock: true },
    { store: "IGA", price: 3.50, unitPrice: 3.50, inStock: true },
    { store: "Spudshed", price: 2.50, unitPrice: 2.50, inStock: true },
  ]},
  { id: "bread-wholemeal", name: "Wholemeal Bread Loaf", quantity: 1, unit: "loaf", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 3.50, inStock: true },
    { store: "Coles", price: 3.20, unitPrice: 3.20, inStock: true },
    { store: "ALDI", price: 2.29, unitPrice: 2.29, inStock: true },
    { store: "IGA", price: 3.80, unitPrice: 3.80, inStock: true },
    { store: "Spudshed", price: 2.79, unitPrice: 2.79, inStock: true },
  ]},
  { id: "bread-sourdough", name: "Sourdough Loaf", quantity: 1, unit: "loaf", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 5.50, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 5.00, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 3.99, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 6.00, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 4.49, inStock: true },
  ]},
  { id: "wraps-10pk", name: "Wraps 10 Pack", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 0.40, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 0.38, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 0.30, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 0.45, inStock: true },
    { store: "Spudshed", price: 3.29, unitPrice: 0.33, inStock: true },
  ]},

  // === MEAT & POULTRY ===
  { id: "chicken-breast", name: "Chicken Breast 1kg", quantity: 1, unit: "kg", prices: [
    { store: "Woolworths", price: 12.00, unitPrice: 12.00, inStock: true },
    { store: "Coles", price: 11.50, unitPrice: 11.50, inStock: true },
    { store: "ALDI", price: 9.99, unitPrice: 9.99, inStock: true },
    { store: "IGA", price: 14.00, unitPrice: 14.00, inStock: false },
    { store: "Spudshed", price: 8.99, unitPrice: 8.99, inStock: true, special: "Weekly special" },
    { store: "Costco Perth", price: 7.99, unitPrice: 7.99, inStock: true },
  ]},
  { id: "chicken-thigh", name: "Chicken Thigh Fillets 1kg", quantity: 1, unit: "kg", prices: [
    { store: "Woolworths", price: 10.00, unitPrice: 10.00, inStock: true },
    { store: "Coles", price: 9.50, unitPrice: 9.50, inStock: true },
    { store: "ALDI", price: 7.99, unitPrice: 7.99, inStock: true },
    { store: "IGA", price: 11.00, unitPrice: 11.00, inStock: true },
    { store: "Spudshed", price: 6.99, unitPrice: 6.99, inStock: true },
  ]},
  { id: "beef-mince-500g", name: "Beef Mince 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 16.00, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 15.00, inStock: true },
    { store: "ALDI", price: 5.99, unitPrice: 11.98, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 18.00, inStock: true },
    { store: "Spudshed", price: 5.49, unitPrice: 10.98, inStock: true, special: "WA beef" },
    { store: "Costco Perth", price: 4.99, unitPrice: 9.98, inStock: true },
  ]},
  { id: "beef-steak-rump", name: "Rump Steak 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 14.00, unitPrice: 28.00, inStock: true },
    { store: "Coles", price: 13.00, unitPrice: 26.00, inStock: true, special: "Save $5" },
    { store: "ALDI", price: 10.99, unitPrice: 21.98, inStock: true },
    { store: "IGA", price: 16.00, unitPrice: 32.00, inStock: true },
    { store: "Spudshed", price: 9.99, unitPrice: 19.98, inStock: true },
  ]},
  { id: "pork-chops", name: "Pork Chops 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 9.00, unitPrice: 18.00, inStock: true },
    { store: "Coles", price: 8.50, unitPrice: 17.00, inStock: true },
    { store: "ALDI", price: 6.99, unitPrice: 13.98, inStock: true },
    { store: "IGA", price: 10.00, unitPrice: 20.00, inStock: true },
    { store: "Spudshed", price: 5.99, unitPrice: 11.98, inStock: true },
  ]},
  { id: "lamb-chops", name: "Lamb Chops 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 15.00, unitPrice: 30.00, inStock: true },
    { store: "Coles", price: 14.00, unitPrice: 28.00, inStock: true },
    { store: "ALDI", price: 12.99, unitPrice: 25.98, inStock: true },
    { store: "IGA", price: 17.00, unitPrice: 34.00, inStock: true },
    { store: "Spudshed", price: 11.99, unitPrice: 23.98, inStock: true, special: "WA lamb" },
  ]},
  { id: "sausages-beef", name: "Beef Sausages 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 7.00, unitPrice: 14.00, inStock: true },
    { store: "Coles", price: 6.50, unitPrice: 13.00, inStock: true },
    { store: "ALDI", price: 4.99, unitPrice: 9.98, inStock: true },
    { store: "IGA", price: 8.00, unitPrice: 16.00, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 8.98, inStock: true },
  ]},
  { id: "bacon-250g", name: "Bacon Rashers 250g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 6.00, unitPrice: 24.00, inStock: true },
    { store: "Coles", price: 5.50, unitPrice: 22.00, inStock: true },
    { store: "ALDI", price: 4.49, unitPrice: 17.96, inStock: true },
    { store: "IGA", price: 6.50, unitPrice: 26.00, inStock: true },
    { store: "Spudshed", price: 3.99, unitPrice: 15.96, inStock: true },
  ]},

  // === SEAFOOD ===
  { id: "salmon-fillets", name: "Salmon Fillets 400g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 14.00, unitPrice: 35.00, inStock: true },
    { store: "Coles", price: 13.00, unitPrice: 32.50, inStock: true, special: "Fresh Tasmanian" },
    { store: "ALDI", price: 10.99, unitPrice: 27.48, inStock: true },
    { store: "IGA", price: 16.00, unitPrice: 40.00, inStock: true },
    { store: "Spudshed", price: 11.99, unitPrice: 29.98, inStock: true },
  ]},
  { id: "prawns-frozen", name: "Frozen Prawns 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 16.00, unitPrice: 32.00, inStock: true },
    { store: "Coles", price: 15.00, unitPrice: 30.00, inStock: true },
    { store: "ALDI", price: 12.99, unitPrice: 25.98, inStock: true },
    { store: "IGA", price: 18.00, unitPrice: 36.00, inStock: true },
    { store: "Costco Perth", price: 22.99, unitPrice: 23.00, inStock: true },
  ]},
  { id: "fish-battered", name: "Battered Fish Fillets 400g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 20.00, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 18.75, inStock: true },
    { store: "ALDI", price: 5.99, unitPrice: 14.98, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 22.50, inStock: true },
    { store: "Spudshed", price: 5.49, unitPrice: 13.73, inStock: true },
  ]},

  // === FRUITS ===
  { id: "bananas", name: "Bananas 1kg", quantity: 1, unit: "kg", prices: [
    { store: "Woolworths", price: 3.90, unitPrice: 3.90, inStock: true },
    { store: "Coles", price: 3.50, unitPrice: 3.50, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 2.99, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "Spudshed", price: 2.49, unitPrice: 2.49, inStock: true, special: "WA grown" },
  ]},
  { id: "apples-royal-gala", name: "Royal Gala Apples 1kg", quantity: 1, unit: "kg", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 5.50, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 5.00, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 3.99, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 6.00, inStock: true },
    { store: "Spudshed", price: 3.49, unitPrice: 3.49, inStock: true, special: "WA apples" },
  ]},
  { id: "oranges", name: "Navel Oranges 1kg", quantity: 1, unit: "kg", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "Coles", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 3.49, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 5.00, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 2.99, inStock: true },
  ]},
  { id: "strawberries", name: "Strawberries 250g", quantity: 1, unit: "punnet", prices: [
    { store: "Woolworths", price: 5.00, unitPrice: 20.00, inStock: true },
    { store: "Coles", price: 4.50, unitPrice: 18.00, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 15.96, inStock: true },
    { store: "IGA", price: 5.50, unitPrice: 22.00, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 11.96, inStock: true, special: "WA strawberries" },
  ]},
  { id: "blueberries", name: "Blueberries 125g", quantity: 1, unit: "punnet", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 44.00, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 40.00, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 31.92, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 48.00, inStock: true },
    { store: "Spudshed", price: 3.49, unitPrice: 27.92, inStock: true },
  ]},
  { id: "grapes-red", name: "Red Grapes 500g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 5.00, unitPrice: 10.00, inStock: true },
    { store: "Coles", price: 4.50, unitPrice: 9.00, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 7.98, inStock: true },
    { store: "IGA", price: 5.50, unitPrice: 11.00, inStock: true },
    { store: "Spudshed", price: 3.49, unitPrice: 6.98, inStock: true },
  ]},
  { id: "avocados", name: "Avocados 2 Pack", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 5.00, unitPrice: 2.50, inStock: true },
    { store: "Coles", price: 4.50, unitPrice: 2.25, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 1.75, inStock: true },
    { store: "IGA", price: 5.50, unitPrice: 2.75, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 1.50, inStock: true, special: "WA grown" },
  ]},
  { id: "lemons", name: "Lemons 500g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 7.00, inStock: true },
    { store: "Coles", price: 3.00, unitPrice: 6.00, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 4.98, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 8.00, inStock: true },
    { store: "Spudshed", price: 1.99, unitPrice: 3.98, inStock: true },
  ]},

  // === VEGETABLES ===
  { id: "potatoes", name: "Washed Potatoes 2kg", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 2.75, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 2.50, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 2.00, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 3.00, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 1.50, inStock: true, special: "WA potatoes" },
  ]},
  { id: "onions-brown", name: "Brown Onions 1kg", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 3.00, unitPrice: 3.00, inStock: true },
    { store: "Coles", price: 2.80, unitPrice: 2.80, inStock: true },
    { store: "ALDI", price: 1.99, unitPrice: 1.99, inStock: true },
    { store: "IGA", price: 3.50, unitPrice: 3.50, inStock: true },
    { store: "Spudshed", price: 1.49, unitPrice: 1.49, inStock: true },
  ]},
  { id: "carrots", name: "Carrots 1kg", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 2.50, unitPrice: 2.50, inStock: true },
    { store: "Coles", price: 2.30, unitPrice: 2.30, inStock: true },
    { store: "ALDI", price: 1.69, unitPrice: 1.69, inStock: true },
    { store: "IGA", price: 3.00, unitPrice: 3.00, inStock: true },
    { store: "Spudshed", price: 0.99, unitPrice: 0.99, inStock: true, special: "WA carrots" },
  ]},
  { id: "broccoli", name: "Broccoli Head", quantity: 1, unit: "each", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 3.50, inStock: true },
    { store: "Coles", price: 3.00, unitPrice: 3.00, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 2.49, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "Spudshed", price: 1.99, unitPrice: 1.99, inStock: true },
  ]},
  { id: "capsicum-red", name: "Red Capsicum Each", quantity: 1, unit: "each", prices: [
    { store: "Woolworths", price: 2.50, unitPrice: 2.50, inStock: true },
    { store: "Coles", price: 2.30, unitPrice: 2.30, inStock: true },
    { store: "ALDI", price: 1.99, unitPrice: 1.99, inStock: true },
    { store: "IGA", price: 3.00, unitPrice: 3.00, inStock: true },
    { store: "Spudshed", price: 1.49, unitPrice: 1.49, inStock: true },
  ]},
  { id: "tomatoes", name: "Tomatoes 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 8.00, inStock: true },
    { store: "Coles", price: 3.50, unitPrice: 7.00, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 5.98, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 9.00, inStock: true },
    { store: "Spudshed", price: 2.49, unitPrice: 4.98, inStock: true },
  ]},
  { id: "cucumber", name: "Cucumber Each", quantity: 1, unit: "each", prices: [
    { store: "Woolworths", price: 1.90, unitPrice: 1.90, inStock: true },
    { store: "Coles", price: 1.70, unitPrice: 1.70, inStock: true },
    { store: "ALDI", price: 1.29, unitPrice: 1.29, inStock: true },
    { store: "IGA", price: 2.20, unitPrice: 2.20, inStock: true },
    { store: "Spudshed", price: 0.99, unitPrice: 0.99, inStock: true },
  ]},
  { id: "lettuce-iceberg", name: "Iceberg Lettuce", quantity: 1, unit: "head", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 3.50, inStock: true },
    { store: "Coles", price: 3.00, unitPrice: 3.00, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 2.49, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "Spudshed", price: 1.99, unitPrice: 1.99, inStock: true },
  ]},
  { id: "spinach-baby", name: "Baby Spinach 120g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 29.17, inStock: true },
    { store: "Coles", price: 3.00, unitPrice: 25.00, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 20.75, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 33.33, inStock: true },
    { store: "Spudshed", price: 2.29, unitPrice: 19.08, inStock: true },
  ]},
  { id: "mushrooms", name: "Cup Mushrooms 200g", quantity: 1, unit: "punnet", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 20.00, inStock: true },
    { store: "Coles", price: 3.50, unitPrice: 17.50, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 14.95, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 22.50, inStock: true },
    { store: "Spudshed", price: 2.49, unitPrice: 12.45, inStock: true },
  ]},
  { id: "zucchini", name: "Zucchini Each", quantity: 1, unit: "each", prices: [
    { store: "Woolworths", price: 1.50, unitPrice: 1.50, inStock: true },
    { store: "Coles", price: 1.30, unitPrice: 1.30, inStock: true },
    { store: "ALDI", price: 0.99, unitPrice: 0.99, inStock: true },
    { store: "IGA", price: 1.80, unitPrice: 1.80, inStock: true },
    { store: "Spudshed", price: 0.69, unitPrice: 0.69, inStock: true },
  ]},
  { id: "sweet-potato", name: "Sweet Potato 1kg", quantity: 1, unit: "kg", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "Coles", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 3.49, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 5.00, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 2.99, inStock: true },
  ]},
  { id: "corn-cob", name: "Corn on the Cob 2pk", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 3.00, unitPrice: 1.50, inStock: true },
    { store: "Coles", price: 2.80, unitPrice: 1.40, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 1.25, inStock: true },
    { store: "IGA", price: 3.50, unitPrice: 1.75, inStock: true },
    { store: "Spudshed", price: 1.99, unitPrice: 1.00, inStock: true },
  ]},

  // === PANTRY STAPLES ===
  { id: "rice-jasmine-1kg", name: "Jasmine Rice 1kg", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 3.80, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 2.99, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "Spudshed", price: 3.29, unitPrice: 3.29, inStock: true },
    { store: "Costco Perth", price: 18.99, unitPrice: 1.90, inStock: true },
  ]},
  { id: "pasta-spaghetti", name: "Spaghetti 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 2.00, unitPrice: 4.00, inStock: true },
    { store: "Coles", price: 1.80, unitPrice: 3.60, inStock: true },
    { store: "ALDI", price: 0.99, unitPrice: 1.98, inStock: true },
    { store: "IGA", price: 2.50, unitPrice: 5.00, inStock: true },
    { store: "Spudshed", price: 1.49, unitPrice: 2.98, inStock: true },
  ]},
  { id: "pasta-penne", name: "Penne Pasta 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 2.00, unitPrice: 4.00, inStock: true },
    { store: "Coles", price: 1.80, unitPrice: 3.60, inStock: true },
    { store: "ALDI", price: 0.99, unitPrice: 1.98, inStock: true },
    { store: "IGA", price: 2.50, unitPrice: 5.00, inStock: true },
    { store: "Spudshed", price: 1.49, unitPrice: 2.98, inStock: true },
  ]},
  { id: "tomatoes-canned", name: "Canned Tomatoes 400g", quantity: 1, unit: "can", prices: [
    { store: "Woolworths", price: 1.50, unitPrice: 3.75, inStock: true },
    { store: "Coles", price: 1.30, unitPrice: 3.25, inStock: true },
    { store: "ALDI", price: 0.69, unitPrice: 1.73, inStock: true },
    { store: "IGA", price: 1.80, unitPrice: 4.50, inStock: true },
    { store: "Spudshed", price: 0.99, unitPrice: 2.48, inStock: true },
  ]},
  { id: "olive-oil-500ml", name: "Extra Virgin Olive Oil 500ml", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 16.00, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 15.00, inStock: true },
    { store: "ALDI", price: 5.99, unitPrice: 11.98, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 18.00, inStock: true },
    { store: "Spudshed", price: 6.49, unitPrice: 12.98, inStock: true },
    { store: "Costco Perth", price: 16.99, unitPrice: 8.50, inStock: true },
  ]},
  { id: "cooking-oil-1l", name: "Vegetable Oil 1L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 3.80, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 2.99, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "Spudshed", price: 3.29, unitPrice: 3.29, inStock: true },
  ]},
  { id: "sugar-1kg", name: "White Sugar 1kg", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 2.50, unitPrice: 2.50, inStock: true },
    { store: "Coles", price: 2.30, unitPrice: 2.30, inStock: true },
    { store: "ALDI", price: 1.69, unitPrice: 1.69, inStock: true },
    { store: "IGA", price: 2.80, unitPrice: 2.80, inStock: true },
    { store: "Spudshed", price: 1.99, unitPrice: 1.99, inStock: true },
  ]},
  { id: "flour-plain-1kg", name: "Plain Flour 1kg", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 2.00, unitPrice: 2.00, inStock: true },
    { store: "Coles", price: 1.80, unitPrice: 1.80, inStock: true },
    { store: "ALDI", price: 1.29, unitPrice: 1.29, inStock: true },
    { store: "IGA", price: 2.50, unitPrice: 2.50, inStock: true },
    { store: "Spudshed", price: 1.49, unitPrice: 1.49, inStock: true },
  ]},
  { id: "cereal-weetbix", name: "Weet-Bix 575g", quantity: 1, unit: "box", prices: [
    { store: "Woolworths", price: 5.00, unitPrice: 8.70, inStock: true },
    { store: "Coles", price: 4.80, unitPrice: 8.35, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 5.20, inStock: true },
    { store: "IGA", price: 5.50, unitPrice: 9.57, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 7.81, inStock: true },
  ]},
  { id: "cereal-cornflakes", name: "Corn Flakes 500g", quantity: 1, unit: "box", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 11.00, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 10.00, inStock: true, special: "Half price" },
    { store: "ALDI", price: 2.49, unitPrice: 4.98, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 12.00, inStock: true },
    { store: "Spudshed", price: 4.29, unitPrice: 8.58, inStock: true },
  ]},
  { id: "peanut-butter", name: "Peanut Butter 375g", quantity: 1, unit: "jar", prices: [
    { store: "Woolworths", price: 5.00, unitPrice: 13.33, inStock: true },
    { store: "Coles", price: 4.50, unitPrice: 12.00, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 9.31, inStock: true },
    { store: "IGA", price: 5.50, unitPrice: 14.67, inStock: true },
    { store: "Spudshed", price: 3.99, unitPrice: 10.64, inStock: true },
  ]},
  { id: "vegemite", name: "Vegemite 380g", quantity: 1, unit: "jar", prices: [
    { store: "Woolworths", price: 7.50, unitPrice: 19.74, inStock: true },
    { store: "Coles", price: 7.00, unitPrice: 18.42, inStock: true },
    { store: "ALDI", price: 4.49, unitPrice: 11.82, inStock: true },
    { store: "IGA", price: 8.00, unitPrice: 21.05, inStock: true },
    { store: "Spudshed", price: 6.49, unitPrice: 17.08, inStock: true },
  ]},
  { id: "honey-500g", name: "Honey 500g", quantity: 1, unit: "jar", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 16.00, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 15.00, inStock: true },
    { store: "ALDI", price: 5.99, unitPrice: 11.98, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 18.00, inStock: true },
    { store: "Spudshed", price: 5.49, unitPrice: 10.98, inStock: true, special: "WA honey" },
  ]},
  { id: "jam-strawberry", name: "Strawberry Jam 500g", quantity: 1, unit: "jar", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 8.00, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 7.60, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 4.98, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 9.00, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 5.98, inStock: true },
  ]},
  { id: "coffee-instant", name: "Instant Coffee 200g", quantity: 1, unit: "jar", prices: [
    { store: "Woolworths", price: 9.00, unitPrice: 45.00, inStock: true },
    { store: "Coles", price: 8.50, unitPrice: 42.50, inStock: true },
    { store: "ALDI", price: 5.99, unitPrice: 29.95, inStock: true },
    { store: "IGA", price: 10.00, unitPrice: 50.00, inStock: true },
    { store: "Spudshed", price: 7.49, unitPrice: 37.45, inStock: true },
  ]},
  { id: "tea-bags-100", name: "Tea Bags 100pk", quantity: 1, unit: "box", prices: [
    { store: "Woolworths", price: 5.00, unitPrice: 0.05, inStock: true },
    { store: "Coles", price: 4.50, unitPrice: 0.05, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 0.03, inStock: true },
    { store: "IGA", price: 5.50, unitPrice: 0.06, inStock: true },
    { store: "Spudshed", price: 3.99, unitPrice: 0.04, inStock: true },
  ]},

  // === BEVERAGES ===
  { id: "coca-cola-2l", name: "Coca-Cola 2L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 3.85, unitPrice: 1.93, inStock: true },
    { store: "Coles", price: 3.50, unitPrice: 1.75, inStock: true, special: "Weekly deal" },
    { store: "ALDI", price: 1.99, unitPrice: 1.00, inStock: true },
    { store: "IGA", price: 4.20, unitPrice: 2.10, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 1.50, inStock: true },
  ]},
  { id: "juice-orange-2l", name: "Orange Juice 2L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 2.75, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 2.50, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 1.75, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 3.00, inStock: true },
    { store: "Spudshed", price: 3.99, unitPrice: 2.00, inStock: true },
  ]},
  { id: "water-spring-24pk", name: "Spring Water 24x600ml", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 0.33, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 0.31, inStock: true },
    { store: "ALDI", price: 4.99, unitPrice: 0.21, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 0.38, inStock: true },
    { store: "Costco Perth", price: 5.99, unitPrice: 0.25, inStock: true },
  ]},

  // === FROZEN FOODS ===
  { id: "ice-cream-2l", name: "Vanilla Ice Cream 2L", quantity: 1, unit: "tub", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 4.00, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 3.75, inStock: true },
    { store: "ALDI", price: 4.99, unitPrice: 2.50, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 4.50, inStock: true },
    { store: "Spudshed", price: 5.49, unitPrice: 2.75, inStock: true },
  ]},
  { id: "frozen-peas-1kg", name: "Frozen Peas 1kg", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 3.50, inStock: true },
    { store: "Coles", price: 3.20, unitPrice: 3.20, inStock: true },
    { store: "ALDI", price: 1.99, unitPrice: 1.99, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "Spudshed", price: 2.49, unitPrice: 2.49, inStock: true },
  ]},
  { id: "frozen-chips-1kg", name: "Frozen Chips 1kg", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "Coles", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 2.99, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 5.00, inStock: true },
    { store: "Spudshed", price: 3.49, unitPrice: 3.49, inStock: true },
  ]},
  { id: "frozen-pizza", name: "Frozen Pizza 400g", quantity: 1, unit: "pizza", prices: [
    { store: "Woolworths", price: 6.00, unitPrice: 15.00, inStock: true },
    { store: "Coles", price: 5.50, unitPrice: 13.75, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 9.98, inStock: true },
    { store: "IGA", price: 7.00, unitPrice: 17.50, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 11.23, inStock: true },
  ]},

  // === SNACKS & CONFECTIONERY ===
  { id: "chips-175g", name: "Potato Chips 175g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 25.71, inStock: true },
    { store: "Coles", price: 4.00, unitPrice: 22.86, inStock: true, special: "2 for $6" },
    { store: "ALDI", price: 2.49, unitPrice: 14.23, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 28.57, inStock: true },
    { store: "Spudshed", price: 3.29, unitPrice: 18.80, inStock: true },
  ]},
  { id: "chocolate-block", name: "Cadbury Dairy Milk 180g", quantity: 1, unit: "block", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 30.56, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 27.78, inStock: true, special: "Half price" },
    { store: "ALDI", price: 3.49, unitPrice: 19.39, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 33.33, inStock: true },
    { store: "Spudshed", price: 4.29, unitPrice: 23.83, inStock: true },
  ]},
  { id: "tim-tams", name: "Tim Tams 200g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 4.65, unitPrice: 23.25, inStock: true },
    { store: "Coles", price: 4.40, unitPrice: 22.00, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 14.95, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 25.00, inStock: true },
    { store: "Spudshed", price: 3.99, unitPrice: 19.95, inStock: true },
  ]},
  { id: "nuts-mixed", name: "Mixed Nuts 400g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 10.00, unitPrice: 25.00, inStock: true },
    { store: "Coles", price: 9.50, unitPrice: 23.75, inStock: true },
    { store: "ALDI", price: 6.99, unitPrice: 17.48, inStock: true },
    { store: "IGA", price: 11.00, unitPrice: 27.50, inStock: true },
    { store: "Costco Perth", price: 18.99, unitPrice: 12.66, inStock: true },
  ]},

  // === HOUSEHOLD & CLEANING ===
  { id: "toilet-paper-12", name: "Toilet Paper 12 Pack", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 0.67, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 0.63, inStock: true },
    { store: "ALDI", price: 4.99, unitPrice: 0.42, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 0.75, inStock: true },
    { store: "Costco Perth", price: 29.99, unitPrice: 0.31, inStock: true },
  ]},
  { id: "paper-towels-6", name: "Paper Towels 6 Pack", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 6.00, unitPrice: 1.00, inStock: true },
    { store: "Coles", price: 5.50, unitPrice: 0.92, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 0.67, inStock: true },
    { store: "IGA", price: 7.00, unitPrice: 1.17, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 0.75, inStock: true },
  ]},
  { id: "dishwashing-liquid", name: "Dishwashing Liquid 500ml", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 8.00, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 7.60, inStock: true },
    { store: "ALDI", price: 1.99, unitPrice: 3.98, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 9.00, inStock: true },
    { store: "Spudshed", price: 2.49, unitPrice: 4.98, inStock: true },
  ]},
  { id: "laundry-powder-2kg", name: "Laundry Powder 2kg", quantity: 1, unit: "box", prices: [
    { store: "Woolworths", price: 12.00, unitPrice: 6.00, inStock: true },
    { store: "Coles", price: 11.00, unitPrice: 5.50, inStock: true },
    { store: "ALDI", price: 6.99, unitPrice: 3.50, inStock: true },
    { store: "IGA", price: 13.00, unitPrice: 6.50, inStock: true },
    { store: "Costco Perth", price: 24.99, unitPrice: 3.13, inStock: true },
  ]},
  { id: "all-purpose-cleaner", name: "All Purpose Cleaner 750ml", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 6.00, inStock: true },
    { store: "Coles", price: 4.00, unitPrice: 5.33, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 3.32, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 6.67, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 3.99, inStock: true },
  ]},
  { id: "garbage-bags-20", name: "Garbage Bags 20pk", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 0.28, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 0.25, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 0.17, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 0.30, inStock: true },
    { store: "Spudshed", price: 3.99, unitPrice: 0.20, inStock: true },
  ]},

  // === BABY & PET ===
  { id: "baby-wipes-80", name: "Baby Wipes 80pk", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 0.05, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 0.05, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 0.03, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 0.06, inStock: true },
    { store: "Costco Perth", price: 22.99, unitPrice: 0.02, inStock: true },
  ]},
  { id: "nappies-48", name: "Nappies 48pk", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 22.00, unitPrice: 0.46, inStock: true },
    { store: "Coles", price: 21.00, unitPrice: 0.44, inStock: true },
    { store: "ALDI", price: 13.99, unitPrice: 0.29, inStock: true },
    { store: "IGA", price: 24.00, unitPrice: 0.50, inStock: true },
    { store: "Costco Perth", price: 49.99, unitPrice: 0.26, inStock: true },
  ]},
  { id: "dog-food-3kg", name: "Dry Dog Food 3kg", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 12.00, unitPrice: 4.00, inStock: true },
    { store: "Coles", price: 11.50, unitPrice: 3.83, inStock: true },
    { store: "ALDI", price: 7.99, unitPrice: 2.66, inStock: true },
    { store: "IGA", price: 13.00, unitPrice: 4.33, inStock: true },
    { store: "Costco Perth", price: 44.99, unitPrice: 2.25, inStock: true },
  ]},
  { id: "cat-food-tins", name: "Cat Food Tins 12pk", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 14.00, unitPrice: 1.17, inStock: true },
    { store: "Coles", price: 13.00, unitPrice: 1.08, inStock: true },
    { store: "ALDI", price: 8.99, unitPrice: 0.75, inStock: true },
    { store: "IGA", price: 15.00, unitPrice: 1.25, inStock: true },
    { store: "Costco Perth", price: 24.99, unitPrice: 0.52, inStock: true },
  ]},

  // === PERSONAL CARE ===
  { id: "shampoo-400ml", name: "Shampoo 400ml", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 7.00, unitPrice: 17.50, inStock: true },
    { store: "Coles", price: 6.50, unitPrice: 16.25, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 9.98, inStock: true },
    { store: "IGA", price: 8.00, unitPrice: 20.00, inStock: true },
    { store: "Spudshed", price: 4.99, unitPrice: 12.48, inStock: true },
  ]},
  { id: "toothpaste", name: "Toothpaste 140g", quantity: 1, unit: "tube", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 39.29, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 35.71, inStock: true, special: "Half price" },
    { store: "ALDI", price: 2.49, unitPrice: 17.79, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 42.86, inStock: true },
    { store: "Spudshed", price: 3.49, unitPrice: 24.93, inStock: true },
  ]},
  { id: "deodorant", name: "Deodorant 150ml", quantity: 1, unit: "can", prices: [
    { store: "Woolworths", price: 6.00, unitPrice: 40.00, inStock: true },
    { store: "Coles", price: 5.50, unitPrice: 36.67, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 19.93, inStock: true },
    { store: "IGA", price: 7.00, unitPrice: 46.67, inStock: true },
    { store: "Spudshed", price: 3.99, unitPrice: 26.60, inStock: true },
  ]},
  { id: "soap-bars-4", name: "Soap Bars 4pk", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 1.00, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 0.95, inStock: true },
    { store: "ALDI", price: 1.99, unitPrice: 0.50, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 1.13, inStock: true },
    { store: "Spudshed", price: 2.49, unitPrice: 0.62, inStock: true },
  ]},

  // === EXPANDED DAIRY PRODUCTS ===
  { id: "milk-lite-2l", name: "Lite Milk 2L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 3.60, unitPrice: 1.80, inStock: true },
    { store: "Coles", price: 3.50, unitPrice: 1.75, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 1.50, inStock: true },
    { store: "IGA", price: 3.90, unitPrice: 1.95, inStock: true },
    { store: "Spudshed", price: 3.09, unitPrice: 1.55, inStock: true },
  ]},
  { id: "milk-a2-2l", name: "A2 Milk 2L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 5.00, unitPrice: 2.50, inStock: true },
    { store: "Coles", price: 4.80, unitPrice: 2.40, inStock: true },
    { store: "ALDI", price: 4.29, unitPrice: 2.15, inStock: true },
    { store: "IGA", price: 5.50, unitPrice: 2.75, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 2.25, inStock: true },
  ]},
  { id: "lactose-free-milk", name: "Lactose Free Milk 2L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 2.25, inStock: true },
    { store: "Coles", price: 4.30, unitPrice: 2.15, inStock: true },
    { store: "ALDI", price: 3.79, unitPrice: 1.90, inStock: true },
    { store: "IGA", price: 4.80, unitPrice: 2.40, inStock: true },
    { store: "Spudshed", price: 3.99, unitPrice: 2.00, inStock: true },
  ]},
  { id: "almond-milk-1l", name: "Almond Milk 1L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 3.80, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 2.99, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "Spudshed", price: 3.29, unitPrice: 3.29, inStock: true },
  ]},
  { id: "oat-milk-1l", name: "Oat Milk 1L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 4.20, unitPrice: 4.20, inStock: true },
    { store: "Coles", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "ALDI", price: 3.19, unitPrice: 3.19, inStock: true },
    { store: "IGA", price: 4.70, unitPrice: 4.70, inStock: true },
    { store: "Spudshed", price: 3.49, unitPrice: 3.49, inStock: true },
  ]},
  { id: "soy-milk-1l", name: "Soy Milk 1L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 3.50, inStock: true },
    { store: "Coles", price: 3.30, unitPrice: 3.30, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 2.49, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 2.99, inStock: true },
  ]},
  { id: "eggs-16", name: "Free Range Eggs 16pk", quantity: 1, unit: "carton", prices: [
    { store: "Woolworths", price: 9.50, unitPrice: 0.59, inStock: true },
    { store: "Coles", price: 9.00, unitPrice: 0.56, inStock: true },
    { store: "ALDI", price: 7.99, unitPrice: 0.50, inStock: true },
    { store: "IGA", price: 10.50, unitPrice: 0.66, inStock: true },
    { store: "Costco Perth", price: 15.99, unitPrice: 0.40, inStock: true },
  ]},
  { id: "cottage-cheese-500g", name: "Cottage Cheese 500g", quantity: 1, unit: "tub", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 11.00, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 10.00, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 7.98, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 12.00, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 8.98, inStock: true },
  ]},
  { id: "ricotta-500g", name: "Ricotta 500g", quantity: 1, unit: "tub", prices: [
    { store: "Woolworths", price: 6.00, unitPrice: 12.00, inStock: true },
    { store: "Coles", price: 5.50, unitPrice: 11.00, inStock: true },
    { store: "ALDI", price: 4.49, unitPrice: 8.98, inStock: true },
    { store: "IGA", price: 6.50, unitPrice: 13.00, inStock: true },
    { store: "Spudshed", price: 4.99, unitPrice: 9.98, inStock: true },
  ]},

  // === EXPANDED MEAT PRODUCTS ===
  { id: "chicken-wings-1kg", name: "Chicken Wings 1kg", quantity: 1, unit: "kg", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 8.00, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 7.50, inStock: true },
    { store: "ALDI", price: 5.99, unitPrice: 5.99, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 9.00, inStock: true },
    { store: "Spudshed", price: 5.49, unitPrice: 5.49, inStock: true },
  ]},
  { id: "beef-mince-1kg", name: "Beef Mince 1kg", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 15.00, unitPrice: 15.00, inStock: true },
    { store: "Coles", price: 14.00, unitPrice: 14.00, inStock: true },
    { store: "ALDI", price: 11.99, unitPrice: 11.99, inStock: true },
    { store: "IGA", price: 17.00, unitPrice: 17.00, inStock: true },
    { store: "Costco Perth", price: 9.99, unitPrice: 9.99, inStock: true },
  ]},
  { id: "pork-mince", name: "Pork Mince 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 7.50, unitPrice: 15.00, inStock: true },
    { store: "Coles", price: 7.00, unitPrice: 14.00, inStock: true },
    { store: "ALDI", price: 5.49, unitPrice: 10.98, inStock: true },
    { store: "IGA", price: 8.50, unitPrice: 17.00, inStock: true },
    { store: "Spudshed", price: 4.99, unitPrice: 9.98, inStock: true },
  ]},
  { id: "lamb-mince", name: "Lamb Mince 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 10.00, unitPrice: 20.00, inStock: true },
    { store: "Coles", price: 9.50, unitPrice: 19.00, inStock: true },
    { store: "ALDI", price: 7.99, unitPrice: 15.98, inStock: true },
    { store: "IGA", price: 11.00, unitPrice: 22.00, inStock: true },
    { store: "Spudshed", price: 7.49, unitPrice: 14.98, inStock: true },
  ]},
  { id: "turkey-mince", name: "Turkey Mince 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 9.00, unitPrice: 18.00, inStock: true },
    { store: "Coles", price: 8.50, unitPrice: 17.00, inStock: true },
    { store: "ALDI", price: 6.99, unitPrice: 13.98, inStock: true },
    { store: "IGA", price: 10.00, unitPrice: 20.00, inStock: true },
    { store: "Spudshed", price: 6.49, unitPrice: 12.98, inStock: true },
  ]},
  { id: "deli-ham-500g", name: "Deli Ham 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 16.00, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 15.00, inStock: true },
    { store: "ALDI", price: 5.99, unitPrice: 11.98, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 18.00, inStock: true },
    { store: "Spudshed", price: 5.49, unitPrice: 10.98, inStock: true },
  ]},
  { id: "turkey-breast", name: "Turkey Breast Sliced 200g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 6.50, unitPrice: 32.50, inStock: true },
    { store: "Coles", price: 6.00, unitPrice: 30.00, inStock: true },
    { store: "ALDI", price: 4.99, unitPrice: 24.95, inStock: true },
    { store: "IGA", price: 7.50, unitPrice: 37.50, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 22.45, inStock: true },
  ]},

  // === EXPANDED VEGETABLES ===
  { id: "cabbage-green", name: "Green Cabbage Each", quantity: 1, unit: "each", prices: [
    { store: "Woolworths", price: 2.50, unitPrice: 2.50, inStock: true },
    { store: "Coles", price: 2.30, unitPrice: 2.30, inStock: true },
    { store: "ALDI", price: 1.99, unitPrice: 1.99, inStock: true },
    { store: "IGA", price: 3.00, unitPrice: 3.00, inStock: true },
    { store: "Spudshed", price: 1.49, unitPrice: 1.49, inStock: true },
  ]},
  { id: "red-cabbage", name: "Red Cabbage Each", quantity: 1, unit: "each", prices: [
    { store: "Woolworths", price: 3.00, unitPrice: 3.00, inStock: true },
    { store: "Coles", price: 2.80, unitPrice: 2.80, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 2.49, inStock: true },
    { store: "IGA", price: 3.50, unitPrice: 3.50, inStock: true },
    { store: "Spudshed", price: 1.99, unitPrice: 1.99, inStock: true },
  ]},
  { id: "green-beans-500g", name: "Green Beans 500g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 9.00, inStock: true },
    { store: "Coles", price: 4.00, unitPrice: 8.00, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 6.98, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 10.00, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 5.98, inStock: true },
  ]},
  { id: "peas-frozen-500g", name: "Frozen Peas 500g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 7.00, inStock: true },
    { store: "Coles", price: 3.20, unitPrice: 6.40, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 4.98, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 8.00, inStock: true },
    { store: "Spudshed", price: 2.29, unitPrice: 4.58, inStock: true },
  ]},
  { id: "corn-frozen-500g", name: "Frozen Corn 500g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 7.00, inStock: true },
    { store: "Coles", price: 3.20, unitPrice: 6.40, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 4.98, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 8.00, inStock: true },
    { store: "Spudshed", price: 2.29, unitPrice: 4.58, inStock: true },
  ]},
  { id: "mixed-veg-frozen", name: "Frozen Mixed Vegetables 500g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 3.80, unitPrice: 7.60, inStock: true },
    { store: "Coles", price: 3.50, unitPrice: 7.00, inStock: true },
    { store: "ALDI", price: 2.69, unitPrice: 5.38, inStock: true },
    { store: "IGA", price: 4.30, unitPrice: 8.60, inStock: true },
    { store: "Spudshed", price: 2.49, unitPrice: 4.98, inStock: true },
  ]},
  { id: "eggplant", name: "Eggplant Each", quantity: 1, unit: "each", prices: [
    { store: "Woolworths", price: 2.00, unitPrice: 2.00, inStock: true },
    { store: "Coles", price: 1.80, unitPrice: 1.80, inStock: true },
    { store: "ALDI", price: 1.49, unitPrice: 1.49, inStock: true },
    { store: "IGA", price: 2.50, unitPrice: 2.50, inStock: true },
    { store: "Spudshed", price: 0.99, unitPrice: 0.99, inStock: true },
  ]},

  // === EXPANDED FRUITS ===
  { id: "mango-each", name: "Mango Each", quantity: 1, unit: "each", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 3.50, inStock: true },
    { store: "Coles", price: 3.20, unitPrice: 3.20, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 2.49, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "Spudshed", price: 1.99, unitPrice: 1.99, inStock: true },
  ]},
  { id: "pineapple-each", name: "Pineapple Each", quantity: 1, unit: "each", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 5.50, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 5.00, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 3.99, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 6.00, inStock: true },
    { store: "Spudshed", price: 3.49, unitPrice: 3.49, inStock: true },
  ]},
  { id: "watermelon", name: "Watermelon Half", quantity: 1, unit: "each", prices: [
    { store: "Woolworths", price: 7.00, unitPrice: 7.00, inStock: true },
    { store: "Coles", price: 6.50, unitPrice: 6.50, inStock: true },
    { store: "ALDI", price: 4.99, unitPrice: 4.99, inStock: true },
    { store: "IGA", price: 8.00, unitPrice: 8.00, inStock: true },
    { store: "Spudshed", price: 3.99, unitPrice: 3.99, inStock: true },
  ]},
  { id: "rockmelon", name: "Rockmelon Each", quantity: 1, unit: "each", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "Coles", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 2.99, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 5.00, inStock: true },
    { store: "Spudshed", price: 2.49, unitPrice: 2.49, inStock: true },
  ]},
  { id: "kiwifruit-6pk", name: "Kiwifruit 6 Pack", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 0.75, inStock: true },
    { store: "Coles", price: 4.00, unitPrice: 0.67, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 0.50, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 0.83, inStock: true },
    { store: "Spudshed", price: 2.49, unitPrice: 0.42, inStock: true },
  ]},
  { id: "pear-pack", name: "Pears 1kg", quantity: 1, unit: "kg", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "Coles", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 2.99, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 5.00, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 2.99, inStock: true },
  ]},
  { id: "peach-pack", name: "Peaches 1kg", quantity: 1, unit: "kg", prices: [
    { store: "Woolworths", price: 5.00, unitPrice: 5.00, inStock: true },
    { store: "Coles", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 3.49, inStock: true },
    { store: "IGA", price: 5.50, unitPrice: 5.50, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 2.99, inStock: true },
  ]},
  { id: "raspberry-punnet", name: "Raspberries 150g", quantity: 1, unit: "punnet", prices: [
    { store: "Woolworths", price: 6.00, unitPrice: 40.00, inStock: true },
    { store: "Coles", price: 5.50, unitPrice: 36.67, inStock: true },
    { store: "ALDI", price: 4.49, unitPrice: 29.93, inStock: true },
    { store: "IGA", price: 6.50, unitPrice: 43.33, inStock: true },
    { store: "Spudshed", price: 3.49, unitPrice: 23.27, inStock: true },
  ]},

  // === EXPANDED BEVERAGES ===
  { id: "orange-juice-1l", name: "Orange Juice 1L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 3.80, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 2.99, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "Spudshed", price: 3.29, unitPrice: 3.29, inStock: true },
  ]},
  { id: "apple-juice-1l", name: "Apple Juice 1L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 4.00, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 3.80, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 2.99, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "Spudshed", price: 3.29, unitPrice: 3.29, inStock: true },
  ]},
  { id: "cranberry-juice-1l", name: "Cranberry Juice 1L", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 4.50, inStock: true },
    { store: "Coles", price: 4.20, unitPrice: 4.20, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 3.49, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 5.00, inStock: true },
    { store: "Spudshed", price: 3.79, unitPrice: 3.79, inStock: true },
  ]},
  { id: "coffee-beans-1kg", name: "Coffee Beans 1kg", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 18.00, unitPrice: 18.00, inStock: true },
    { store: "Coles", price: 17.00, unitPrice: 17.00, inStock: true },
    { store: "ALDI", price: 12.99, unitPrice: 12.99, inStock: true },
    { store: "IGA", price: 20.00, unitPrice: 20.00, inStock: true },
    { store: "Costco Perth", price: 34.99, unitPrice: 8.75, inStock: true },
  ]},
  { id: "instant-coffee-200g", name: "Instant Coffee 200g", quantity: 1, unit: "jar", prices: [
    { store: "Woolworths", price: 12.00, unitPrice: 60.00, inStock: true },
    { store: "Coles", price: 11.00, unitPrice: 55.00, inStock: true },
    { store: "ALDI", price: 8.99, unitPrice: 44.95, inStock: true },
    { store: "IGA", price: 13.00, unitPrice: 65.00, inStock: true },
    { store: "Spudshed", price: 9.99, unitPrice: 49.95, inStock: true },
  ]},
  { id: "black-tea-50pk", name: "Black Tea Bags 50pk", quantity: 1, unit: "box", prices: [
    { store: "Woolworths", price: 5.00, unitPrice: 0.10, inStock: true },
    { store: "Coles", price: 4.80, unitPrice: 0.10, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 0.07, inStock: true },
    { store: "IGA", price: 5.50, unitPrice: 0.11, inStock: true },
    { store: "Spudshed", price: 3.99, unitPrice: 0.08, inStock: true },
  ]},
  { id: "green-tea-25pk", name: "Green Tea Bags 25pk", quantity: 1, unit: "box", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 0.22, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 0.20, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 0.16, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 0.24, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 0.18, inStock: true },
  ]},

  // === EXPANDED FROZEN & SNACKS ===
  { id: "pizza-frozen", name: "Frozen Pizza 400g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 7.00, unitPrice: 17.50, inStock: true },
    { store: "Coles", price: 6.50, unitPrice: 16.25, inStock: true },
    { store: "ALDI", price: 4.99, unitPrice: 12.48, inStock: true },
    { store: "IGA", price: 8.00, unitPrice: 20.00, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 11.23, inStock: true },
  ]},
  { id: "chips-flavoured-175g", name: "Flavoured Chips 175g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 20.00, inStock: true },
    { store: "Coles", price: 3.30, unitPrice: 18.86, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 14.23, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 22.86, inStock: true },
    { store: "Spudshed", price: 2.29, unitPrice: 13.09, inStock: true },
  ]},
  { id: "biscuits-arnotts", name: "Arnotts Biscuits 200g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 20.00, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 19.00, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 14.95, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 22.50, inStock: true },
    { store: "Spudshed", price: 3.29, unitPrice: 16.45, inStock: true },
  ]},
  { id: "mixed-nuts-250g", name: "Mixed Nuts 250g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 32.00, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 30.00, inStock: true },
    { store: "ALDI", price: 5.99, unitPrice: 23.96, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 36.00, inStock: true },
    { store: "Costco Perth", price: 12.99, unitPrice: 10.39, inStock: true },
  ]},
  { id: "dark-chocolate-200g", name: "Dark Chocolate 200g", quantity: 1, unit: "bar", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 27.50, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 25.00, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 19.95, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 30.00, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 22.45, inStock: true },
  ]},
  { id: "granola-bar-box", name: "Granola Bars 5pk", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 6.00, unitPrice: 1.20, inStock: true },
    { store: "Coles", price: 5.50, unitPrice: 1.10, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 0.80, inStock: true },
    { store: "IGA", price: 6.50, unitPrice: 1.30, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 0.90, inStock: true },
  ]},

  // === CONDIMENTS & SAUCES ===
  { id: "tomato-sauce-500g", name: "Tomato Sauce 500g", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 2.50, unitPrice: 5.00, inStock: true },
    { store: "Coles", price: 2.30, unitPrice: 4.60, inStock: true },
    { store: "ALDI", price: 1.49, unitPrice: 2.98, inStock: true },
    { store: "IGA", price: 2.80, unitPrice: 5.60, inStock: true },
    { store: "Spudshed", price: 1.79, unitPrice: 3.58, inStock: true },
  ]},
  { id: "soy-sauce-375ml", name: "Soy Sauce 375ml", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 10.67, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 10.13, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 6.64, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 12.00, inStock: true },
    { store: "Spudshed", price: 3.29, unitPrice: 8.77, inStock: true },
  ]},
  { id: "worcester-sauce-300ml", name: "Worcestershire Sauce 300ml", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 15.00, inStock: true },
    { store: "Coles", price: 4.20, unitPrice: 14.00, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 9.97, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 16.67, inStock: true },
    { store: "Spudshed", price: 3.49, unitPrice: 11.63, inStock: true },
  ]},
  { id: "mayo-500g", name: "Mayonnaise 500g", quantity: 1, unit: "jar", prices: [
    { store: "Woolworths", price: 5.00, unitPrice: 10.00, inStock: true },
    { store: "Coles", price: 4.80, unitPrice: 9.60, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 6.98, inStock: true },
    { store: "IGA", price: 5.50, unitPrice: 11.00, inStock: true },
    { store: "Spudshed", price: 3.99, unitPrice: 7.98, inStock: true },
  ]},
  { id: "peanut-butter-500g", name: "Peanut Butter 500g", quantity: 1, unit: "jar", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 11.00, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 10.00, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 7.98, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 12.00, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 8.98, inStock: true },
  ]},
  { id: "vegemite-400g", name: "Vegemite 400g", quantity: 1, unit: "jar", prices: [
    { store: "Woolworths", price: 6.00, unitPrice: 15.00, inStock: true },
    { store: "Coles", price: 5.80, unitPrice: 14.50, inStock: true },
    { store: "ALDI", price: 4.99, unitPrice: 12.48, inStock: true },
    { store: "IGA", price: 6.50, unitPrice: 16.25, inStock: true },
    { store: "Costco Perth", price: 14.99, unitPrice: 7.50, inStock: true },
  ]},

  // === HEALTH & ORGANIC ===
  { id: "quinoa-500g", name: "Quinoa 500g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 16.00, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 15.00, inStock: true },
    { store: "ALDI", price: 5.99, unitPrice: 11.98, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 18.00, inStock: true },
    { store: "Spudshed", price: 6.49, unitPrice: 12.98, inStock: true },
  ]},
  { id: "chia-seeds-250g", name: "Chia Seeds 250g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 10.00, unitPrice: 40.00, inStock: true },
    { store: "Coles", price: 9.50, unitPrice: 38.00, inStock: true },
    { store: "ALDI", price: 7.99, unitPrice: 31.96, inStock: true },
    { store: "IGA", price: 11.00, unitPrice: 44.00, inStock: true },
    { store: "Spudshed", price: 8.99, unitPrice: 35.96, inStock: true },
  ]},
  { id: "flaxseed-500g", name: "Flaxseed 500g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 6.50, unitPrice: 13.00, inStock: true },
    { store: "Coles", price: 6.00, unitPrice: 12.00, inStock: true },
    { store: "ALDI", price: 4.49, unitPrice: 8.98, inStock: true },
    { store: "IGA", price: 7.00, unitPrice: 14.00, inStock: true },
    { store: "Spudshed", price: 5.49, unitPrice: 10.98, inStock: true },
  ]},
  { id: "protein-powder", name: "Protein Powder 500g", quantity: 1, unit: "tub", prices: [
    { store: "Woolworths", price: 25.00, unitPrice: 50.00, inStock: true },
    { store: "Coles", price: 24.00, unitPrice: 48.00, inStock: true },
    { store: "ALDI", price: 18.99, unitPrice: 37.98, inStock: true },
    { store: "IGA", price: 27.00, unitPrice: 54.00, inStock: true },
    { store: "Costco Perth", price: 44.99, unitPrice: 22.50, inStock: true },
  ]},

  // === PASTA & NOODLES ===
  { id: "instant-noodles-pack", name: "Instant Noodles 6pk", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 4.00, unitPrice: 0.67, inStock: true },
    { store: "Coles", price: 3.80, unitPrice: 0.63, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 0.42, inStock: true },
    { store: "IGA", price: 4.50, unitPrice: 0.75, inStock: true },
    { store: "Spudshed", price: 2.29, unitPrice: 0.38, inStock: true },
  ]},
  { id: "linguine-500g", name: "Linguine Pasta 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 2.00, unitPrice: 4.00, inStock: true },
    { store: "Coles", price: 1.80, unitPrice: 3.60, inStock: true },
    { store: "ALDI", price: 0.99, unitPrice: 1.98, inStock: true },
    { store: "IGA", price: 2.50, unitPrice: 5.00, inStock: true },
    { store: "Spudshed", price: 1.49, unitPrice: 2.98, inStock: true },
  ]},
  { id: "fettuccine-500g", name: "Fettuccine Pasta 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 2.20, unitPrice: 4.40, inStock: true },
    { store: "Coles", price: 2.00, unitPrice: 4.00, inStock: true },
    { store: "ALDI", price: 1.19, unitPrice: 2.38, inStock: true },
    { store: "IGA", price: 2.70, unitPrice: 5.40, inStock: true },
    { store: "Spudshed", price: 1.69, unitPrice: 3.38, inStock: true },
  ]},
  { id: "lasagne-500g", name: "Lasagne Pasta 500g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 2.50, unitPrice: 5.00, inStock: true },
    { store: "Coles", price: 2.30, unitPrice: 4.60, inStock: true },
    { store: "ALDI", price: 1.49, unitPrice: 2.98, inStock: true },
    { store: "IGA", price: 3.00, unitPrice: 6.00, inStock: true },
    { store: "Spudshed", price: 1.99, unitPrice: 3.98, inStock: true },
  ]},

  // === TINNED & CANNED GOODS ===
  { id: "beans-canned-400g", name: "Baked Beans 400g", quantity: 1, unit: "can", prices: [
    { store: "Woolworths", price: 1.20, unitPrice: 3.00, inStock: true },
    { store: "Coles", price: 1.10, unitPrice: 2.75, inStock: true },
    { store: "ALDI", price: 0.69, unitPrice: 1.73, inStock: true },
    { store: "IGA", price: 1.50, unitPrice: 3.75, inStock: true },
    { store: "Spudshed", price: 0.89, unitPrice: 2.23, inStock: true },
  ]},
  { id: "chickpeas-canned", name: "Canned Chickpeas 400g", quantity: 1, unit: "can", prices: [
    { store: "Woolworths", price: 1.50, unitPrice: 3.75, inStock: true },
    { store: "Coles", price: 1.30, unitPrice: 3.25, inStock: true },
    { store: "ALDI", price: 0.89, unitPrice: 2.23, inStock: true },
    { store: "IGA", price: 1.80, unitPrice: 4.50, inStock: true },
    { store: "Spudshed", price: 1.09, unitPrice: 2.73, inStock: true },
  ]},
  { id: "lentils-canned", name: "Canned Lentils 400g", quantity: 1, unit: "can", prices: [
    { store: "Woolworths", price: 1.50, unitPrice: 3.75, inStock: true },
    { store: "Coles", price: 1.30, unitPrice: 3.25, inStock: true },
    { store: "ALDI", price: 0.89, unitPrice: 2.23, inStock: true },
    { store: "IGA", price: 1.80, unitPrice: 4.50, inStock: true },
    { store: "Spudshed", price: 1.09, unitPrice: 2.73, inStock: true },
  ]},
  { id: "tuna-canned-185g", name: "Canned Tuna 185g", quantity: 1, unit: "can", prices: [
    { store: "Woolworths", price: 2.50, unitPrice: 13.51, inStock: true },
    { store: "Coles", price: 2.30, unitPrice: 12.43, inStock: true },
    { store: "ALDI", price: 1.49, unitPrice: 8.05, inStock: true },
    { store: "IGA", price: 3.00, unitPrice: 16.22, inStock: true },
    { store: "Costco Perth", price: 26.99, unitPrice: 7.29, inStock: true },
  ]},
  { id: "chickpea-snack", name: "Roasted Chickpeas 100g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 55.00, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 50.00, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 39.90, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 60.00, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 44.90, inStock: true },
  ]},

  // === ADDITIONAL STAPLES ===
  { id: "cornflakes-500g", name: "Cornflakes Cereal 500g", quantity: 1, unit: "box", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 11.00, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 10.00, inStock: true },
    { store: "ALDI", price: 3.99, unitPrice: 7.98, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 12.00, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 8.98, inStock: true },
  ]},
  { id: "granola-500g", name: "Granola 500g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 16.00, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 15.00, inStock: true },
    { store: "ALDI", price: 5.99, unitPrice: 11.98, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 18.00, inStock: true },
    { store: "Spudshed", price: 6.49, unitPrice: 12.98, inStock: true },
  ]},
  { id: "porridge-oats", name: "Porridge Oats 1kg", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 5.00, unitPrice: 5.00, inStock: true },
    { store: "Coles", price: 4.80, unitPrice: 4.80, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 3.49, inStock: true },
    { store: "IGA", price: 5.50, unitPrice: 5.50, inStock: true },
    { store: "Costco Perth", price: 14.99, unitPrice: 3.75, inStock: true },
  ]},
  { id: "honey-500g", name: "Honey 500g", quantity: 1, unit: "jar", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 16.00, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 15.00, inStock: true },
    { store: "ALDI", price: 5.99, unitPrice: 11.98, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 18.00, inStock: true },
    { store: "Spudshed", price: 6.99, unitPrice: 13.98, inStock: true },
  ]},
  { id: "jam-500g", name: "Strawberry Jam 500g", quantity: 1, unit: "jar", prices: [
    { store: "Woolworths", price: 5.50, unitPrice: 11.00, inStock: true },
    { store: "Coles", price: 5.00, unitPrice: 10.00, inStock: true },
    { store: "ALDI", price: 3.49, unitPrice: 6.98, inStock: true },
    { store: "IGA", price: 6.00, unitPrice: 12.00, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 8.98, inStock: true },
  ]},
  { id: "baking-powder-200g", name: "Baking Powder 200g", quantity: 1, unit: "tin", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 17.50, inStock: true },
    { store: "Coles", price: 3.30, unitPrice: 16.50, inStock: true },
    { store: "ALDI", price: 2.29, unitPrice: 11.45, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 20.00, inStock: true },
    { store: "Spudshed", price: 2.79, unitPrice: 13.95, inStock: true },
  ]},
  { id: "yeast-instant", name: "Instant Yeast 7g", quantity: 1, unit: "sachet", prices: [
    { store: "Woolworths", price: 0.95, unitPrice: 135.71, inStock: true },
    { store: "Coles", price: 0.89, unitPrice: 127.14, inStock: true },
    { store: "ALDI", price: 0.69, unitPrice: 98.57, inStock: true },
    { store: "IGA", price: 1.20, unitPrice: 171.43, inStock: true },
    { store: "Spudshed", price: 0.79, unitPrice: 112.86, inStock: true },
  ]},
  { id: "vinegar-white", name: "White Vinegar 500ml", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 2.00, unitPrice: 4.00, inStock: true },
    { store: "Coles", price: 1.80, unitPrice: 3.60, inStock: true },
    { store: "ALDI", price: 1.29, unitPrice: 2.58, inStock: true },
    { store: "IGA", price: 2.50, unitPrice: 5.00, inStock: true },
    { store: "Spudshed", price: 1.49, unitPrice: 2.98, inStock: true },
  ]},

  // === ADDITIONAL FROZEN ITEMS ===
  { id: "vegetable-lasagne", name: "Vegetable Lasagne 400g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 6.50, unitPrice: 16.25, inStock: true },
    { store: "Coles", price: 6.00, unitPrice: 15.00, inStock: true },
    { store: "ALDI", price: 4.49, unitPrice: 11.23, inStock: true },
    { store: "IGA", price: 7.00, unitPrice: 17.50, inStock: true },
    { store: "Spudshed", price: 3.99, unitPrice: 9.98, inStock: true },
  ]},
  { id: "moussaka-frozen", name: "Frozen Moussaka 400g", quantity: 1, unit: "pack", prices: [
    { store: "Woolworths", price: 7.00, unitPrice: 17.50, inStock: true },
    { store: "Coles", price: 6.50, unitPrice: 16.25, inStock: true },
    { store: "ALDI", price: 4.99, unitPrice: 12.48, inStock: true },
    { store: "IGA", price: 7.50, unitPrice: 18.75, inStock: true },
    { store: "Spudshed", price: 4.49, unitPrice: 11.23, inStock: true },
  ]},
  { id: "berries-frozen-500g", name: "Frozen Mixed Berries 500g", quantity: 1, unit: "bag", prices: [
    { store: "Woolworths", price: 8.00, unitPrice: 16.00, inStock: true },
    { store: "Coles", price: 7.50, unitPrice: 15.00, inStock: true },
    { store: "ALDI", price: 5.99, unitPrice: 11.98, inStock: true },
    { store: "IGA", price: 9.00, unitPrice: 18.00, inStock: true },
    { store: "Costco Perth", price: 16.99, unitPrice: 8.50, inStock: true },
  ]},

  // === BEAUTY & WELLNESS ===
  { id: "moisturizer-100ml", name: "Face Moisturizer 100ml", quantity: 1, unit: "tube", prices: [
    { store: "Woolworths", price: 12.00, unitPrice: 120.00, inStock: true },
    { store: "Coles", price: 11.00, unitPrice: 110.00, inStock: true },
    { store: "ALDI", price: 8.99, unitPrice: 89.90, inStock: true },
    { store: "IGA", price: 13.00, unitPrice: 130.00, inStock: true },
    { store: "Spudshed", price: 9.99, unitPrice: 99.90, inStock: true },
  ]},
  { id: "sunscreen-200ml", name: "Sunscreen SPF 50 200ml", quantity: 1, unit: "bottle", prices: [
    { store: "Woolworths", price: 15.00, unitPrice: 75.00, inStock: true },
    { store: "Coles", price: 14.00, unitPrice: 70.00, inStock: true },
    { store: "ALDI", price: 10.99, unitPrice: 54.95, inStock: true },
    { store: "IGA", price: 16.00, unitPrice: 80.00, inStock: true },
    { store: "Spudshed", price: 12.99, unitPrice: 64.95, inStock: true },
  ]},

  // === SPECIALTY ITEMS ===
  { id: "wasabi-tube", name: "Wasabi 43g", quantity: 1, unit: "tube", prices: [
    { store: "Woolworths", price: 3.50, unitPrice: 81.40, inStock: true },
    { store: "Coles", price: 3.30, unitPrice: 76.74, inStock: true },
    { store: "ALDI", price: 2.49, unitPrice: 57.91, inStock: true },
    { store: "IGA", price: 4.00, unitPrice: 93.02, inStock: true },
    { store: "Spudshed", price: 2.99, unitPrice: 69.53, inStock: true },
  ]},
  { id: "ginger-pickled", name: "Pickled Ginger 100g", quantity: 1, unit: "jar", prices: [
    { store: "Woolworths", price: 4.50, unitPrice: 45.00, inStock: true },
    { store: "Coles", price: 4.20, unitPrice: 42.00, inStock: true },
    { store: "ALDI", price: 2.99, unitPrice: 29.90, inStock: true },
    { store: "IGA", price: 5.00, unitPrice: 50.00, inStock: true },
    { store: "Spudshed", price: 3.49, unitPrice: 34.90, inStock: true },
  ]},
];


// Create initial sample basket with common items
const SAMPLE_ITEMS: BasketItem[] = PERTH_PRODUCTS.slice(0, 8).map(p => ({ ...p, quantity: 1 }));

// Group products by category for display
const PRODUCT_CATEGORIES = {
  "Dairy & Eggs": PERTH_PRODUCTS.filter(p => ["milk", "eggs", "butter", "cheese", "yogurt", "cream"].some(k => p.id.includes(k))),
  "Bread & Bakery": PERTH_PRODUCTS.filter(p => ["bread", "wraps"].some(k => p.id.includes(k))),
  "Meat & Poultry": PERTH_PRODUCTS.filter(p => ["chicken", "beef", "pork", "lamb", "sausages", "bacon"].some(k => p.id.includes(k))),
  "Seafood": PERTH_PRODUCTS.filter(p => ["salmon", "prawns", "fish"].some(k => p.id.includes(k))),
  "Fruits": PERTH_PRODUCTS.filter(p => ["banana", "apple", "orange", "strawb", "blueb", "grape", "avocado", "lemon"].some(k => p.id.includes(k))),
  "Vegetables": PERTH_PRODUCTS.filter(p => ["potato", "onion", "carrot", "broccoli", "capsicum", "tomato", "cucumber", "lettuce", "spinach", "mushroom", "zucchini", "sweet", "corn"].some(k => p.id.includes(k))),
  "Pantry": PERTH_PRODUCTS.filter(p => ["rice", "pasta", "tomatoes-canned", "oil", "sugar", "flour", "cereal", "peanut", "vegemite", "honey", "jam", "coffee", "tea"].some(k => p.id.includes(k))),
  "Beverages": PERTH_PRODUCTS.filter(p => ["coca", "juice", "water-spring"].some(k => p.id.includes(k))),
  "Frozen": PERTH_PRODUCTS.filter(p => ["ice-cream", "frozen"].some(k => p.id.includes(k))),
  "Snacks": PERTH_PRODUCTS.filter(p => ["chips-175", "chocolate", "tim-tam", "nuts"].some(k => p.id.includes(k))),
  "Household": PERTH_PRODUCTS.filter(p => ["toilet", "paper-towels", "dish", "laundry", "cleaner", "garbage"].some(k => p.id.includes(k))),
  "Baby & Pet": PERTH_PRODUCTS.filter(p => ["baby", "nappies", "dog", "cat"].some(k => p.id.includes(k))),
  "Personal Care": PERTH_PRODUCTS.filter(p => ["shampoo", "toothpaste", "deodorant", "soap"].some(k => p.id.includes(k))),
};

export default function BasketOptimizer() {
  const [items, setItems] = useState<BasketItem[]>(SAMPLE_ITEMS);
  const [newItemName, setNewItemName] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  
  // Constraints
  const [maxStops, setMaxStops] = useState(2);
  const [preferStore, setPreferStore] = useState<string | null>(null);
  const [avoidLongDetours, setAvoidLongDetours] = useState(true);
  const [includeFuelCost, setIncludeFuelCost] = useState(true);
  
  // Filter products by search
  const filteredProducts = productSearchTerm.length > 0
    ? PERTH_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) &&
        !items.some(i => i.id === p.id)
      ).slice(0, 10)
    : [];
  
  const addProductFromDatabase = (product: BasketItem) => {
    if (!items.some(i => i.id === product.id)) {
      setItems([...items, { ...product, quantity: 1 }]);
      setProductSearchTerm("");
      setShowProductPicker(false);
      toast.success(`Added ${product.name} to basket`);
    }
  };

  const calculateBasketCost = (store: string): number => {
    return items.reduce((total, item) => {
      const storePrice = item.prices.find(p => p.store === store);
      if (storePrice && storePrice.inStock) {
        return total + (storePrice.price * item.quantity);
      }
      return total + 999; // Penalty for out of stock
    }, 0);
  };

  const findCheapestStore = (): string => {
    let cheapest = PERTH_STORES[0].name;
    let lowestCost = calculateBasketCost(PERTH_STORES[0].name);
    
    for (const store of PERTH_STORES) {
      const cost = calculateBasketCost(store.name);
      if (cost < lowestCost) {
        lowestCost = cost;
        cheapest = store.name;
      }
    }
    return cheapest;
  };

  // Store distance data (simulated Perth distances in km)
  const STORE_DISTANCES: Record<string, number> = {
    "Woolworths": 2.5,
    "Coles": 3.2,
    "ALDI": 4.1,
    "IGA": 1.8,
    "Spudshed": 5.5,
    "Costco Perth": 8.2,
  };

  const optimizeBasket = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization processing
    await new Promise(resolve => setTimeout(resolve, 1200));

    // 1. Calculate cost for each store (respecting prefer store constraint)
    const singleStoreCosts = PERTH_STORES.map(store => {
      const baseCost = calculateBasketCost(store.name);
      const distance = STORE_DISTANCES[store.name] || 5;
      const driveTime = distance * 2.5; // ~2.5 min per km
      
      // Apply preference bonus (10% effective discount for preferred store)
      const adjustedCost = preferStore === store.name ? baseCost * 0.9 : baseCost;
      
      // Apply detour penalty if enabled
      const detourPenalty = avoidLongDetours && distance > 6 ? baseCost * 0.05 : 0;
      
      return {
        store: store.name,
        baseCost,
        cost: adjustedCost + detourPenalty,
        distance,
        driveTime,
      };
    });

    const bestSingleStore = singleStoreCosts.reduce((best, current) => 
      current.cost < best.cost ? current : best
    );

    // 2. Calculate optimal split-run (respecting maxStops and constraints)
    const itemAssignments: { item: BasketItem; store: string; price: number; savings: number }[] = [];
    
    for (const item of items) {
      let eligiblePrices = item.prices.filter(p => p.inStock);
      
      // Apply prefer store boost
      if (preferStore) {
        eligiblePrices = eligiblePrices.map(p => ({
          ...p,
          effectivePrice: p.store === preferStore ? p.price * 0.95 : p.price
        }));
      } else {
        eligiblePrices = eligiblePrices.map(p => ({ ...p, effectivePrice: p.price }));
      }
      
      // Apply detour penalty for distant stores
      if (avoidLongDetours) {
        eligiblePrices = eligiblePrices.map(p => {
          const dist = STORE_DISTANCES[p.store] || 5;
          return {
            ...p,
            effectivePrice: dist > 6 ? (p as any).effectivePrice * 1.1 : (p as any).effectivePrice
          };
        });
      }
      
      const cheapestPrice = eligiblePrices.reduce((min, p) => 
        (p as any).effectivePrice < (min as any).effectivePrice ? p : min
      );
      
      const maxPrice = Math.max(...item.prices.map(p => p.price));
      
      itemAssignments.push({
        item,
        store: cheapestPrice.store,
        price: cheapestPrice.price * item.quantity,
        savings: (maxPrice - cheapestPrice.price) * item.quantity,
      });
    }

    // 3. Group by store and enforce maxStops constraint
    const storeGroups = itemAssignments.reduce((acc, assignment) => {
      if (!acc[assignment.store]) {
        acc[assignment.store] = [];
      }
      acc[assignment.store].push(assignment);
      return acc;
    }, {} as Record<string, typeof itemAssignments>);

    // Sort stores by total value and limit to maxStops
    let sortedStores = Object.entries(storeGroups)
      .map(([store, assignments]) => ({
        store,
        assignments,
        totalValue: assignments.reduce((s, a) => s + a.price, 0),
        totalSavings: assignments.reduce((s, a) => s + a.savings, 0),
      }))
      .sort((a, b) => b.totalValue - a.totalValue);

    // If we have more stores than maxStops, redistribute items
    if (sortedStores.length > maxStops) {
      const keptStores = sortedStores.slice(0, maxStops);
      const droppedStores = sortedStores.slice(maxStops);
      
      // Redistribute dropped items to kept stores (choose cheapest among kept)
      for (const dropped of droppedStores) {
        for (const assignment of dropped.assignments) {
          const item = assignment.item;
          const keptStorePrices = keptStores.map(ks => {
            const price = item.prices.find(p => p.store === ks.store && p.inStock);
            return { store: ks.store, price: price?.price || 999 };
          });
          
          const cheapestKept = keptStorePrices.reduce((min, p) => 
            p.price < min.price ? p : min
          );
          
          // Add to the cheapest kept store
          const target = keptStores.find(ks => ks.store === cheapestKept.store);
          if (target) {
            target.assignments.push({
              ...assignment,
              store: cheapestKept.store,
              price: cheapestKept.price * item.quantity,
            });
            target.totalValue += cheapestKept.price * item.quantity;
          }
        }
      }
      
      sortedStores = keptStores;
    }

    // 4. Build final results
    const splitStores: StoreResult[] = sortedStores.map(({ store, assignments }) => {
      const distance = STORE_DISTANCES[store] || 5;
      return {
        store,
        logo: PERTH_STORES.find(s => s.name === store)?.logo || "🏪",
        items: assignments.map(a => ({
          name: a.item.name,
          price: a.price / a.item.quantity,
          quantity: a.item.quantity,
        })),
        subtotal: assignments.reduce((s, a) => s + a.price, 0),
        savings: assignments.reduce((s, a) => s + a.savings, 0),
        distance,
        driveTime: distance * 2.5,
      };
    });

    const splitTotalCost = splitStores.reduce((s, store) => s + store.subtotal, 0);
    const fuelCostPerKm = 0.15; // ~$0.15/km at current Perth fuel prices
    const totalDistance = splitStores.reduce((d, s) => d + s.distance, 0) * 2; // Round trip
    const splitFuelCost = includeFuelCost ? totalDistance * fuelCostPerKm : 0;
    const estimatedTime = splitStores.reduce((t, s) => t + s.driveTime, 0) + (splitStores.length - 1) * 8;

    // 5. Compare strategies and choose best
    const singleStoreTotalCost = bestSingleStore.baseCost;
    const singleStoreFuel = includeFuelCost ? bestSingleStore.distance * 2 * fuelCostPerKm : 0;
    const splitRunTotalCost = splitTotalCost + splitFuelCost;

    // Only recommend split if savings exceed threshold ($3 or 5%)
    const splitSavings = singleStoreTotalCost - splitTotalCost;
    const worthSplitting = splitSavings > 3 && splitSavings > singleStoreTotalCost * 0.05;
    
    const bestStrategy = worthSplitting && splitStores.length > 1 ? "split" : "single";
    const totalSavings = bestStrategy === "split" 
      ? Math.max(0, singleStoreTotalCost - splitTotalCost)
      : 0;

    setResult({
      strategy: bestStrategy,
      stores: bestStrategy === "split" ? splitStores : [{
        store: bestSingleStore.store,
        logo: PERTH_STORES.find(s => s.name === bestSingleStore.store)?.logo || "🏪",
        items: items.map(i => ({
          name: i.name,
          price: i.prices.find(p => p.store === bestSingleStore.store)?.price || 0,
          quantity: i.quantity,
        })),
        subtotal: bestSingleStore.baseCost,
        savings: 0,
        distance: bestSingleStore.distance,
        driveTime: bestSingleStore.driveTime,
      }],
      totalCost: bestStrategy === "split" ? splitRunTotalCost : singleStoreTotalCost + singleStoreFuel,
      totalSavings,
      savingsPercent: totalSavings > 0 ? (totalSavings / singleStoreTotalCost) * 100 : 0,
      estimatedTime: bestStrategy === "split" ? estimatedTime : bestSingleStore.driveTime,
      fuelCost: bestStrategy === "split" ? splitFuelCost : singleStoreFuel,
    });

    setIsOptimizing(false);
    toast.success("Optimization complete!", {
      description: bestStrategy === "split" 
        ? `Split across ${splitStores.length} stores saves $${totalSavings.toFixed(2)}!`
        : `Best value at ${bestSingleStore.store}`
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const addSampleItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem: BasketItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      quantity: 1,
      unit: "item",
      prices: PERTH_STORES.map(store => ({
        store: store.name,
        price: Math.random() * 10 + 2,
        unitPrice: Math.random() * 10 + 2,
        inStock: Math.random() > 0.1,
      })),
    };
    
    setItems([...items, newItem]);
    setNewItemName("");
    toast.success("Item added to basket");
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedTotal = items.reduce((sum, item) => {
    const avgPrice = item.prices.reduce((s, p) => s + p.price, 0) / item.prices.length;
    return sum + (avgPrice * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
            <ShoppingCart className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="text-white">Basket</span>
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> Optimizer</span>
          </h1>
          <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white">V2</Badge>
        </div>
        <p className="text-white/60">
          Multi-store split optimization • Find the cheapest basket across Perth
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Basket Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-purple-400" />
                  Your Basket
                  <Badge variant="outline" className="ml-2">{totalItems} items</Badge>
                </CardTitle>
                <span className="text-white/60">
                  Est. ${estimatedTotal.toFixed(2)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Product Search */}
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search 70+ Perth products..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="bg-white/5 border-white/10 pr-20"
                      data-testid="input-product-search"
                    />
                    <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-500/20 text-purple-400 text-xs">
                      {PERTH_PRODUCTS.length} items
                    </Badge>
                  </div>
                  <Button 
                    onClick={() => setShowProductPicker(!showProductPicker)}
                    variant="outline"
                    className="border-white/10 hover:bg-white/10"
                    data-testid="button-browse-products"
                  >
                    Browse All
                  </Button>
                </div>
                
                {/* Search Results Dropdown */}
                {filteredProducts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-white/10 rounded-xl shadow-xl max-h-64 overflow-y-auto"
                  >
                    {filteredProducts.map((product) => {
                      const cheapest = Math.min(...product.prices.filter(p => p.inStock).map(p => p.price));
                      const special = product.prices.find(p => p.special);
                      return (
                        <button
                          key={product.id}
                          onClick={() => addProductFromDatabase(product)}
                          className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors text-left"
                          data-testid={`product-${product.id}`}
                        >
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-xs text-white/50">From ${cheapest.toFixed(2)}</p>
                          </div>
                          {special && (
                            <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">{special.special}</Badge>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
              
              {/* Product Category Browser */}
              {showProductPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-white/10 rounded-xl p-3 bg-white/5 max-h-72 overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">Browse by Category</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowProductPicker(false)}
                      className="text-white/50 hover:text-white h-6"
                    >
                      Close
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(PRODUCT_CATEGORIES).map(([category, products]) => (
                      <div key={category}>
                        <p className="text-xs font-medium text-purple-400 mb-1">{category}</p>
                        <div className="flex flex-wrap gap-1">
                          {products.filter(p => !items.some(i => i.id === p.id)).slice(0, 5).map(product => (
                            <button
                              key={product.id}
                              onClick={() => addProductFromDatabase(product)}
                              className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-white/80 transition-colors"
                              data-testid={`cat-product-${product.id}`}
                            >
                              {product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name}
                            </button>
                          ))}
                          {products.filter(p => !items.some(i => i.id === p.id)).length > 5 && (
                            <span className="px-2 py-1 text-xs text-white/40">
                              +{products.filter(p => !items.some(i => i.id === p.id)).length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Item List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const cheapestPrice = Math.min(...item.prices.filter(p => p.inStock).map(p => p.price));
                    const mostExpensive = Math.max(...item.prices.map(p => p.price));
                    const savings = ((mostExpensive - cheapestPrice) / mostExpensive) * 100;
                    
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{item.name}</p>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                              <span>x{item.quantity}</span>
                              <span>•</span>
                              <span className="text-cyan-400">
                                ${cheapestPrice.toFixed(2)} - ${mostExpensive.toFixed(2)}
                              </span>
                              {savings > 20 && (
                                <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                                  Save {savings.toFixed(0)}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-white/40 hover:text-red-400"
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="glass-strong border-cyan-500/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-cyan-400" />
                        Optimized Shopping Plan
                      </CardTitle>
                      <Badge className={result.strategy === "split" ? "bg-purple-600" : "bg-cyan-600"}>
                        {result.strategy === "split" ? "Multi-Store Split" : "Single Store"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative space-y-4">
                    {/* Savings Summary */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <DollarSign className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-white">${result.totalCost.toFixed(2)}</p>
                        <p className="text-xs text-white/50">Total Cost</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-cyan-500/10">
                        <TrendingDown className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-cyan-400">${result.totalSavings.toFixed(2)}</p>
                        <p className="text-xs text-white/50">You Save</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/5">
                        <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-white">{result.estimatedTime.toFixed(0)}m</p>
                        <p className="text-xs text-white/50">Est. Time</p>
                      </div>
                    </div>

                    {/* Store Breakdown */}
                    <div className="space-y-3">
                      {result.stores.map((store, idx) => (
                        <motion.div
                          key={store.store}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-4 rounded-xl bg-white/5"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{store.logo}</span>
                              <div>
                                <p className="font-semibold text-white">{store.store}</p>
                                <p className="text-xs text-white/50">
                                  {store.items.length} items • {store.distance.toFixed(1)}km
                                </p>
                              </div>
                            </div>
                            <p className="text-lg font-bold text-purple-400">
                              ${store.subtotal.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {store.items.map((item, i) => (
                              <Badge 
                                key={i} 
                                variant="outline" 
                                className="text-xs border-white/20"
                              >
                                {item.name} x{item.quantity}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Fuel Cost Note */}
                    {result.fuelCost > 0 && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">
                        <Fuel className="w-4 h-4" />
                        <span>Includes ~${result.fuelCost.toFixed(2)} estimated fuel for {result.stores.length} stops</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Optimization Controls */}
        <div className="space-y-4">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-400" />
                Optimization Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Max Stops */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white/70">Max Stops</Label>
                  <Badge variant="outline">{maxStops} stores</Badge>
                </div>
                <Slider
                  value={[maxStops]}
                  onValueChange={([v]) => setMaxStops(v)}
                  min={1}
                  max={4}
                  step={1}
                  className="py-2"
                />
                <p className="text-xs text-white/40">
                  Limit how many stores to visit
                </p>
              </div>

              {/* Prefer Store */}
              <div className="space-y-2">
                <Label className="text-white/70">Prefer Store (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {PERTH_STORES.slice(0, 4).map(store => (
                    <Button
                      key={store.id}
                      variant={preferStore === store.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreferStore(
                        preferStore === store.name ? null : store.name
                      )}
                      className={preferStore === store.name 
                        ? "bg-purple-600" 
                        : "border-white/20 text-white/60"
                      }
                    >
                      {store.logo} {store.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white/70 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Avoid Long Detours
                  </Label>
                  <Switch
                    checked={avoidLongDetours}
                    onCheckedChange={setAvoidLongDetours}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-white/70 flex items-center gap-2">
                    <Fuel className="w-4 h-4" />
                    Include Fuel Cost
                  </Label>
                  <Switch
                    checked={includeFuelCost}
                    onCheckedChange={setIncludeFuelCost}
                  />
                </div>
              </div>

              {/* Optimize Button */}
              <Button
                onClick={optimizeBasket}
                disabled={isOptimizing || items.length === 0}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold"
                data-testid="button-optimize"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Find Cheapest Basket
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Store Price Comparison */}
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2">
              <CardTitle 
                className="text-lg flex items-center justify-between cursor-pointer"
                onClick={() => setShowComparison(!showComparison)}
              >
                <span className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-cyan-400" />
                  Store Comparison
                </span>
                {showComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
            <AnimatePresence>
              {showComparison && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <CardContent className="space-y-2">
                    {PERTH_STORES.map(store => {
                      const cost = calculateBasketCost(store.name);
                      const cheapest = Math.min(...PERTH_STORES.map(s => calculateBasketCost(s.name)));
                      const isLowest = cost === cheapest;
                      
                      return (
                        <div 
                          key={store.id}
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            isLowest ? 'bg-cyan-500/10' : 'bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{store.logo}</span>
                            <span className={isLowest ? 'text-cyan-400 font-medium' : 'text-white/70'}>
                              {store.name}
                            </span>
                            {isLowest && (
                              <Badge className="bg-cyan-600 text-xs">Cheapest</Badge>
                            )}
                          </div>
                          <span className={isLowest ? 'text-cyan-400 font-bold' : 'text-white/60'}>
                            ${cost.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
}
