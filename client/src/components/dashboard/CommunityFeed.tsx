import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const activities = [
  {
    user: "Sarah M.",
    action: "found a hidden deal",
    item: "Tim Tams 50% off",
    store: "Coles Subiaco",
    time: "2m ago",
    avatar: "SM"
  },
  {
    user: "Mike T.",
    action: "verified price",
    item: "Banana prices dropped",
    store: "Spudshed Innaloo",
    time: "15m ago",
    avatar: "MT"
  },
  {
    user: "Jessica L.",
    action: "scanned receipt",
    item: "Saved $12.50 total",
    store: "Woolworths Perth City",
    time: "45m ago",
    avatar: "JL"
  }
];

export function CommunityFeed() {
  return (
    <Card className="bg-gradient-to-br from-white/8 to-white/4 backdrop-blur border-white/8">
      <CardHeader>
        <CardTitle className="font-display text-white">Live Activity</CardTitle>
        <p className="text-sm text-white/50 mt-2 font-light">Real-time savings from Perth</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-6 pr-4">
            {activities.map((activity, i) => (
              <div key={`activity-${i}`} className="flex gap-3 relative pb-6 last:pb-0">
                {i !== activities.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-px bg-white/10" />
                )}
                <Avatar className="h-10 w-10 border-2 border-white/10">
                  <AvatarFallback className="bg-primary/15 text-primary font-bold text-xs">
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="pt-1">
                  <p className="text-sm text-white">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    <span className="text-white/50">{activity.action}</span>
                  </p>
                  <p className="text-sm font-medium text-primary mt-0.5">
                    {activity.item}
                  </p>
                  <p className="text-xs text-white/50 mt-1 flex items-center gap-1.5">
                    {activity.store} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}