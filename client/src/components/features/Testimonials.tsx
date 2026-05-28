import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Family of 4, Subiaco",
    quote: "I'm saving nearly $200 a week! Shopping at Spudshed with Perth Saver tips has been a game-changer for our household.",
    rating: 5,
    avatar: "SM"
  },
  {
    name: "David Chen",
    role: "Small Business Owner, Fremantle",
    quote: "The fuel tracker saved me heaps on petrol costs across Perth. Best decision for my delivery business.",
    rating: 5,
    avatar: "DC"
  },
  {
    name: "Emma Robertson",
    role: "Sustainability Champion, Leederville",
    quote: "Love supporting local farmers through the app. Carbon tracking + Aussie produce. This is what I've been looking for!",
    rating: 5,
    avatar: "ER"
  }
];

export function Testimonials() {
  return (
    <section className="space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-display font-bold text-white">Loved by Perth Families</h2>
        <p className="text-white/60 font-light">Hear from real users saving real money</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {testimonials.map((testimonial, i) => (
          <Card key={testimonial.name} className="p-8 bg-gradient-to-br from-white/8 to-white/4 backdrop-blur hover:from-white/12 hover:to-white/6 transition-smooth border-white/8 hover:border-white/12">
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, j) => (
                <Star key={`star-${j}`} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            
            <p className="text-base mb-8 leading-relaxed text-white/80 font-light">"{testimonial.quote}"</p>
            
            <div className="flex items-center gap-3 pt-6 border-t border-white/10">
              <Avatar className="h-10 w-10 border border-white/15">
                <AvatarFallback className="bg-primary/15 text-primary font-bold text-sm">
                  {testimonial.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm text-white font-display">{testimonial.name}</p>
                <p className="text-xs text-white/50 font-light">{testimonial.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}