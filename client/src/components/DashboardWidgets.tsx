import { useState, useEffect, useCallback } from "react";
import { motion, Reorder, useDragControls } from "framer-motion";
import { 
  GripVertical, Settings, Eye, EyeOff, RotateCcw, 
  TrendingUp, Wallet, Target, Fuel, ShoppingCart, Receipt,
  Calendar, Trophy, Bell, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export interface Widget {
  id: string;
  name: string;
  icon: React.ElementType;
  visible: boolean;
  order: number;
}

const DEFAULT_WIDGETS: Widget[] = [
  { id: "savings-overview", name: "Savings Overview", icon: Wallet, visible: true, order: 0 },
  { id: "monthly-trends", name: "Monthly Trends", icon: TrendingUp, visible: true, order: 1 },
  { id: "savings-goals", name: "Savings Goals", icon: Target, visible: true, order: 2 },
  { id: "fuel-prices", name: "Fuel Prices", icon: Fuel, visible: true, order: 3 },
  { id: "grocery-deals", name: "Grocery Deals", icon: ShoppingCart, visible: true, order: 4 },
  { id: "recent-receipts", name: "Recent Receipts", icon: Receipt, visible: true, order: 5 },
  { id: "upcoming-bills", name: "Upcoming Bills", icon: Calendar, visible: true, order: 6 },
  { id: "achievements", name: "Achievements", icon: Trophy, visible: false, order: 7 },
  { id: "alerts", name: "Price Alerts", icon: Bell, visible: false, order: 8 },
  { id: "quick-actions", name: "Quick Actions", icon: Zap, visible: true, order: 9 },
];

const STORAGE_KEY = "perth-saver-dashboard-layout";

export function useDashboardLayout() {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    if (typeof window === "undefined") return DEFAULT_WIDGETS;
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new widgets
        return DEFAULT_WIDGETS.map(defaultWidget => {
          const savedWidget = parsed.find((w: Widget) => w.id === defaultWidget.id);
          return savedWidget || defaultWidget;
        }).sort((a, b) => a.order - b.order);
      } catch {
        return DEFAULT_WIDGETS;
      }
    }
    return DEFAULT_WIDGETS;
  });

  const saveLayout = useCallback((newWidgets: Widget[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newWidgets));
  }, []);

  const updateWidgets = useCallback((newWidgets: Widget[]) => {
    const orderedWidgets = newWidgets.map((w, i) => ({ ...w, order: i }));
    setWidgets(orderedWidgets);
    saveLayout(orderedWidgets);
  }, [saveLayout]);

  const toggleWidget = useCallback((id: string) => {
    setWidgets(prev => {
      const updated = prev.map(w => 
        w.id === id ? { ...w, visible: !w.visible } : w
      );
      saveLayout(updated);
      return updated;
    });
  }, [saveLayout]);

  const resetLayout = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
    saveLayout(DEFAULT_WIDGETS);
  }, [saveLayout]);

  return {
    widgets,
    visibleWidgets: widgets.filter(w => w.visible),
    updateWidgets,
    toggleWidget,
    resetLayout,
  };
}

interface WidgetCustomizerProps {
  widgets: Widget[];
  onReorder: (widgets: Widget[]) => void;
  onToggle: (id: string) => void;
  onReset: () => void;
}

export function WidgetCustomizer({ widgets, onReorder, onToggle, onReset }: WidgetCustomizerProps) {
  const [open, setOpen] = useState(false);
  const [localWidgets, setLocalWidgets] = useState(widgets);

  useEffect(() => {
    setLocalWidgets(widgets);
  }, [widgets]);

  const handleLocalToggle = (id: string) => {
    setLocalWidgets(prev => prev.map(w => 
      w.id === id ? { ...w, visible: !w.visible } : w
    ));
  };

  const handleSave = () => {
    onReorder(localWidgets);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/60 hover:text-white hover:bg-white/10"
          data-testid="button-customize-dashboard"
        >
          <Settings className="h-4 w-4 mr-2" />
          Customize
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900/95 to-slate-950/95 border-purple-500/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-400" />
            Customize Dashboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-white/60 text-sm">
            Drag to reorder widgets. Toggle visibility with the switches.
          </p>
          
          <Reorder.Group
            axis="y"
            values={localWidgets}
            onReorder={setLocalWidgets}
            className="space-y-2"
          >
            {localWidgets.map((widget) => (
              <WidgetItem
                key={widget.id}
                widget={widget}
                onToggle={handleLocalToggle}
              />
            ))}
          </Reorder.Group>
          
          <div className="flex justify-between pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-white/60 hover:text-white"
              data-testid="button-reset-layout"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              data-testid="button-save-layout"
            >
              Save Layout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WidgetItem({ widget, onToggle }: { widget: Widget; onToggle: (id: string) => void }) {
  const controls = useDragControls();
  const Icon = widget.icon;

  return (
    <Reorder.Item
      value={widget}
      dragListener={false}
      dragControls={controls}
      className="cursor-default"
    >
      <Card className={`transition-all ${widget.visible ? 'bg-white/5 border-purple-500/20' : 'bg-white/[0.02] border-white/5'}`}>
        <CardContent className="p-3 flex items-center gap-3">
          <div
            onPointerDown={(e) => controls.start(e)}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="h-5 w-5 text-white/30" />
          </div>
          
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${widget.visible ? 'bg-purple-500/20' : 'bg-white/5'}`}>
            <Icon className={`h-4 w-4 ${widget.visible ? 'text-purple-400' : 'text-white/30'}`} />
          </div>
          
          <span className={`flex-1 text-sm ${widget.visible ? 'text-white' : 'text-white/40'}`}>
            {widget.name}
          </span>
          
          <div className="flex items-center gap-2">
            {widget.visible ? (
              <Eye className="h-4 w-4 text-white/40" />
            ) : (
              <EyeOff className="h-4 w-4 text-white/20" />
            )}
            <Switch
              checked={widget.visible}
              onCheckedChange={() => onToggle(widget.id)}
              data-testid={`switch-widget-${widget.id}`}
            />
          </div>
        </CardContent>
      </Card>
    </Reorder.Item>
  );
}

export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      layout
    >
      {children}
    </motion.div>
  );
}
