import { format as formatDate } from "date-fns";

export type ExportFormat = "csv" | "json";

export interface ExportOptions {
  filename?: string;
  dateFormat?: string;
}

function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }
  
  const stringValue = String(value);
  
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

function flattenObject(obj: any, prefix = ""): Record<string, any> {
  const flattened: Record<string, any> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        Object.assign(flattened, flattenObject(value, newKey));
      } else if (Array.isArray(value)) {
        flattened[newKey] = JSON.stringify(value);
      } else {
        flattened[newKey] = value;
      }
    }
  }
  
  return flattened;
}

export function generateFilename(type: string, fileFormat: ExportFormat): string {
  const timestamp = formatDate(new Date(), "yyyy-MM-dd_HHmmss");
  return `${type}_${timestamp}.${fileFormat}`;
}

export function exportToCSV(data: any[], options: ExportOptions = {}): void {
  if (!data || data.length === 0) {
    throw new Error("No data to export");
  }
  
  const flattenedData = data.map(item => flattenObject(item));
  
  const headers = Array.from(
    new Set(flattenedData.flatMap(item => Object.keys(item)))
  );
  
  const csvRows = [
    headers.map(h => escapeCSVValue(h)).join(","),
    ...flattenedData.map(row =>
      headers.map(header => {
        const value = row[header];
        if (value instanceof Date) {
          return escapeCSVValue(formatDate(value, options.dateFormat || "yyyy-MM-dd HH:mm:ss"));
        }
        return escapeCSVValue(value);
      }).join(",")
    )
  ];
  
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, options.filename || generateFilename("export", "csv"));
}

export function exportToJSON(data: any, options: ExportOptions = {}): void {
  if (!data) {
    throw new Error("No data to export");
  }
  
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  downloadBlob(blob, options.filename || generateFilename("export", "json"));
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

export function exportSavingsGoals(goals: any[], fileFormat: ExportFormat): void {
  const exportData = goals.map(goal => ({
    "Goal Name": goal.category,
    "Category": goal.category,
    "Target Amount": parseFloat(goal.targetSavings).toFixed(2),
    "Current Amount": parseFloat(goal.currentSavings || 0).toFixed(2),
    "Progress %": ((parseFloat(goal.currentSavings || 0) / parseFloat(goal.targetSavings)) * 100).toFixed(1),
    "Status": goal.isActive ? "active" : "inactive",
    "Deadline": goal.deadline ? formatDate(new Date(goal.deadline), "yyyy-MM-dd") : "No deadline",
    "Notes": goal.notes || "",
  }));
  
  const filename = generateFilename("savings-goals", fileFormat);
  
  if (fileFormat === "csv") {
    exportToCSV(exportData, { filename });
  } else {
    exportToJSON(exportData, { filename });
  }
}

export function exportBills(bills: any[], fileFormat: ExportFormat): void {
  const exportData = bills.map(bill => ({
    "Bill Name": bill.name,
    "Amount": parseFloat(bill.amount).toFixed(2),
    "Due Date": formatDate(new Date(bill.dueDate), "yyyy-MM-dd"),
    "Frequency": bill.frequency,
    "Category": bill.category || "",
    "Status": bill.isPaid ? "Paid" : "Unpaid",
    "Created": formatDate(new Date(bill.createdAt), "yyyy-MM-dd"),
  }));
  
  const filename = generateFilename("bills", fileFormat);
  
  if (fileFormat === "csv") {
    exportToCSV(exportData, { filename });
  } else {
    exportToJSON(exportData, { filename });
  }
}

export function exportPriceAlerts(alerts: any[], fileFormat: ExportFormat): void {
  const exportData = alerts.map(alert => ({
    "Product Name": alert.productName,
    "Store": alert.storeName || "Any Store",
    "Target Price": parseFloat(alert.targetPrice).toFixed(2),
    "Current Price": alert.currentPrice ? parseFloat(alert.currentPrice).toFixed(2) : "N/A",
    "Status": alert.isActive ? "Active" : "Inactive",
    "Created": formatDate(new Date(alert.createdAt), "yyyy-MM-dd"),
  }));
  
  const filename = generateFilename("price-alerts", fileFormat);
  
  if (fileFormat === "csv") {
    exportToCSV(exportData, { filename });
  } else {
    exportToJSON(exportData, { filename });
  }
}

export function exportAnalytics(analyticsData: any, fileFormat: ExportFormat): void {
  const monthlyData = Object.entries(analyticsData.monthlyData || {}).map(([month, amount]) => ({
    Month: month,
    Savings: parseFloat(amount as string).toFixed(2),
  }));
  
  const categoryData = Object.entries(analyticsData.categoryData || {}).map(([category, amount]) => ({
    Category: category,
    Amount: parseFloat(amount as string).toFixed(2),
  }));
  
  const topSources = (analyticsData.topSources || []).map((item: any) => ({
    Source: item.source,
    Amount: parseFloat(item.amount).toFixed(2),
  }));
  
  const exportData = {
    totalSavings: analyticsData.totalSavings,
    monthlyBreakdown: monthlyData,
    categoryBreakdown: categoryData,
    topSources: topSources,
    exportDate: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
  };
  
  const filename = generateFilename("analytics", fileFormat);
  
  if (fileFormat === "csv") {
    const csvSections = [
      "Total Savings," + analyticsData.totalSavings.toFixed(2),
      "",
      "Monthly Breakdown",
      "Month,Savings",
      ...monthlyData.map((row: { Month: string; Savings: string }) => `${row.Month},${row.Savings}`),
      "",
      "Category Breakdown",
      "Category,Amount",
      ...categoryData.map((row: { Category: string; Amount: string }) => `${row.Category},${row.Amount}`),
      "",
      "Top Sources",
      "Source,Amount",
      ...topSources.map((row: { Source: string; Amount: string }) => `${row.Source},${row.Amount}`),
    ];
    
    const csvContent = csvSections.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, filename);
  } else {
    exportToJSON(exportData, { filename });
  }
}

export function exportMealPlans(mealPlans: any[], fileFormat: ExportFormat): void {
  const exportData = mealPlans.map(plan => ({
    "Week Start": formatDate(new Date(plan.weekStart), "yyyy-MM-dd"),
    "Estimated Cost": plan.estimatedCost ? parseFloat(plan.estimatedCost).toFixed(2) : "N/A",
    "Meals": JSON.stringify(plan.meals),
    "Created": formatDate(new Date(plan.createdAt), "yyyy-MM-dd"),
  }));
  
  const filename = generateFilename("meal-plans", fileFormat);
  
  if (fileFormat === "csv") {
    exportToCSV(exportData, { filename });
  } else {
    exportToJSON(exportData, { filename });
  }
}

export function exportReceipts(receipts: any[], fileFormat: ExportFormat): void {
  const exportData = receipts.map(receipt => ({
    "Store": receipt.storeName,
    "Total Amount": parseFloat(receipt.totalAmount).toFixed(2),
    "Purchase Date": formatDate(new Date(receipt.purchaseDate), "yyyy-MM-dd"),
    "Category": receipt.category || "",
    "Items": receipt.items ? JSON.stringify(receipt.items) : "",
    "Created": formatDate(new Date(receipt.createdAt), "yyyy-MM-dd"),
  }));
  
  const filename = generateFilename("receipts", fileFormat);
  
  if (fileFormat === "csv") {
    exportToCSV(exportData, { filename });
  } else {
    exportToJSON(exportData, { filename });
  }
}

export function exportAllUserData(userData: any, fileFormat: ExportFormat): void {
  const allData = {
    exportDate: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
    savingsGoals: userData.goals || [],
    bills: userData.bills || [],
    priceAlerts: userData.priceAlerts || [],
    mealPlans: userData.mealPlans || [],
    receipts: userData.receipts || [],
    subscriptions: userData.subscriptions || [],
    achievements: userData.achievements || [],
    analytics: userData.analytics || {},
  };
  
  const filename = generateFilename("complete-data-export", fileFormat);
  
  if (fileFormat === "json") {
    exportToJSON(allData, { filename });
  } else {
    const csvContent = [
      "Perth Saver - Complete Data Export",
      `Export Date: ${allData.exportDate}`,
      "",
      "=== SAVINGS GOALS ===",
      userData.goals && userData.goals.length > 0 ? 
        ["Category,Target Amount,Current Amount,Progress %,Status,Deadline",
         ...userData.goals.map((g: any) => 
           `${g.category},${parseFloat(g.targetSavings).toFixed(2)},${parseFloat(g.currentSavings || 0).toFixed(2)},${((parseFloat(g.currentSavings || 0) / parseFloat(g.targetSavings)) * 100).toFixed(1)}%,${g.isActive ? 'active' : 'inactive'},${g.deadline ? formatDate(new Date(g.deadline), 'yyyy-MM-dd') : 'No deadline'}`
         )].join("\n") : "No data",
      "",
      "=== BILLS ===",
      userData.bills && userData.bills.length > 0 ?
        ["Bill Name,Amount,Due Date,Frequency,Status",
         ...userData.bills.map((b: any) =>
           `${escapeCSVValue(b.name)},${parseFloat(b.amount).toFixed(2)},${formatDate(new Date(b.dueDate), 'yyyy-MM-dd')},${b.frequency},${b.isPaid ? 'Paid' : 'Unpaid'}`
         )].join("\n") : "No data",
      "",
      "=== PRICE ALERTS ===",
      userData.priceAlerts && userData.priceAlerts.length > 0 ?
        ["Product,Store,Target Price,Status",
         ...userData.priceAlerts.map((a: any) =>
           `${escapeCSVValue(a.productName)},${a.storeName || 'Any'},${parseFloat(a.targetPrice).toFixed(2)},${a.isActive ? 'Active' : 'Inactive'}`
         )].join("\n") : "No data",
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, filename);
  }
}
