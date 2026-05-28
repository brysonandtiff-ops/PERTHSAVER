import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Wifi, Clock } from 'lucide-react';
import { useCurrentTime, formatTime, formatDate, getGreeting } from '@/lib/timeUtils';

interface LiveDataIndicatorProps {
  showTime?: boolean;
  showDate?: boolean;
  showGreeting?: boolean;
  compact?: boolean;
  className?: string;
}

export function LiveDataIndicator({ 
  showTime = true, 
  showDate = false,
  showGreeting = false,
  compact = false,
  className = ''
}: LiveDataIndicatorProps) {
  const currentTime = useCurrentTime(1000);
  const [isLive, setIsLive] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());
  
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setLastSync(new Date());
      setIsLive(true);
    }, 30000);
    
    return () => clearInterval(syncInterval);
  }, []);
  
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <motion.div
          className="w-2 h-2 rounded-full bg-cyan-500"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs text-white/60 font-mono">
          {formatTime(currentTime)}
        </span>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-cyan-500"
          animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs text-cyan-400 font-medium">LIVE</span>
      </motion.div>
      
      {showGreeting && (
        <span className="text-sm text-white/70">{getGreeting()}</span>
      )}
      
      {showTime && (
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white/40" />
          <span className="text-sm text-white/70 font-mono tabular-nums">
            {formatTime(currentTime)}
          </span>
        </div>
      )}
      
      {showDate && (
        <span className="text-sm text-white/50">
          {formatDate(currentTime)}
        </span>
      )}
    </div>
  );
}

export function AutoRefreshBadge({ 
  interval = 30,
  onRefresh,
  className = ''
}: { 
  interval?: number;
  onRefresh?: () => void;
  className?: string;
}) {
  const [countdown, setCountdown] = useState(interval);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setIsRefreshing(true);
          onRefresh?.();
          setTimeout(() => setIsRefreshing(false), 1000);
          return interval;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [interval, onRefresh]);
  
  return (
    <motion.div 
      className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 ${className}`}
      animate={isRefreshing ? { scale: [1, 1.05, 1] } : {}}
    >
      <motion.div
        animate={isRefreshing ? { rotate: 360 } : {}}
        transition={{ duration: 0.5 }}
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'text-cyan-400' : 'text-white/40'}`} />
      </motion.div>
      <span className="text-xs text-white/50 font-mono tabular-nums">
        {isRefreshing ? 'Syncing...' : `${countdown}s`}
      </span>
    </motion.div>
  );
}

export function ConnectionStatus({ className = '' }: { className?: string }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-500/20 border border-slate-500/30 ${className}`}
        >
          <Wifi className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Offline</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
