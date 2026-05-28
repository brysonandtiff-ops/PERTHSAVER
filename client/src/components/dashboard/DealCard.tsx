import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ThumbsUp, Share2 } from "lucide-react";

interface DealCardProps {
  store: string;
  product: string;
  price: string;
  originalPrice: string;
  location: string;
  timeAgo: string;
  votes: number;
  imageColor: string;
}

export function DealCard({ store, product, price, originalPrice, location, timeAgo, votes, imageColor }: DealCardProps) {
  const savings = parseFloat(originalPrice.replace('$', '')) - parseFloat(price.replace('$', ''));
  const savingsPercent = Math.round((savings / parseFloat(originalPrice.replace('$', ''))) * 100);

  return (
    <Card className="group bg-gradient-to-br from-white/8 to-white/4 backdrop-blur hover:from-white/12 hover:to-white/6 transition-smooth border-white/8 hover:border-white/12 overflow-hidden">
      <CardContent className="p-3">
        <div className="flex gap-3">
          <div className={`h-16 w-16 rounded-lg ${imageColor} shrink-0 flex items-center justify-center text-2xl shadow-lg`}>
            🍎
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <Badge variant="secondary" className="text-xs font-semibold bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 min-h-[32px]">
                {store}
              </Badge>
              <span className="text-xs text-white/50 flex items-center gap-1 shrink-0 font-light">
                <Clock className="h-3 w-3" /> <span>{timeAgo}</span>
              </span>
            </div>
            
            <h3 className="font-display font-bold text-sm mt-1 truncate pr-2 leading-tight text-white line-clamp-2">
              {product}
            </h3>
            
            <div className="flex items-baseline gap-2 mt-1 flex-wrap">
              <span className="text-xl font-display font-bold text-primary">{price}</span>
              <span className="text-xs text-white/40 line-through font-light">{originalPrice}</span>
              <span className="text-xs font-bold text-accent ml-auto">-{savingsPercent}%</span>
            </div>
            
            <p className="text-xs text-white/50 mt-1 flex items-center gap-1 truncate font-light">
              <span className="inline-block h-1 w-1 rounded-full bg-primary" />
              {location}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-white/4 flex justify-between border-t border-white/8 min-h-[40px]">
        <Button variant="ghost" size="sm" className="gap-1.5 text-white/50 hover:text-primary hover:bg-white/10 transition-smooth min-h-[36px]">
          <ThumbsUp className="h-3 w-3" />
          <span className="text-xs font-medium">{votes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-white/50 hover:text-primary hover:bg-white/10 transition-smooth min-h-[36px]">
          <Share2 className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}