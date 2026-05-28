import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Heart, Share2, MapPin, Users } from "lucide-react";
import { PostSkeleton } from "@/components/Skeleton";
import { useQuery } from "@tanstack/react-query";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  hover: { scale: 1.02, transition: { duration: 0.3 } },
};

const getCategoryBadgeColor = (category: string) => {
  const colors: Record<string, string> = {
    "Grocery Tips": "bg-cyan-500/30 text-cyan-300",
    "Utilities": "bg-purple-500/30 text-purple-300",
    "Shopping Hacks": "bg-cyan-500/30 text-cyan-300",
    "Subscriptions": "bg-slate-500/30 text-slate-300",
    "Family Budget": "bg-cyan-500/30 text-cyan-300",
    "Insurance": "bg-purple-500/30 text-purple-300",
    "Travel": "bg-purple-500/30 text-purple-300",
    "Cashback": "bg-cyan-500/30 text-cyan-300",
  };
  return colors[category] || "bg-cyan-500/30 text-cyan-300";
};

export default function CommunityForum() {
  const [messages, setMessages] = useState<any[]>([]);
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/community-posts"],
    queryFn: async () => {
      const res = await fetch("/api/community-posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      return data.posts || [];
    },
  });

  // Transform posts to messages format
  useEffect(() => {
    if (posts.length > 0) {
      const transformedMessages = posts.map((post: CommunityPost, idx: number) => ({
        id: idx + 1,
        author: `Perth Saver #${idx + 1}`,
        suburb: "Perth, WA",
        avatar: String(post.title[0]).toUpperCase(),
        message: post.content,
        likes: post.likes,
        comments: post.comments,
        timestamp: "Recent",
        tags: [post.category],
      }));
      setMessages(transformedMessages);
    }
  }, [posts]);

  return (
    <div className="min-h-screen flex flex-col">
      
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Community Forum</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Share deals, tips & savings with 24K+ Perth community members</p>
        </motion.div>

        {/* Create Post CTA */}
        <motion.div variants={itemVariants}>
          <Card data-testid="card-create-post" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur mb-6 sm:mb-8">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold text-sm">
                  You
                </div>
                <Input
                  data-testid="input-post"
                  placeholder="Share a deal or ask a question..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full"
                />
                <Button data-testid="button-post" className="bg-primary hover:bg-primary/90 text-white gap-1">
                  <MessageCircle className="h-4 w-4" /> Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Threads */}
        {isLoading ? (
          <PostSkeleton count={4} />
        ) : (
          <motion.div className="space-y-6" variants={containerVariants}>
            {messages.map((msg, idx) => (
              <motion.div key={msg.id} variants={cardVariants} whileHover="hover">
                <Card data-testid={`card-post-${msg.id}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:from-white/12 hover:to-white/6 transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Author Info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {msg.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-display font-semibold text-white" data-testid={`text-author-${msg.id}`}>{msg.author}</p>
                          <div className="flex items-center gap-1 text-xs text-white/60">
                            <MapPin className="h-3 w-3" /> <span data-testid={`text-suburb-${msg.id}`}>{msg.suburb}</span>
                          </div>
                        </div>
                        <p className="text-xs text-white/50" data-testid={`text-timestamp-${msg.id}`}>{msg.timestamp}</p>
                      </div>
                    </div>

                    {/* Message */}
                    <p className="text-white mb-3 leading-relaxed" data-testid={`text-message-${msg.id}`}>{msg.message}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {msg.tags.map((tag: string, i: number) => (
                        <Badge key={`${msg.id}-${tag}-${i}`} data-testid={`badge-tag-${msg.id}-${i}`} className="bg-primary/20 text-primary text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Engagement */}
                    <div className="flex items-center gap-6 pt-4 border-t border-white/10 text-white/60 text-sm">
                      <button data-testid={`button-like-${msg.id}`} className="flex items-center gap-2 hover:text-primary transition-colors group">
                        <Heart className="h-4 w-4 group-hover:fill-primary" />
                        <span>{msg.likes}</span>
                      </button>
                      <button data-testid={`button-comment-${msg.id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{msg.comments}</span>
                      </button>
                      <button data-testid={`button-share-${msg.id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More */}
        {!isLoading && (
          <motion.div variants={itemVariants}>
            <Button data-testid="button-load-more" className="w-full mt-8 bg-white/10 hover:bg-white/15 text-white border border-white/20">
              Load More Posts
            </Button>
          </motion.div>
        )}
      </motion.div>

      <Footer />
    </div>
  );
}
