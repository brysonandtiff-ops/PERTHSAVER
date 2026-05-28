import { useState, useEffect } from 'react';

export function useCurrentTime(updateInterval = 1000) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);
    
    return () => clearInterval(timer);
  }, [updateInterval]);
  
  return currentTime;
}

export function useCurrentDate() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      setCurrentDate(new Date());
    }, msUntilMidnight);
    
    return () => clearTimeout(timer);
  }, [currentDate]);
  
  return currentDate;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-AU', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'Australia/Perth'
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Australia/Perth'
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(then);
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getPerthTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Perth' }));
}

export function isWithinBusinessHours(): boolean {
  const perthTime = getPerthTime();
  const hour = perthTime.getHours();
  const day = perthTime.getDay();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
}

export function getGreeting(): string {
  const hour = getPerthTime().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getLastUpdatedText(lastUpdate: Date | null): string {
  if (!lastUpdate) return 'Not yet updated';
  return `Last updated: ${formatRelativeTime(lastUpdate)}`;
}
