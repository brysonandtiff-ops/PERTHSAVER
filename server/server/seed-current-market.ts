import { db } from "./db";
import { productPrices, deals, fuelPrices } from "@shared/schema";
import { sql } from "drizzle-orm";

const CURRENT_DATE = new Date("2025-11-28");
const EXPIRY_DATE = new Date("2025-12-05");

const perthFuelPrices = [
  { stationName: "Costco Perth Airport", brand: "Costco", address: "27 Dunreath Dr", suburb: "Perth Airport", postcode: "6105", latitude: "-31.9440", longitude: "115.9670", unleadedPrice: 157.6, dieselPrice: 169.9, lpgPrice: null, premiumPrice: 172.9 },
  { stationName: "United Petroleum Welshpool", brand: "United", address: "69 Kewdale Rd", suburb: "Welshpool", postcode: "6106", latitude: "-31.9890", longitude: "115.9430", unleadedPrice: 159.9, dieselPrice: 171.9, lpgPrice: 89.9, premiumPrice: 174.9 },
  { stationName: "Liberty Maddington", brand: "Liberty", address: "2755 Albany Hwy", suburb: "Maddington", postcode: "6109", latitude: "-32.0500", longitude: "115.9920", unleadedPrice: 161.9, dieselPrice: 172.9, lpgPrice: 91.9, premiumPrice: 176.9 },
  { stationName: "Puma Cannington", brand: "Puma", address: "1320 Albany Hwy", suburb: "Cannington", postcode: "6107", latitude: "-32.0170", longitude: "115.9380", unleadedPrice: 163.9, dieselPrice: 174.9, lpgPrice: 92.9, premiumPrice: 178.9 },
  { stationName: "7-Eleven Bentley", brand: "7-Eleven", address: "1136 Albany Hwy", suburb: "Bentley", postcode: "6102", latitude: "-31.9970", longitude: "115.9180", unleadedPrice: 165.9, dieselPrice: 176.9, lpgPrice: null, premiumPrice: 180.9 },
  { stationName: "Shell OTR Pier Street", brand: "Shell", address: "186 Pier St", suburb: "Perth CBD", postcode: "6000", latitude: "-31.9530", longitude: "115.8625", unleadedPrice: 176.9, dieselPrice: 189.9, lpgPrice: null, premiumPrice: 192.9 },
  { stationName: "United Petroleum Northbridge", brand: "United", address: "252 William St", suburb: "Northbridge", postcode: "6003", latitude: "-31.9450", longitude: "115.8590", unleadedPrice: 179.9, dieselPrice: 191.9, lpgPrice: 94.9, premiumPrice: 195.9 },
  { stationName: "BP Highgate", brand: "BP", address: "430 Beaufort St", suburb: "Highgate", postcode: "6003", latitude: "-31.9390", longitude: "115.8720", unleadedPrice: 179.9, dieselPrice: 194.9, lpgPrice: null, premiumPrice: 197.9 },
  { stationName: "Caltex North Perth", brand: "Caltex", address: "1 Fitzgerald St", suburb: "North Perth", postcode: "6006", latitude: "-31.9280", longitude: "115.8580", unleadedPrice: 189.9, dieselPrice: 199.9, lpgPrice: null, premiumPrice: 205.9 },
  { stationName: "Ampol Foodary East Perth", brand: "Ampol", address: "195 Adelaide Tce", suburb: "East Perth", postcode: "6004", latitude: "-31.9560", longitude: "115.8720", unleadedPrice: 189.9, dieselPrice: 199.9, lpgPrice: null, premiumPrice: 207.9 },
  { stationName: "Caltex Subiaco", brand: "Caltex", address: "380 Hay St", suburb: "Subiaco", postcode: "6008", latitude: "-31.9470", longitude: "115.8260", unleadedPrice: 185.9, dieselPrice: 196.9, lpgPrice: null, premiumPrice: 202.9 },
  { stationName: "BP Claremont", brand: "BP", address: "188 Stirling Hwy", suburb: "Claremont", postcode: "6010", latitude: "-31.9810", longitude: "115.7850", unleadedPrice: 183.9, dieselPrice: 195.9, lpgPrice: null, premiumPrice: 200.9 },
  { stationName: "Shell Fremantle", brand: "Shell", address: "265 High St", suburb: "Fremantle", postcode: "6160", latitude: "-32.0570", longitude: "115.7530", unleadedPrice: 178.9, dieselPrice: 190.9, lpgPrice: 93.9, premiumPrice: 196.9 },
  { stationName: "Vibe Joondalup", brand: "Vibe", address: "91 Joondalup Dr", suburb: "Joondalup", postcode: "6027", latitude: "-31.7460", longitude: "115.7660", unleadedPrice: 169.9, dieselPrice: 181.9, lpgPrice: 91.9, premiumPrice: 185.9 },
  { stationName: "Liberty Rockingham", brand: "Liberty", address: "2 Council Ave", suburb: "Rockingham", postcode: "6168", latitude: "-32.2830", longitude: "115.7290", unleadedPrice: 167.9, dieselPrice: 179.9, lpgPrice: 89.9, premiumPrice: 183.9 },
];

const perthGroceryPrices = [
  { category: "groceries", storeName: "Woolworths", productName: "Woolworths Milk 3L Full Cream", price: 4.80, unit: "3L", brand: "Woolworths", discount: 0 },
  { category: "groceries", storeName: "Coles", productName: "Coles Milk 3L Full Cream", price: 4.80, unit: "3L", brand: "Coles", discount: 0 },
  { category: "groceries", storeName: "ALDI", productName: "Farmdale Milk 3L Full Cream", price: 4.39, unit: "3L", brand: "Farmdale", discount: 0 },
  { category: "groceries", storeName: "Woolworths", productName: "Woolworths White Bread 700g", price: 2.40, unit: "700g", brand: "Woolworths", discount: 0 },
  { category: "groceries", storeName: "Coles", productName: "Coles White Bread 700g", price: 2.40, unit: "700g", brand: "Coles", discount: 0 },
  { category: "groceries", storeName: "ALDI", productName: "Bakers Life White Bread 700g", price: 1.79, unit: "700g", brand: "Bakers Life", discount: 0 },
  { category: "groceries", storeName: "Woolworths", productName: "Woolworths Free Range Eggs 12pk", price: 6.90, unit: "12 pack", brand: "Woolworths", discount: 0 },
  { category: "groceries", storeName: "Coles", productName: "Coles Free Range Eggs 12pk", price: 6.50, unit: "12 pack", brand: "Coles", discount: 0 },
  { category: "groceries", storeName: "ALDI", productName: "Lodge Farm Free Range Eggs 12pk", price: 5.99, unit: "12 pack", brand: "Lodge Farm", discount: 0 },
  { category: "groceries", storeName: "Woolworths", productName: "Chicken Breast Fillets 500g", price: 9.50, unit: "500g", brand: "Woolworths", discount: 0 },
  { category: "groceries", storeName: "Coles", productName: "Chicken Breast Fillets 500g", price: 9.50, unit: "500g", brand: "Coles", discount: 0 },
  { category: "groceries", storeName: "ALDI", productName: "Chicken Breast Fillets 500g", price: 8.49, unit: "500g", brand: "ALDI", discount: 0 },
  { category: "groceries", storeName: "Woolworths", productName: "Beef Mince 500g", price: 8.00, unit: "500g", brand: "Woolworths", discount: 0 },
  { category: "groceries", storeName: "Coles", productName: "Beef Mince 500g", price: 8.00, unit: "500g", brand: "Coles", discount: 0 },
  { category: "groceries", storeName: "ALDI", productName: "Beef Mince 500g", price: 7.49, unit: "500g", brand: "ALDI", discount: 0 },
  { category: "groceries", storeName: "Woolworths", productName: "Bulla Creamy Classics Ice Cream 2L", price: 4.75, unit: "2L", brand: "Bulla", discount: 50 },
  { category: "groceries", storeName: "Woolworths", productName: "Allen's Medium Lolly Bags 170-200g", price: 2.50, unit: "170-200g", brand: "Allen's", discount: 50 },
  { category: "groceries", storeName: "Coles", productName: "Omo Laundry Powder 2kg", price: 15.00, unit: "2kg", brand: "Omo", discount: 40 },
  { category: "groceries", storeName: "Coles", productName: "Morning Fresh Dishwashing Liquid 900ml", price: 4.50, unit: "900ml", brand: "Morning Fresh", discount: 35 },
  { category: "groceries", storeName: "Coles", productName: "Sorbent Toilet Paper 24 Pack", price: 12.50, unit: "24 pack", brand: "Sorbent", discount: 38 },
  { category: "groceries", storeName: "Woolworths", productName: "Weet-Bix Breakfast Cereal 575g", price: 4.00, unit: "575g", brand: "Weet-Bix", discount: 20 },
  { category: "groceries", storeName: "Coles", productName: "Weet-Bix Breakfast Cereal 575g", price: 4.00, unit: "575g", brand: "Weet-Bix", discount: 20 },
  { category: "groceries", storeName: "ALDI", productName: "Wheat Biscuits 750g", price: 3.29, unit: "750g", brand: "Aldi", discount: 0 },
  { category: "groceries", storeName: "Woolworths", productName: "Bananas per kg", price: 3.90, unit: "per kg", brand: "Fresh", discount: 0 },
  { category: "groceries", storeName: "Coles", productName: "Bananas per kg", price: 3.90, unit: "per kg", brand: "Fresh", discount: 0 },
  { category: "groceries", storeName: "ALDI", productName: "Bananas per kg", price: 2.99, unit: "per kg", brand: "Fresh", discount: 0 },
  { category: "groceries", storeName: "Woolworths", productName: "Apples Pink Lady per kg", price: 5.90, unit: "per kg", brand: "Fresh", discount: 0 },
  { category: "groceries", storeName: "Coles", productName: "Apples Pink Lady per kg", price: 5.90, unit: "per kg", brand: "Fresh", discount: 0 },
  { category: "groceries", storeName: "ALDI", productName: "Apples Pink Lady per kg", price: 4.99, unit: "per kg", brand: "Fresh", discount: 0 },
  { category: "groceries", storeName: "Woolworths", productName: "Nescafe Blend 43 Instant Coffee 500g", price: 21.00, unit: "500g", brand: "Nescafe", discount: 30 },
  { category: "groceries", storeName: "Coles", productName: "Nescafe Blend 43 Instant Coffee 500g", price: 21.00, unit: "500g", brand: "Nescafe", discount: 30 },
  { category: "groceries", storeName: "ALDI", productName: "Lazzio Instant Coffee 500g", price: 12.99, unit: "500g", brand: "Lazzio", discount: 0 },
  { category: "groceries", storeName: "Woolworths", productName: "Cadbury Dairy Milk Chocolate Block 180g", price: 3.00, unit: "180g", brand: "Cadbury", discount: 50 },
  { category: "groceries", storeName: "Coles", productName: "Cadbury Dairy Milk Chocolate Block 180g", price: 3.00, unit: "180g", brand: "Cadbury", discount: 50 },
  { category: "groceries", storeName: "ALDI", productName: "Choceur Chocolate Block 200g", price: 2.99, unit: "200g", brand: "Choceur", discount: 0 },
  { category: "groceries", storeName: "Woolworths", productName: "Coke Zero 24x375ml Cans", price: 21.99, unit: "24 pack", brand: "Coca-Cola", discount: 25 },
  { category: "groceries", storeName: "Coles", productName: "Coke Zero 24x375ml Cans", price: 21.99, unit: "24 pack", brand: "Coca-Cola", discount: 25 },
];

const perthDeals = [
  { category: "utilities", providerName: "Synergy", dealTitle: "Midday Saver Tariff - Best Electricity Rate", description: "Switch to time-of-use pricing and pay just 8.4c/kWh during off-peak hours (9pm-9am & 9am-3pm). Peak rate 52.5c/kWh (3pm-9pm). Requires smart meter.", priceDetails: "From 8.4c/kWh off-peak", features: ["Free smart meter installation", "Lower overnight rates", "Ideal for EV charging", "Best for flexible usage"], location: "Perth, WA", expiryDate: null, link: "https://www.synergy.net.au", discount: 60, rating: 4.5 },
  { category: "utilities", providerName: "Synergy", dealTitle: "Home Plan A1 - Simple Flat Rate", description: "Standard residential electricity at 30.81c/kWh flat rate all day. Daily supply charge ~$1.05. Simple, predictable billing.", priceDetails: "30.81c/kWh flat", features: ["No peak/off-peak complexity", "Predictable bills", "Standard meter compatible", "Easy to understand"], location: "Perth, WA", expiryDate: null, link: "https://www.synergy.net.au", discount: 0, rating: 4.0 },
  { category: "utilities", providerName: "Kleenheat", dealTitle: "Natural Gas - Best Value", description: "Competitive natural gas rates with daily supply charge of just 27c/day. Usage rate 18.31c/MJ. No lock-in contracts.", priceDetails: "18.31c/MJ + 27c/day supply", features: ["Lowest daily charge", "No exit fees", "Easy online account", "Local WA company"], location: "Perth, WA", expiryDate: null, link: "https://www.kleenheat.com.au", discount: 15, rating: 4.6 },
  { category: "utilities", providerName: "AGL", dealTitle: "Natural Gas Plan", description: "Natural gas with $1.99/day supply charge. Competitive usage rates around 20c/MJ. Bundle with other services for discounts.", priceDetails: "~20c/MJ + $1.99/day supply", features: ["Bundle discounts available", "Rewards program", "24/7 customer support", "Online management"], location: "Perth, WA", expiryDate: null, link: "https://www.agl.com.au", discount: 10, rating: 4.2 },
  { category: "utilities", providerName: "Alinta Energy", dealTitle: "WA Gas Offer", description: "Competitive gas rates for Perth households. Compare your current plan and potentially save up to $200/year.", priceDetails: "Competitive rates", features: ["No lock-in contracts", "Online account management", "Flexible payment options"], location: "Perth, WA", expiryDate: null, link: "https://www.alintaenergy.com.au", discount: 12, rating: 4.1 },
  { category: "groceries", providerName: "Woolworths", dealTitle: "Black Friday Half Price Specials", description: "Hundreds of half-price deals including Bulla ice cream, Allen's lollies, Cadbury chocolate, and household essentials. Valid Nov 26 - Dec 2.", priceDetails: "Up to 50% off", features: ["Half price ice cream", "Half price confectionery", "Everyday Rewards points", "4c/L fuel discount on $30+ spend"], location: "Perth, WA", expiryDate: EXPIRY_DATE, link: "https://www.woolworths.com.au", discount: 50, rating: 4.5 },
  { category: "groceries", providerName: "Coles", dealTitle: "Black Friday Sale - Hundreds of Half Price Items", description: "Massive Black Friday savings on fresh produce, deli items, household essentials. Omo, Morning Fresh, Sorbent and more at huge discounts.", priceDetails: "Up to 50% off", features: ["Half price household items", "Fresh meat specials", "Flybuys bonus points", "Free delivery with Coles Plus"], location: "Perth, WA", expiryDate: EXPIRY_DATE, link: "https://www.coles.com.au", discount: 50, rating: 4.4 },
  { category: "groceries", providerName: "ALDI", dealTitle: "Everyday Low Prices", description: "ALDI's everyday low prices beat major supermarkets on staples. Save 10-30% on groceries compared to Woolworths and Coles.", priceDetails: "10-30% cheaper", features: ["No membership needed", "Quality private labels", "Special Buys Wed & Sat", "Award-winning products"], location: "Perth, WA", expiryDate: null, link: "https://www.aldi.com.au", discount: 25, rating: 4.6 },
  { category: "fuel", providerName: "FuelWatch WA", dealTitle: "Best Time to Fill Up - Tuesday", description: "Perth follows a 7-day fuel price cycle. Tuesday is typically the cheapest day. Wednesday prices spike. Use FuelWatch to check tomorrow's prices at 2:30pm daily.", priceDetails: "Save up to 88c/L", features: ["Free price alerts", "Tomorrow's prices at 2:30pm", "Interactive price map", "Email notifications"], location: "Perth, WA", expiryDate: null, link: "https://www.fuelwatch.wa.gov.au", discount: 20, rating: 4.8 },
  { category: "fuel", providerName: "Costco Perth Airport", dealTitle: "Cheapest Fuel in Perth Metro", description: "Consistently the lowest fuel prices in Perth. Currently ULP 91 at 157.6c/L. Requires Costco membership ($65/year).", priceDetails: "ULP from 157.6c/L", features: ["Lowest prices in Perth", "High-quality fuel", "No ethanol blend issues", "Membership required"], location: "Perth Airport", expiryDate: null, link: "https://www.costco.com.au", discount: 15, rating: 4.7 },
  { category: "fuel", providerName: "Woolworths Fuel Discount", dealTitle: "4c/L Off When You Spend $30+", description: "Earn 4 cents per litre fuel discount at Caltex Woolworths when you spend $30 or more at Woolworths. Stack with Everyday Rewards.", priceDetails: "4c/L off fuel", features: ["Works with Everyday Rewards", "Valid at Caltex Woolworths", "No expiry on vouchers", "Combine with sale shopping"], location: "Perth, WA", expiryDate: null, link: "https://www.woolworths.com.au", discount: 4, rating: 4.3 },
  { category: "fuel", providerName: "Coles Express Flybuys", dealTitle: "Earn Points + Fuel Discounts", description: "Earn Flybuys points on fuel purchases. Redeem points for fuel discounts or shopping. Regular bonus point offers.", priceDetails: "Earn 2 pts/$1 on fuel", features: ["Flybuys points on fuel", "Redeem for discounts", "Bonus point offers", "Combine with grocery shopping"], location: "Perth, WA", expiryDate: null, link: "https://www.coles.com.au", discount: 3, rating: 4.1 },
  { category: "insurance", providerName: "RACWA", dealTitle: "Comprehensive Car Insurance", description: "Award-winning car insurance for WA drivers. Competitive premiums with 24/7 roadside assistance. Multi-policy discounts available.", priceDetails: "From $45/month", features: ["24/7 roadside assist", "New car replacement", "Genuine parts guarantee", "Multi-policy discount"], location: "Perth, WA", expiryDate: null, link: "https://www.rac.com.au", discount: 15, rating: 4.5 },
  { category: "insurance", providerName: "HBF", dealTitle: "Health Insurance for WA Families", description: "WA's own health insurer. Family-friendly health cover with hospital and extras. Get 4 weeks free when you switch.", priceDetails: "From $35/week family", features: ["4 weeks free offer", "No waiting periods transfer", "WA-owned and operated", "Wide provider network"], location: "Perth, WA", expiryDate: new Date("2025-12-31"), link: "https://www.hbf.com.au", discount: 20, rating: 4.4 },
  { category: "internet", providerName: "Aussie Broadband", dealTitle: "NBN 100/20 Unlimited", description: "Australia's highest-rated NBN provider. Unlimited data on NBN 100/20 speeds. No lock-in contracts. Perth support team.", priceDetails: "$79/month", features: ["Unlimited data", "No lock-in contract", "Australian support", "Free modem setup"], location: "Perth, WA", expiryDate: null, link: "https://www.aussiebroadband.com.au", discount: 10, rating: 4.7 },
  { category: "internet", providerName: "Superloop", dealTitle: "NBN 100/40 Family Plan", description: "Fast NBN with better upload speeds. Unlimited data, no lock-in. Great for working from home.", priceDetails: "$85/month", features: ["Better upload speeds", "Unlimited data", "No lock-in", "30-day money back"], location: "Perth, WA", expiryDate: null, link: "https://www.superloop.com", discount: 12, rating: 4.5 },
  { category: "mobile", providerName: "Boost Mobile", dealTitle: "Prepaid 65GB $35/Month", description: "Best value prepaid mobile plan. 65GB data on Telstra 4G/5G network. Unused data rollover.", priceDetails: "$35/month 65GB", features: ["Telstra 4G/5G network", "Data rollover", "International calls", "No lock-in"], location: "Perth, WA", expiryDate: null, link: "https://www.boost.com.au", discount: 25, rating: 4.4 },
  { category: "subscriptions", providerName: "Kayo Sports", dealTitle: "Sports Streaming from $25/month", description: "Stream AFL, NRL, cricket, and more. Watch on multiple devices. Cancel anytime.", priceDetails: "From $25/month", features: ["AFL & NRL live", "Cricket coverage", "Multiple devices", "Cancel anytime"], location: "Perth, WA", expiryDate: null, link: "https://www.kayosports.com.au", discount: 20, rating: 4.3 },
  { category: "dining", providerName: "The Entertainment Book", dealTitle: "2-for-1 Dining & Activities", description: "Get 2-for-1 offers at hundreds of Perth restaurants and attractions. Digital membership works on your phone.", priceDetails: "$69.99/year", features: ["2-for-1 dining", "Attraction discounts", "Digital membership", "New offers regularly"], location: "Perth, WA", expiryDate: new Date("2025-12-31"), link: "https://www.entertainment.com.au", discount: 50, rating: 4.2 },
];

async function seedCurrentMarketData() {
  console.log("Starting Perth market data seed for November 28, 2025...\n");

  try {
    console.log("Seeding fuel prices from FuelWatch data...");
    for (const fuel of perthFuelPrices) {
      await db.insert(fuelPrices).values({
        stationName: fuel.stationName,
        brand: fuel.brand,
        address: fuel.address,
        suburb: fuel.suburb,
        postcode: fuel.postcode,
        latitude: fuel.latitude,
        longitude: fuel.longitude,
        unleadedPrice: fuel.unleadedPrice?.toString() || null,
        dieselPrice: fuel.dieselPrice?.toString() || null,
        lpgPrice: fuel.lpgPrice?.toString() || null,
        premiumPrice: fuel.premiumPrice?.toString() || null,
        priceDate: CURRENT_DATE,
        lastUpdated: CURRENT_DATE,
      }).onConflictDoNothing();
    }
    console.log(`  ✓ Added ${perthFuelPrices.length} fuel station prices`);

    console.log("\nSeeding grocery prices...");
    for (const grocery of perthGroceryPrices) {
      await db.insert(productPrices).values({
        category: grocery.category,
        storeName: grocery.storeName,
        productName: grocery.productName,
        price: grocery.price.toString(),
        unit: grocery.unit,
        brand: grocery.brand,
        discount: grocery.discount?.toString() || null,
        location: "Perth, WA",
        lastUpdated: CURRENT_DATE,
      }).onConflictDoNothing();
    }
    console.log(`  ✓ Added ${perthGroceryPrices.length} grocery product prices`);

    console.log("\nSeeding current deals and offers...");
    for (const deal of perthDeals) {
      await db.insert(deals).values({
        category: deal.category,
        providerName: deal.providerName,
        dealTitle: deal.dealTitle,
        description: deal.description,
        priceDetails: deal.priceDetails,
        features: deal.features,
        location: deal.location,
        expiryDate: deal.expiryDate,
        link: deal.link,
        discount: deal.discount?.toString() || null,
        rating: deal.rating?.toString() || null,
        isActive: true,
        createdAt: CURRENT_DATE,
      }).onConflictDoNothing();
    }
    console.log(`  ✓ Added ${perthDeals.length} deals and offers`);

    console.log("\n========================================");
    console.log("Perth market data seed completed!");
    console.log("========================================");
    console.log("\nData includes:");
    console.log(`  • ${perthFuelPrices.length} fuel stations with current prices`);
    console.log(`  • ${perthGroceryPrices.length} grocery items from Woolworths, Coles, ALDI`);
    console.log(`  • ${perthDeals.length} deals covering utilities, groceries, fuel, insurance, internet`);
    console.log("\nKey highlights:");
    console.log("  • Cheapest fuel: Costco Perth Airport at 157.6c/L");
    console.log("  • Best electricity: Synergy Midday Saver from 8.4c/kWh");
    console.log("  • Best gas: Kleenheat at 18.31c/MJ");
    console.log("  • Grocery savings: ALDI 10-30% cheaper than majors");
    console.log("  • Black Friday specials: Up to 50% off at Woolworths & Coles");

  } catch (error) {
    console.error("Error seeding market data:", error);
    throw error;
  }
}

seedCurrentMarketData()
  .then(() => {
    console.log("\nSeed completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nSeed failed:", error);
    process.exit(1);
  });
