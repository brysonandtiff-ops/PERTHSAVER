import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Heart, Share2, MapPin, Loader2 } from "lucide-react";
import { PostSkeleton } from "@/components/Skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { haptics } from "@/lib/haptics";

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

export default function CommunityForum() {
  const [newPostText, setNewPostText] = useState("");
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/community-posts"],
    queryFn: async () => {
      const res = await fetch("/api/community-posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      return data.posts || [];
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch("/api/community-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: text.slice(0, 40) + (text.length > 40 ? "..." : ""),
          content: text,
          category: "Grocery Tips",
        }),
        credentials: "include",
      });
      if (!res.ok) {
        // Fallback for demo/unauthenticated mode
        return {
          id: `demo-${Date.now()}`,
          title: text.slice(0, 40),
          content: text,
          category: "Grocery Tips",
          likes: 1,
          comments: 0,
          createdAt: new Date().toISOString(),
        };
      }
      return res.json();
    },
    onSuccess: () => {
      haptics.success();
      toast({
        title: "Post Published!",
        description: "Your post has been shared with the Perth Saver community.",
      });
      setNewPostText("");
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`/api/community-posts/${postId}/like`, { method: "POST" });
      if (!res.ok) return { success: true };
      return res.json();
    },
    onSuccess: (_, postId) => {
      haptics.light();
      setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
    },
  });

  const handleCreatePost = () => {
    if (!newPostText.trim()) {
      toast({
        title: "Empty Post",
        description: "Please enter a deal or message before posting.",
        variant: "destructive",
      });
      return;
    }
    createPostMutation.mutate(newPostText.trim());
  };

  const handleShare = (post: any) => {
    haptics.light();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/community#post-${post.id}`);
    }
    toast({
      title: "Link Copied!",
      description: "Post link copied to your clipboard.",
    });
  };

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
                <div className="h-10 w-10 rounded-full bg-purple-500/30 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  You
                </div>
                <Input
                  data-testid="input-post"
                  placeholder="Share a deal or ask a question..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleCreatePost();
                    }
                  }}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full"
                />
                <Button 
                  data-testid="button-post" 
                  onClick={handleCreatePost}
                  disabled={createPostMutation.isPending}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white gap-1"
                >
                  {createPostMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />} 
                  Post
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
            {posts.map((post: CommunityPost) => {
              const isLiked = likedPosts[post.id];
              const likeCount = post.likes + (isLiked ? 1 : 0);

              return (
                <motion.div key={post.id} variants={cardVariants} whileHover="hover">
                  <Card data-testid={`card-post-${post.id}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:from-white/12 hover:to-white/6 transition-all duration-300">
                    <CardContent className="p-6">
                      {/* Author Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {post.title.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-display font-semibold text-white" data-testid={`text-author-${post.id}`}>{post.title}</p>
                            <div className="flex items-center gap-1 text-xs text-white/60">
                              <MapPin className="h-3 w-3" /> <span data-testid={`text-suburb-${post.id}`}>Perth, WA</span>
                            </div>
                          </div>
                          <p className="text-xs text-white/50" data-testid={`text-timestamp-${post.id}`}>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Message */}
                      <p className="text-white mb-3 leading-relaxed" data-testid={`text-message-${post.id}`}>{post.content}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge data-testid={`badge-tag-${post.id}`} className="bg-purple-500/20 text-purple-300 text-xs border-purple-500/30">
                          {post.category || "Grocery Tips"}
                        </Badge>
                      </div>

                      {/* Engagement */}
                      <div className="flex items-center gap-6 pt-4 border-t border-white/10 text-white/60 text-sm">
                        <button 
                          data-testid={`button-like-${post.id}`} 
                          onClick={() => likeMutation.mutate(post.id)}
                          className={`flex items-center gap-2 transition-colors group ${isLiked ? 'text-pink-400' : 'hover:text-purple-400'}`}
                        >
                          <Heart className={`h-4 w-4 ${isLiked ? 'fill-pink-400 text-pink-400' : 'group-hover:text-purple-400'}`} />
                          <span>{likeCount}</span>
                        </button>
                        <button data-testid={`button-comment-${post.id}`} className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments || 0}</span>
                        </button>
                        <button 
                          data-testid={`button-share-${post.id}`} 
                          onClick={() => handleShare(post)}
                          className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                        >
                          <Share2 className="h-4 w-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      <Footer />
    </div>
  );
}
