import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, Newspaper } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  source: string;
  category: string;
  imageUrl?: string;
  externalUrl?: string;
  priority: string;
  publishedAt: string;
}

export default function NewsCorner() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: newsData, isLoading } = useQuery({
    queryKey: ["/api/news"],
    queryFn: async () => {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
  });

  const categories = ["all", "grocery", "utilities", "crypto", "investing"];
  const news = newsData?.news || [];

  const filteredNews = news.filter((item: NewsItem) => 
    selectedCategory === "all" || item.category === selectedCategory
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500/50 bg-red-500/10";
      case "normal":
        return "border-cyan-500/30 bg-white/5";
      default:
        return "border-white/20 bg-white/5";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: { [key: string]: string } = {
      grocery: "text-cyan-400",
      utilities: "text-purple-400",
      crypto: "text-teal-400",
      investing: "text-slate-400",
    };
    return colors[category] || "text-cyan-400";
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Newspaper className="h-6 w-6 text-cyan-500" />
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">Financial News</h1>
          </div>
          <p className="text-white/60 text-base sm:text-lg">
            Personalized financial news and market updates for Perth
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex gap-2 mb-8 overflow-x-auto pb-2"
        >
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              variant={selectedCategory === cat ? "default" : "outline"}
              className={selectedCategory === cat
                ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                : "border-white/20 text-white hover:bg-white/10"
              }
              data-testid={`button-news-category-${cat}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
            </Button>
          ))}
        </motion.div>

        {/* News Feed */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        ) : filteredNews.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center py-12"
          >
            <p className="text-white/60">No news available for this category yet</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map((item: NewsItem, idx: number) => (
              <motion.div
                key={item.id}
                initial="hidden"
                animate="visible"
                variants={{ ...containerVariants, visible: { transition: { delay: idx * 0.05 } } }}
              >
                <Card className={`${getPriorityColor(item.priority)} border transition-all hover:border-cyan-500/60`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg leading-tight">{item.title}</CardTitle>
                        <CardDescription className="text-white/50 text-sm mt-1">
                          {item.source} • {new Date(item.publishedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-20 w-20 rounded object-cover flex-shrink-0"
                        />
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-white/70 text-sm">
                      {item.summary || item.content || "Read more for details..."}
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex gap-2">
                        <Badge variant="outline" className={`border-cyan-500/50 ${getCategoryBadgeColor(item.category)}`}>
                          {item.category}
                        </Badge>
                        {item.priority === "high" && (
                          <Badge variant="outline" className="border-red-500/50 text-red-400">
                            Breaking
                          </Badge>
                        )}
                      </div>

                      {item.externalUrl && (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                          data-testid={`button-read-news-${item.id}`}
                        >
                          <a href={item.externalUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Read More
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
