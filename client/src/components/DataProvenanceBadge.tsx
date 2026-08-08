import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, ShieldCheck, HelpCircle, Clock, AlertTriangle } from "lucide-react";

export type ConfidenceLevel = "official" | "verified" | "partner" | "community" | "estimated";

export interface DataProvenanceBadgeProps {
  sourceName: string;
  confidence?: ConfidenceLevel;
  fetchedAt?: string;
  isStale?: boolean;
  className?: string;
}

export const DataProvenanceBadge: React.FC<DataProvenanceBadgeProps> = ({
  sourceName,
  confidence = "verified",
  fetchedAt,
  isStale = false,
  className = "",
}) => {
  const getConfidenceConfig = () => {
    switch (confidence) {
      case "official":
        return {
          label: "Official WA Data",
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          icon: ShieldCheck,
        };
      case "verified":
        return {
          label: "Verified Source",
          color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
          icon: CheckCircle2,
        };
      case "community":
        return {
          label: "Community Reported",
          color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          icon: HelpCircle,
        };
      case "estimated":
      default:
        return {
          label: "Estimated Model",
          color: "bg-slate-500/10 text-slate-400 border-slate-500/30",
          icon: Clock,
        };
    }
  };

  const config = getConfidenceConfig();
  const Icon = config.icon;
  const formattedDate = fetchedAt ? new Date(fetchedAt).toLocaleDateString("en-AU", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`inline-flex items-center gap-1.5 ${className}`}>
          <Badge className={`text-[11px] font-medium border px-2 py-0.5 rounded-full flex items-center gap-1 ${config.color}`}>
            <Icon className="w-3 h-3" />
            <span>{sourceName}</span>
          </Badge>
          {isStale && (
            <Badge className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0 flex items-center gap-0.5">
              <AlertTriangle className="w-2.5 h-2.5" />
              <span>Stale</span>
            </Badge>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2.5 max-w-xs space-y-1">
        <p className="font-semibold text-white">{config.label}</p>
        <p className="text-slate-400">Data provided by <span className="text-slate-200">{sourceName}</span>.</p>
        {formattedDate && <p className="text-[11px] text-slate-400">Last synced: {formattedDate}</p>}
      </TooltipContent>
    </Tooltip>
  );
};
