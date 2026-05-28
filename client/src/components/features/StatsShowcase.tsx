import { TrendingUp, Users, MapPin, Zap } from "lucide-react";

const stats = [
  {
    icon: Users,
    label: "Perth Families",
    value: "10K+",
    subtext: "Across all WA suburbs saving daily",
    color: "text-accent"
  },
  {
    icon: MapPin,
    label: "Stores Covered",
    value: "Woolies, Coles, ALDI, IGA, Spudshed",
    subtext: "Plus BP, Shell, Caltex fuel tracking",
    color: "text-primary"
  },
  {
    icon: TrendingUp,
    label: "WA Products",
    value: "1.6K+",
    subtext: "Local produce, meat, dairy tracked",
    color: "text-primary"
  },
  {
    icon: Zap,
    label: "Average Savings",
    value: "$65/month",
    subtext: "Per family on WA groceries",
    color: "text-primary"
  }
];

export function StatsShowcase() {
  return (
    <section className="py-20">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl font-display font-bold text-white">Proven Traction</h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">Real metrics proving product-market fit in Perth</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={`stat-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 backdrop-blur border border-white/8 rounded-2xl p-8 transition-smooth hover:from-white/12 hover:to-white/6 hover:border-white/12 group">
              <Icon className={`h-12 w-12 ${stat.color} mb-6 group-hover:scale-110 transition-smooth`} />
              <p className="text-white/60 text-sm font-semibold mb-2">{stat.label}</p>
              <p className="text-4xl font-display font-bold text-white mb-2">{stat.value}</p>
              <p className="text-sm text-white/50 leading-relaxed font-light">{stat.subtext}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}