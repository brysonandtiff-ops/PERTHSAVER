import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartSkeleton } from "@/components/Skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ExportButton } from "@/components/ExportButton";
import { useAnalytics } from "@/lib/api";
import { exportAnalytics, ExportFormat } from "@/lib/export";
import { TrendingUp, Download, DollarSign, Calendar, Award, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { subMonths, format, parseISO, isAfter } from "date-fns";

const COLORS = {
  primary: "hsl(168 78% 40%)",
  accent: "hsl(48 96% 53%)",
  secondary: "hsl(220 30% 50%)",
  tertiary: "hsl(120 73% 75%)",
  quaternary: "hsl(167 71% 62%)",
};

export default function Analytics() {
  const [dateRange, setDateRange] = useState("all");
  const { data, isLoading } = useAnalytics();

  const monthlyData = data?.monthlyData || {};
  const categoryData = data?.categoryData || {};
  const topSources = data?.topSources || [];
  const totalSavings = data?.totalSavings || 0;

  const filterDataByDateRange = (data: Record<string, any>) => {
    if (dateRange === "all") return data;
    
    const now = new Date();
    const cutoffDate = dateRange === "3m" ? subMonths(now, 3) : 
                       dateRange === "6m" ? subMonths(now, 6) : 
                       dateRange === "12m" ? subMonths(now, 12) : now;
    
    return Object.entries(data).reduce((acc, [key, value]) => {
      try {
        const date = parseISO(`${key}-01`);
        if (isAfter(date, cutoffDate)) {
          acc[key] = value;
        }
      } catch {
      }
      return acc;
    }, {} as Record<string, any>);
  };

  const filteredMonthlyData = filterDataByDateRange(monthlyData);
  const filteredCategoryData = dateRange === "all" ? categoryData : 
    Object.entries(categoryData).reduce((acc, [cat, val]) => ({ ...acc, [cat]: val }), {});

  const monthlyChartData = Object.entries(filteredMonthlyData).map(([month, amount]) => ({
    month,
    savings: parseFloat(amount as string),
  }));

  const categoryChartData = Object.entries(filteredCategoryData).map(([category, amount]) => ({
    name: category,
    value: parseFloat(amount as string),
  }));

  const categoryColors = [
    COLORS.primary,
    COLORS.accent,
    COLORS.secondary,
    COLORS.tertiary,
    COLORS.quaternary,
  ];

  const handleExport = (format: ExportFormat) => {
    if (!data) {
      throw new Error("No analytics data available to export");
    }
    
    exportAnalytics(data, format);
  };

  const avgMonthlySavings = monthlyChartData.length > 0
    ? monthlyChartData.reduce((sum, item) => sum + item.savings, 0) / monthlyChartData.length
    : 0;

  const projectedYearlySavings = avgMonthlySavings * 12;

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-white" data-testid="text-page-title">
                Savings Analytics
              </h1>
              <p className="text-xs text-white/60 mt-2" data-testid="text-page-subtitle">
                Track your savings journey and make data-driven decisions
              </p>
            </div>
            <ExportButton 
              onExport={handleExport}
              label="Export Report"
              className="bg-primary hover:bg-primary/90 text-white w-full touch-target"
              dataTestId="button-export"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Calendar className="h-4 w-4 text-white/60" />
            <span className="text-white/60 text-xs">Date Range:</span>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white w-full h-10" data-testid="select-date-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="all" className="text-white">All Time</SelectItem>
                <SelectItem value="3m" className="text-white">Last 3 Months</SelectItem>
                <SelectItem value="6m" className="text-white">Last 6 Months</SelectItem>
                <SelectItem value="12m" className="text-white">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 gap-3 mb-8">
          <Card className="glass border-white/8" data-testid="card-total-savings">
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-white/60 text-xs font-light">Total Savings</p>
                  <p className="text-lg font-display font-bold text-primary mt-1 truncate" data-testid="text-total-savings">
                    ${totalSavings.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-primary opacity-30 shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/8" data-testid="card-avg-monthly">
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-white/60 text-xs font-light">Avg Monthly</p>
                  <p className="text-lg font-display font-bold text-accent mt-1 truncate" data-testid="text-avg-monthly">
                    ${avgMonthlySavings.toFixed(2)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-accent opacity-30 shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/8" data-testid="card-categories">
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-white/60 text-xs font-light">Categories</p>
                  <p className="text-lg font-display font-bold text-white mt-1 truncate" data-testid="text-categories">
                    {categoryChartData.length}
                  </p>
                </div>
                <Award className="h-8 w-8 text-purple-400 opacity-30 shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/8" data-testid="card-yearly-projection">
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-white/60 text-xs font-light">Yearly Projection</p>
                  <p className="text-lg font-display font-bold text-primary mt-1 truncate" data-testid="text-yearly-projection">
                    ${projectedYearlySavings.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary opacity-30 shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <ChartSkeleton height="280px" />
              <ChartSkeleton height="280px" />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <ChartSkeleton height="360px" />
              <ChartSkeleton height="360px" />
            </div>
          </div>
        ) : monthlyChartData.length === 0 ? (
          <Card className="glass border-white/8" data-testid="card-empty-state">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <h3 className="text-lg font-display font-bold text-white mb-2">No Analytics Data Yet</h3>
              <p className="text-xs text-white/60">
                Start saving to see your analytics and insights here
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 mb-8">
              {/* Savings Over Time - Vertical Bar Chart */}
              <Card className="glass border-white/8" data-testid="card-savings-chart">
                <CardHeader className="p-4">
                  <CardTitle className="font-display text-base text-white">Savings Over Time</CardTitle>
                  <CardDescription className="text-xs text-white/60">Your monthly savings trend</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="relative h-64">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pb-8">
                      {[100, 75, 50, 25, 0].map((value) => (
                        <div key={value} className="flex items-center gap-2">
                          <span className="text-xs text-white/40 w-8 text-right">{value}%</span>
                          <div className="flex-1 h-px bg-white/5" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Bar chart */}
                    <div className="absolute inset-0 flex items-end justify-around gap-2 px-10 pb-8">
                      {monthlyChartData.map((data, index) => {
                        const maxSavings = Math.max(...monthlyChartData.map(d => d.savings));
                        const heightPercentage = (data.savings / maxSavings) * 100;
                        const [year, month] = data.month.split('-');
                        const formattedMonth = `${month}/${year.slice(2)}`;
                        
                        // Color gradient from teal to amber based on index
                        const progress = index / (monthlyChartData.length - 1 || 1);
                        const hue = 168 - (progress * 120); // 168 (teal) to 48 (amber)
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center group">
                            {/* Hover tooltip */}
                            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none z-10">
                              <div className="font-display font-bold text-primary">${data.savings.toFixed(2)}</div>
                              <div className="text-xs text-white/60">{formattedMonth}</div>
                            </div>
                            
                            {/* Bar */}
                            <div 
                              className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80 relative overflow-hidden"
                              style={{ 
                                height: `${heightPercentage}%`,
                                background: `linear-gradient(180deg, hsl(${hue} 78% 50%) 0%, hsl(${hue} 78% 35%) 100%)`,
                                boxShadow: `0 0 20px hsl(${hue} 78% 50% / 0.3)`,
                                minHeight: data.savings > 0 ? '4px' : '0px'
                              }}
                              data-testid={`bar-${index}`}
                            >
                              {/* Shine effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </div>
                            
                            {/* Month label */}
                            <div className="mt-2 text-xs text-white/60 font-medium rotate-0">
                              {formattedMonth}
                            </div>
                            
                            {/* Latest badge */}
                            {index === monthlyChartData.length - 1 && (
                              <Badge className="bg-primary/20 text-primary text-xs mt-1">Latest</Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown - Horizontal Stacked Bar */}
              <Card className="glass border-white/8" data-testid="card-category-chart">
                <CardHeader>
                  <CardTitle className="font-display text-white">Category Breakdown</CardTitle>
                  <CardDescription className="text-white/60">Savings by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Stacked bar */}
                    <div className="relative">
                      <div className="flex h-12 rounded-lg overflow-hidden shadow-lg">
                        {categoryChartData.map((category, index) => {
                          const totalCategorySavings = categoryChartData.reduce((sum, c) => sum + c.value, 0);
                          const percentage = (category.value / totalCategorySavings) * 100;
                          
                          return (
                            <div
                              key={index}
                              className="relative group transition-all duration-300 hover:brightness-110"
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: categoryColors[index % categoryColors.length],
                                boxShadow: `inset 0 0 20px rgba(0,0,0,0.2)`
                              }}
                              data-testid={`category-segment-${index}`}
                            >
                              {/* Percentage label (only show if >8%) */}
                              {percentage > 8 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-white font-bold text-sm drop-shadow-lg">
                                    {percentage.toFixed(0)}%
                                  </span>
                                </div>
                              )}
                              
                              {/* Hover tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none z-10">
                                <div className="font-medium capitalize">{category.name.replace(/_/g, ' ')}</div>
                                <div className="text-xs text-white/80">${category.value.toFixed(2)} ({percentage.toFixed(1)}%)</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="space-y-3">
                      {categoryChartData.map((category, index) => {
                        const totalCategorySavings = categoryChartData.reduce((sum, c) => sum + c.value, 0);
                        const percentage = (category.value / totalCategorySavings) * 100;
                        
                        return (
                          <div key={index} className="flex items-center justify-between group hover:bg-white/5 p-2 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-md shadow-lg"
                                style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                              />
                              <span className="text-white text-sm font-medium capitalize">
                                {category.name.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-white/60 text-xs font-medium">
                                {percentage.toFixed(1)}%
                              </span>
                              <span className="text-white font-display font-bold">
                                ${category.value.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Monthly Comparison - With Growth Indicators */}
              <Card className="glass border-white/8" data-testid="card-monthly-comparison">
                <CardHeader className="p-4">
                  <CardTitle className="font-display text-base text-white">Monthly Comparison</CardTitle>
                  <CardDescription className="text-xs text-white/60">Track your monthly growth</CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="grid grid-cols-1 gap-2">
                    {monthlyChartData.map((data, index) => {
                      const maxSavings = Math.max(...monthlyChartData.map(d => d.savings));
                      const [year, month] = data.month.split('-');
                      const formattedMonth = `${month}/${year.slice(2)}`;
                      const isHighest = data.savings === maxSavings;
                      
                      // Calculate change from previous month
                      const previousMonthSavings = index > 0 ? monthlyChartData[index - 1].savings : null;
                      const change = previousMonthSavings !== null ? data.savings - previousMonthSavings : null;
                      const changePercentage = previousMonthSavings !== null && previousMonthSavings > 0
                        ? ((change! / previousMonthSavings) * 100)
                        : null;
                      
                      const isIncrease = change !== null && change > 0;
                      const isDecrease = change !== null && change < 0;
                      const isNeutral = change !== null && change === 0;
                      
                      return (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
                            isHighest 
                              ? 'bg-accent/10 border-accent/30 shadow-lg shadow-accent/10' 
                              : 'bg-white/5 border-white/8'
                          }`}
                          data-testid={`month-card-${index}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-medium">{formattedMonth}</span>
                                {isHighest && (
                                  <Badge className="bg-accent/20 text-accent text-xs">Best</Badge>
                                )}
                              </div>
                              <div className="text-2xl font-display font-bold text-primary">
                                ${data.savings.toFixed(2)}
                              </div>
                            </div>
                            
                            {/* Change indicator */}
                            {change !== null && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                                isIncrease ? 'bg-green-500/20 text-green-400' :
                                isDecrease ? 'bg-red-500/20 text-red-400' :
                                'bg-white/10 text-white/60'
                              }`}>
                                {isIncrease && <ArrowUp className="h-3 w-3" />}
                                {isDecrease && <ArrowDown className="h-3 w-3" />}
                                {isNeutral && <Minus className="h-3 w-3" />}
                                <span className="text-xs font-bold">
                                  {changePercentage !== null ? `${Math.abs(changePercentage).toFixed(0)}%` : '$0'}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Visual representation */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-white/40">vs max</span>
                              <span className="text-white/60">
                                {((data.savings / maxSavings) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${(data.savings / maxSavings) * 100}%`,
                                  background: isHighest 
                                    ? 'linear-gradient(90deg, hsl(48 96% 53%), hsl(48 96% 63%))'
                                    : 'linear-gradient(90deg, hsl(168 78% 40%), hsl(168 78% 50%))'
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Change from previous month text */}
                          {change !== null && !isNeutral && (
                            <div className="mt-2 text-xs text-white/50">
                              {isIncrease ? '+' : ''}{change.toFixed(2)} from prev month
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top Savings Sources */}
              <Card className="glass border-white/8" data-testid="card-top-sources">
                <CardHeader>
                  <CardTitle className="font-display text-white">Top Savings Sources</CardTitle>
                  <CardDescription className="text-white/60">Where you saved the most</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSources.length === 0 ? (
                      <p className="text-white/60 text-center py-8">No source data available</p>
                    ) : (
                      topSources.map((source: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 glass rounded-lg border border-white/5" data-testid={`source-${index}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0 ? 'bg-primary/20' : index === 1 ? 'bg-accent/20' : 'bg-white/10'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-white font-medium capitalize" data-testid={`source-name-${index}`}>
                                {source.source.replace(/_/g, ' ')}
                              </p>
                            </div>
                          </div>
                          <p className="text-xl font-display font-bold text-primary" data-testid={`source-amount-${index}`}>
                            ${parseFloat(source.amount).toFixed(2)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
