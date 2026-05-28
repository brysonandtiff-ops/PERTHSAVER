import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Users, UserPlus, Mail, Check, X, Shield, Zap } from "lucide-react";
import { useAuth } from "@/lib/api";
import { PageLoader } from "@/components/PageLoader";
import { AuthRequired } from "@/components/AuthRequired";

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

interface FamilyMember {
  id: string;
  memberId: string;
  relationship?: string;
  status: string;
  premiumAccess: boolean;
  accessLevel: string;
  inviteEmail?: string;
  acceptedAt?: string;
  createdAt: string;
}

export default function FamilyLogins() {
  const { data: user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("spouse");

  const { data: members = [], refetch } = useQuery<FamilyMember[]>({
    queryKey: ["/api/family/members"],
    queryFn: async () => {
      const res = await fetch("/api/family/members");
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      return data.members || [];
    },
    enabled: !!user,
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/family/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, relationship }),
      });
      if (!res.ok) throw new Error("Failed to send invite");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Invite sent successfully!" });
      setEmail("");
      setRelationship("spouse");
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send invite. Try again.",
        variant: "destructive",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await fetch(`/api/family/remove/${memberId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Family member removed" });
      refetch();
    },
  });

  if (authLoading) return <PageLoader />;
  if (!user) return <AuthRequired />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-900/10 py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
      <motion.div
        className="container max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-8 sm:mb-12 text-center" variants={itemVariants}>
          <div className="flex flex-col sm:items-center sm:justify-center gap-2 mb-3 sm:mb-4">
            <Users className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400 mx-auto sm:mx-0" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">Family Logins</h1>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-white/60 max-w-xl mx-auto">
            Grant full app access to family members. They get premium features for free!
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          className="grid grid-cols-1 gap-4 mb-8"
          variants={itemVariants}
        >
          {[
            { icon: Shield, title: "Full Access", text: "All features unlocked" },
            { icon: Zap, title: "Premium Free", text: "No subscription needed" },
            { icon: Users, title: "Shared Savings", text: "See family savings together" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="bg-white/10 border-white/20 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <Icon className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-white/60">{item.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {/* Invite Panel */}
          <motion.div variants={itemVariants}>
            <Card className="glass-strong border-white/15 backdrop-blur-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-purple-400" />
                  Add Family Member
                </CardTitle>
                <CardDescription>Invite someone to your family</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Email Address</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="family@example.com"
                    className="bg-white/10 border-white/20 text-white"
                    data-testid="input-family-email"
                  />
                </div>

                <div>
                  <label className="text-sm text-white/70 mb-2 block">Relationship</label>
                  <Select value={relationship} onValueChange={setRelationship}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950 border-white/20">
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => inviteMutation.mutate()}
                  disabled={!email || inviteMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-background font-semibold"
                  data-testid="button-send-family-invite"
                >
                  {inviteMutation.isPending ? "Sending..." : "Send Invite"}
                </Button>

                <p className="text-xs text-white/50">
                  They'll receive an email to join your family plan
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Members List */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <Card className="glass-strong border-white/15 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  Family Members ({members.length})
                </CardTitle>
                <CardDescription>Manage your family access</CardDescription>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/60">No family members added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member) => (
                      <motion.div
                        key={member.id}
                        className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all"
                        whileHover={{ scale: 1.02 }}
                        data-testid={`card-family-member-${member.id}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">
                              {member.inviteEmail || member.memberId}
                            </p>
                            <Badge
                              className={
                                member.status === "active"
                                  ? "bg-green-500/30 text-green-300"
                                  : "bg-slate-500/30 text-slate-300"
                              }
                            >
                              {member.status === "active" ? "Active" : "Pending"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
                            <span>{member.relationship}</span>
                            {member.premiumAccess && (
                              <>
                                <span>•</span>
                                <span className="text-purple-400">Premium Access</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => removeMutation.mutate(member.id)}
                          disabled={removeMutation.isPending}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          data-testid={`button-remove-family-${member.id}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Info Box */}
        <motion.div
          className="mt-8 p-6 rounded-lg bg-purple-500/10 border border-purple-500/30"
          variants={itemVariants}
        >
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-100 mb-1">How Family Access Works</p>
              <ul className="text-xs text-blue-100/70 space-y-1">
                <li>✓ Each family member has their own account</li>
                <li>✓ They get full app access when you invite them</li>
                <li>✓ All premium features are included at no cost</li>
                <li>✓ You can revoke access anytime</li>
                <li>✓ Separate logins for privacy & security</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
