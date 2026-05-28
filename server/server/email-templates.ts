// Email templates for Perth Saver

export interface WeeklySummaryData {
  userName: string;
  totalSavedThisWeek: number;
  totalSavedAllTime: number;
  topDeals: Array<{ name: string; savings: number; store: string }>;
  fuelSavings: number;
  upcomingBills: Array<{ name: string; amount: number; dueDate: string }>;
  weeklyGoalProgress: number;
  streakDays: number;
}

export function generateWeeklySummaryEmail(data: WeeklySummaryData): { subject: string; html: string; text: string } {
  const subject = `Your Weekly Savings Summary - $${data.totalSavedThisWeek.toFixed(2)} saved!`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Perth Saver Weekly Summary</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0a;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
    <!-- Header -->
    <div style="background: linear-gradient(90deg, #a855f7 0%, #06b6d4 100%); padding: 32px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Perth Saver</h1>
      <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your Weekly Savings Summary</p>
    </div>
    
    <!-- Greeting -->
    <div style="padding: 32px;">
      <p style="color: #ffffff; font-size: 18px; margin: 0 0 24px;">Hi ${data.userName}! 👋</p>
      
      <!-- Main Stat -->
      <div style="background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0 0 8px;">You saved this week</p>
        <p style="color: #a855f7; font-size: 48px; font-weight: bold; margin: 0;">$${data.totalSavedThisWeek.toFixed(2)}</p>
        <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 8px 0 0;">Total saved all time: $${data.totalSavedAllTime.toFixed(2)}</p>
      </div>
      
      <!-- Stats Grid -->
      <div style="display: flex; gap: 16px; margin-bottom: 24px;">
        <div style="flex: 1; background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
          <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0 0 4px;">🔥 Streak</p>
          <p style="color: #06b6d4; font-size: 24px; font-weight: bold; margin: 0;">${data.streakDays} days</p>
        </div>
        <div style="flex: 1; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
          <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0 0 4px;">⛽ Fuel Saved</p>
          <p style="color: #10b981; font-size: 24px; font-weight: bold; margin: 0;">$${data.fuelSavings.toFixed(2)}</p>
        </div>
      </div>
      
      <!-- Top Deals -->
      ${data.topDeals.length > 0 ? `
      <div style="margin-bottom: 24px;">
        <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 12px;">🏷️ Top Deals You Used</h3>
        ${data.topDeals.map(deal => `
        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <p style="color: #ffffff; font-size: 14px; margin: 0;">${deal.name}</p>
            <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 4px 0 0;">${deal.store}</p>
          </div>
          <p style="color: #10b981; font-size: 16px; font-weight: bold; margin: 0;">-$${deal.savings.toFixed(2)}</p>
        </div>
        `).join('')}
      </div>
      ` : ''}
      
      <!-- Upcoming Bills -->
      ${data.upcomingBills.length > 0 ? `
      <div style="margin-bottom: 24px;">
        <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 12px;">📅 Upcoming Bills</h3>
        ${data.upcomingBills.map(bill => `
        <div style="background: rgba(251, 146, 60, 0.1); border-left: 3px solid #fb923c; padding: 12px; margin-bottom: 8px;">
          <p style="color: #ffffff; font-size: 14px; margin: 0;">${bill.name} - $${bill.amount.toFixed(2)}</p>
          <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 4px 0 0;">Due: ${bill.dueDate}</p>
        </div>
        `).join('')}
      </div>
      ` : ''}
      
      <!-- CTA -->
      <div style="text-align: center; margin-top: 32px;">
        <a href="https://perthsaver.com.au/dashboard" style="display: inline-block; background: linear-gradient(90deg, #a855f7 0%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">View Full Dashboard</a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background: rgba(0,0,0,0.3); padding: 24px; text-align: center;">
      <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0 0 8px;">Perth Saver - Saving Perth residents $15K-25K annually</p>
      <p style="color: rgba(255,255,255,0.3); font-size: 10px; margin: 0;">
        <a href="https://perthsaver.com.au/settings/notifications" style="color: rgba(255,255,255,0.4);">Unsubscribe</a> | 
        <a href="https://perthsaver.com.au/privacy" style="color: rgba(255,255,255,0.4);">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Perth Saver Weekly Summary

Hi ${data.userName}!

You saved $${data.totalSavedThisWeek.toFixed(2)} this week!
Total saved all time: $${data.totalSavedAllTime.toFixed(2)}

🔥 Streak: ${data.streakDays} days
⛽ Fuel Savings: $${data.fuelSavings.toFixed(2)}

${data.topDeals.length > 0 ? `Top Deals:
${data.topDeals.map(d => `- ${d.name} at ${d.store}: -$${d.savings.toFixed(2)}`).join('\n')}` : ''}

${data.upcomingBills.length > 0 ? `Upcoming Bills:
${data.upcomingBills.map(b => `- ${b.name}: $${b.amount.toFixed(2)} due ${b.dueDate}`).join('\n')}` : ''}

View your full dashboard: https://perthsaver.com.au/dashboard

---
Perth Saver - Saving Perth residents $15K-25K annually
  `.trim();

  return { subject, html, text };
}

export interface DealAlertData {
  userName: string;
  dealName: string;
  originalPrice: number;
  salePrice: number;
  store: string;
  expiresAt: string;
}

export function generateDealAlertEmail(data: DealAlertData): { subject: string; html: string; text: string } {
  const savings = data.originalPrice - data.salePrice;
  const percentOff = Math.round((savings / data.originalPrice) * 100);
  
  const subject = `🏷️ ${data.dealName} - ${percentOff}% OFF at ${data.store}!`;
  
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #0a0a0a; margin: 0; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: #1a1a2e; border-radius: 12px; overflow: hidden;">
    <div style="background: linear-gradient(90deg, #a855f7, #06b6d4); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🏷️ Deal Alert!</h1>
    </div>
    <div style="padding: 24px;">
      <p style="color: white; font-size: 16px;">Hi ${data.userName},</p>
      <h2 style="color: #a855f7; font-size: 20px;">${data.dealName}</h2>
      <p style="color: white;">
        <span style="text-decoration: line-through; color: #888;">$${data.originalPrice.toFixed(2)}</span>
        <span style="color: #10b981; font-size: 24px; font-weight: bold; margin-left: 8px;">$${data.salePrice.toFixed(2)}</span>
      </p>
      <p style="color: #06b6d4; font-weight: bold;">Save $${savings.toFixed(2)} (${percentOff}% OFF)</p>
      <p style="color: #888;">At ${data.store} • Expires ${data.expiresAt}</p>
      <a href="https://perthsaver.com.au/deals" style="display: inline-block; background: #a855f7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">View Deal</a>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `Deal Alert: ${data.dealName} - ${percentOff}% OFF at ${data.store}!\n\nWas: $${data.originalPrice.toFixed(2)}\nNow: $${data.salePrice.toFixed(2)}\nSave: $${savings.toFixed(2)}\n\nExpires: ${data.expiresAt}\n\nView deal: https://perthsaver.com.au/deals`;

  return { subject, html, text };
}
