import { db } from "./db";
import { stores, products, storeProducts, promoCodes } from "@shared/schema";

const STORES_DATA = [
  { name: "Woolworths", slug: "woolworths", type: "grocery", website: "https://www.woolworths.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 3, qualityRating: 4, description: "Australia's largest supermarket chain" },
  { name: "Coles", slug: "coles", type: "grocery", website: "https://www.coles.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 3, qualityRating: 4, description: "Major Australian supermarket" },
  { name: "ALDI", slug: "aldi", type: "grocery", website: "https://www.aldi.com.au", isLocal: false, hasOnlineStore: false, hasPhysicalStore: true, deliveryAvailable: false, clickAndCollect: false, priceRating: 1, qualityRating: 4, description: "German discount supermarket" },
  { name: "Spudshed", slug: "spudshed", type: "grocery", website: "https://www.spudshed.com.au", isLocal: true, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 1, qualityRating: 4, description: "WA-owned fresh produce and grocery retailer" },
  { name: "IGA", slug: "iga", type: "grocery", website: "https://www.iga.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 4, qualityRating: 4, description: "Independent grocers" },
  { name: "Farmer Jack's", slug: "farmer-jacks", type: "grocery", website: "https://www.farmerjacks.com.au", isLocal: true, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 2, qualityRating: 5, description: "WA fresh food supermarkets" },
  { name: "Costco", slug: "costco", type: "grocery", website: "https://www.costco.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: false, clickAndCollect: false, priceRating: 1, qualityRating: 4, description: "Bulk wholesale retailer" },
  { name: "JB Hi-Fi", slug: "jb-hifi", type: "electronics", website: "https://www.jbhifi.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 2, qualityRating: 4, description: "Electronics and entertainment" },
  { name: "Harvey Norman", slug: "harvey-norman", type: "electronics", website: "https://www.harveynorman.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 3, qualityRating: 4, description: "Tech, furniture and appliances" },
  { name: "The Good Guys", slug: "the-good-guys", type: "electronics", website: "https://www.thegoodguys.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 2, qualityRating: 4, description: "Appliances and electronics" },
  { name: "Bunnings", slug: "bunnings", type: "home", website: "https://www.bunnings.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 3, qualityRating: 4, description: "Hardware and home improvement" },
  { name: "Kmart", slug: "kmart", type: "retail", website: "https://www.kmart.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 1, qualityRating: 3, description: "Affordable everyday items" },
  { name: "Target", slug: "target", type: "retail", website: "https://www.target.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 2, qualityRating: 3, description: "Fashion and homewares" },
  { name: "Big W", slug: "big-w", type: "retail", website: "https://www.bigw.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 2, qualityRating: 3, description: "Discount department store" },
  { name: "Chemist Warehouse", slug: "chemist-warehouse", type: "pharmacy", website: "https://www.chemistwarehouse.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: true, deliveryAvailable: true, clickAndCollect: true, priceRating: 1, qualityRating: 4, description: "Discount pharmacy" },
  { name: "Amazon AU", slug: "amazon-au", type: "online", website: "https://www.amazon.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: false, deliveryAvailable: true, clickAndCollect: false, priceRating: 2, qualityRating: 4, description: "Everything store" },
  { name: "eBay AU", slug: "ebay-au", type: "online", website: "https://www.ebay.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: false, deliveryAvailable: true, clickAndCollect: false, priceRating: 2, qualityRating: 3, description: "Online marketplace" },
  { name: "Catch", slug: "catch", type: "online", website: "https://www.catch.com.au", isLocal: false, hasOnlineStore: true, hasPhysicalStore: false, deliveryAvailable: true, clickAndCollect: false, priceRating: 1, qualityRating: 3, description: "Daily deals" },
];

const PRODUCTS_DATA = [
  // Fruits
  { name: "Bananas", brand: "Fresh", category: "fruits", subcategory: "tropical", unit: "kg", size: "1kg" },
  { name: "Royal Gala Apples", brand: "Fresh", category: "fruits", subcategory: "apples", unit: "kg", size: "1kg" },
  { name: "Navel Oranges", brand: "Fresh", category: "fruits", subcategory: "citrus", unit: "kg", size: "1kg" },
  { name: "Strawberries", brand: "Fresh", category: "fruits", subcategory: "berries", unit: "punnet", size: "250g" },
  { name: "Blueberries", brand: "Fresh", category: "fruits", subcategory: "berries", unit: "punnet", size: "125g" },
  { name: "Avocados", brand: "Fresh", category: "fruits", subcategory: "tropical", unit: "each", size: "each" },
  { name: "Grapes Red Seedless", brand: "Fresh", category: "fruits", subcategory: "grapes", unit: "kg", size: "500g" },
  { name: "Watermelon", brand: "Fresh", category: "fruits", subcategory: "melon", unit: "kg", size: "per kg" },
  { name: "Mangoes", brand: "Fresh", category: "fruits", subcategory: "tropical", unit: "each", size: "each" },
  { name: "Lemons", brand: "Fresh", category: "fruits", subcategory: "citrus", unit: "each", size: "each" },
  // Vegetables
  { name: "Potatoes Washed", brand: "Fresh", category: "vegetables", subcategory: "root", unit: "kg", size: "2kg" },
  { name: "Brown Onions", brand: "Fresh", category: "vegetables", subcategory: "allium", unit: "kg", size: "1kg" },
  { name: "Carrots", brand: "Fresh", category: "vegetables", subcategory: "root", unit: "kg", size: "1kg" },
  { name: "Broccoli", brand: "Fresh", category: "vegetables", subcategory: "brassica", unit: "each", size: "each" },
  { name: "Iceberg Lettuce", brand: "Fresh", category: "vegetables", subcategory: "leafy", unit: "each", size: "each" },
  { name: "Tomatoes", brand: "Fresh", category: "vegetables", subcategory: "fruit_veg", unit: "kg", size: "500g" },
  { name: "Cucumber Lebanese", brand: "Fresh", category: "vegetables", subcategory: "fruit_veg", unit: "each", size: "each" },
  { name: "Capsicum Red", brand: "Fresh", category: "vegetables", subcategory: "fruit_veg", unit: "each", size: "each" },
  { name: "Mushrooms Cup", brand: "Fresh", category: "vegetables", subcategory: "fungi", unit: "pack", size: "200g" },
  { name: "Garlic", brand: "Fresh", category: "vegetables", subcategory: "allium", unit: "each", size: "each" },
  // Dairy
  { name: "Full Cream Milk", brand: "Brownes", category: "dairy", subcategory: "milk", unit: "L", size: "2L" },
  { name: "Lite Milk", brand: "Brownes", category: "dairy", subcategory: "milk", unit: "L", size: "2L" },
  { name: "Greek Yoghurt", brand: "Chobani", category: "dairy", subcategory: "yoghurt", unit: "pack", size: "500g" },
  { name: "Tasty Cheese Block", brand: "Bega", category: "dairy", subcategory: "cheese", unit: "pack", size: "500g" },
  { name: "Butter Salted", brand: "Western Star", category: "dairy", subcategory: "butter", unit: "pack", size: "500g" },
  { name: "Free Range Eggs", brand: "Sunny Queen", category: "dairy", subcategory: "eggs", unit: "dozen", size: "12 pack" },
  { name: "Thickened Cream", brand: "Bulla", category: "dairy", subcategory: "cream", unit: "mL", size: "300mL" },
  { name: "Sour Cream", brand: "Dairy Farmers", category: "dairy", subcategory: "cream", unit: "mL", size: "300mL" },
  // Meat
  { name: "Chicken Breast", brand: "Lilydale", category: "meat", subcategory: "poultry", unit: "kg", size: "per kg" },
  { name: "Beef Mince", brand: "Coles", category: "meat", subcategory: "beef", unit: "pack", size: "500g" },
  { name: "Lamb Cutlets", brand: "Woolworths", category: "meat", subcategory: "lamb", unit: "kg", size: "per kg" },
  { name: "Pork Chops", brand: "Woolworths", category: "meat", subcategory: "pork", unit: "kg", size: "per kg" },
  { name: "Bacon Rashers", brand: "D'Orsogna", category: "meat", subcategory: "smallgoods", unit: "pack", size: "250g" },
  { name: "Sausages Beef", brand: "Primo", category: "meat", subcategory: "smallgoods", unit: "pack", size: "500g" },
  // Pantry
  { name: "White Rice", brand: "SunRice", category: "pantry", subcategory: "grains", unit: "kg", size: "2kg" },
  { name: "Pasta Spaghetti", brand: "San Remo", category: "pantry", subcategory: "pasta", unit: "pack", size: "500g" },
  { name: "Olive Oil Extra Virgin", brand: "Cobram Estate", category: "pantry", subcategory: "oils", unit: "mL", size: "750mL" },
  { name: "Diced Tomatoes", brand: "Leggo's", category: "pantry", subcategory: "canned", unit: "can", size: "400g" },
  { name: "Baked Beans", brand: "Heinz", category: "pantry", subcategory: "canned", unit: "can", size: "420g" },
  { name: "Tuna in Springwater", brand: "John West", category: "pantry", subcategory: "canned", unit: "can", size: "95g" },
  { name: "Peanut Butter", brand: "Kraft", category: "pantry", subcategory: "spreads", unit: "jar", size: "500g" },
  { name: "Vegemite", brand: "Bega", category: "pantry", subcategory: "spreads", unit: "jar", size: "220g" },
  { name: "Honey", brand: "Capilano", category: "pantry", subcategory: "spreads", unit: "jar", size: "500g" },
  { name: "Sugar White", brand: "CSR", category: "pantry", subcategory: "baking", unit: "kg", size: "1kg" },
  { name: "Plain Flour", brand: "White Wings", category: "pantry", subcategory: "baking", unit: "kg", size: "1kg" },
  { name: "Instant Coffee", brand: "Nescafe", category: "pantry", subcategory: "beverages", unit: "jar", size: "150g" },
  { name: "Tea Bags", brand: "Dilmah", category: "pantry", subcategory: "beverages", unit: "pack", size: "100 bags" },
  // Bread & Bakery
  { name: "White Bread", brand: "Tip Top", category: "bakery", subcategory: "bread", unit: "loaf", size: "700g" },
  { name: "Wholemeal Bread", brand: "Helga's", category: "bakery", subcategory: "bread", unit: "loaf", size: "650g" },
  { name: "Wraps", brand: "Mission", category: "bakery", subcategory: "flatbread", unit: "pack", size: "8 pack" },
  { name: "Croissants", brand: "Woolworths", category: "bakery", subcategory: "pastry", unit: "pack", size: "4 pack" },
  // Frozen
  { name: "Frozen Peas", brand: "Birds Eye", category: "frozen", subcategory: "vegetables", unit: "pack", size: "500g" },
  { name: "Fish Fingers", brand: "Birds Eye", category: "frozen", subcategory: "seafood", unit: "pack", size: "375g" },
  { name: "Chicken Nuggets", brand: "Steggles", category: "frozen", subcategory: "poultry", unit: "pack", size: "400g" },
  { name: "Frozen Pizza Margherita", brand: "McCain", category: "frozen", subcategory: "meals", unit: "pack", size: "500g" },
  { name: "Ice Cream Vanilla", brand: "Streets", category: "frozen", subcategory: "desserts", unit: "tub", size: "2L" },
  // Drinks
  { name: "Coca-Cola", brand: "Coca-Cola", category: "drinks", subcategory: "soft_drinks", unit: "pack", size: "24x375mL" },
  { name: "Orange Juice", brand: "Nudie", category: "drinks", subcategory: "juice", unit: "bottle", size: "2L" },
  { name: "Mineral Water", brand: "Mount Franklin", category: "drinks", subcategory: "water", unit: "pack", size: "24x600mL" },
  // Snacks
  { name: "Potato Chips Original", brand: "Smith's", category: "snacks", subcategory: "chips", unit: "pack", size: "170g" },
  { name: "Tim Tam Chocolate", brand: "Arnott's", category: "snacks", subcategory: "biscuits", unit: "pack", size: "200g" },
  { name: "Shapes BBQ", brand: "Arnott's", category: "snacks", subcategory: "crackers", unit: "pack", size: "175g" },
  { name: "Cadbury Dairy Milk", brand: "Cadbury", category: "snacks", subcategory: "chocolate", unit: "block", size: "180g" },
  // Household
  { name: "Toilet Paper", brand: "Quilton", category: "household", subcategory: "bathroom", unit: "pack", size: "12 rolls" },
  { name: "Paper Towels", brand: "Viva", category: "household", subcategory: "cleaning", unit: "pack", size: "3 rolls" },
  { name: "Dishwashing Liquid", brand: "Fairy", category: "household", subcategory: "cleaning", unit: "bottle", size: "500mL" },
  { name: "Laundry Detergent", brand: "OMO", category: "household", subcategory: "laundry", unit: "bottle", size: "2L" },
  { name: "Surface Spray", brand: "Dettol", category: "household", subcategory: "cleaning", unit: "bottle", size: "500mL" },
  // Personal Care
  { name: "Shampoo", brand: "Pantene", category: "personal_care", subcategory: "hair", unit: "bottle", size: "350mL" },
  { name: "Toothpaste", brand: "Colgate", category: "personal_care", subcategory: "dental", unit: "tube", size: "175g" },
  { name: "Deodorant", brand: "Rexona", category: "personal_care", subcategory: "body", unit: "can", size: "150g" },
  { name: "Body Wash", brand: "Dove", category: "personal_care", subcategory: "body", unit: "bottle", size: "400mL" },
  // Baby
  { name: "Nappies", brand: "Huggies", category: "baby", subcategory: "nappies", unit: "pack", size: "64 pack" },
  { name: "Baby Formula", brand: "Aptamil", category: "baby", subcategory: "formula", unit: "tin", size: "900g" },
  { name: "Baby Wipes", brand: "Huggies", category: "baby", subcategory: "wipes", unit: "pack", size: "80 pack" },
  // Pet
  { name: "Dog Food Dry", brand: "Pedigree", category: "pet", subcategory: "dog", unit: "bag", size: "3kg" },
  { name: "Cat Food Wet", brand: "Whiskas", category: "pet", subcategory: "cat", unit: "pack", size: "12x85g" },
];

// Price variations per store (multipliers)
const STORE_PRICE_MULTIPLIERS: Record<string, number> = {
  "woolworths": 1.0,
  "coles": 0.98,
  "aldi": 0.75,
  "spudshed": 0.70,
  "iga": 1.15,
  "farmer-jacks": 0.85,
  "costco": 0.65,
};

// Base prices for products (AUD)
const BASE_PRICES: Record<string, number> = {
  "Bananas": 3.90,
  "Royal Gala Apples": 5.50,
  "Navel Oranges": 4.90,
  "Strawberries": 4.50,
  "Blueberries": 5.00,
  "Avocados": 2.50,
  "Grapes Red Seedless": 6.90,
  "Watermelon": 2.50,
  "Mangoes": 3.00,
  "Lemons": 0.80,
  "Potatoes Washed": 5.50,
  "Brown Onions": 3.50,
  "Carrots": 2.90,
  "Broccoli": 4.50,
  "Iceberg Lettuce": 2.90,
  "Tomatoes": 7.90,
  "Cucumber Lebanese": 1.50,
  "Capsicum Red": 2.50,
  "Mushrooms Cup": 4.50,
  "Garlic": 0.90,
  "Full Cream Milk": 3.60,
  "Lite Milk": 3.60,
  "Greek Yoghurt": 6.50,
  "Tasty Cheese Block": 9.50,
  "Butter Salted": 7.50,
  "Free Range Eggs": 7.50,
  "Thickened Cream": 3.50,
  "Sour Cream": 2.90,
  "Chicken Breast": 12.00,
  "Beef Mince": 8.50,
  "Lamb Cutlets": 28.00,
  "Pork Chops": 14.00,
  "Bacon Rashers": 6.50,
  "Sausages Beef": 7.00,
  "White Rice": 6.50,
  "Pasta Spaghetti": 2.50,
  "Olive Oil Extra Virgin": 12.00,
  "Diced Tomatoes": 1.50,
  "Baked Beans": 2.00,
  "Tuna in Springwater": 2.50,
  "Peanut Butter": 5.50,
  "Vegemite": 5.00,
  "Honey": 8.50,
  "Sugar White": 2.50,
  "Plain Flour": 2.00,
  "Instant Coffee": 12.00,
  "Tea Bags": 6.50,
  "White Bread": 3.50,
  "Wholemeal Bread": 4.50,
  "Wraps": 4.00,
  "Croissants": 5.00,
  "Frozen Peas": 3.00,
  "Fish Fingers": 6.50,
  "Chicken Nuggets": 6.00,
  "Frozen Pizza Margherita": 7.00,
  "Ice Cream Vanilla": 9.00,
  "Coca-Cola": 22.00,
  "Orange Juice": 6.00,
  "Mineral Water": 15.00,
  "Potato Chips Original": 4.50,
  "Tim Tam Chocolate": 4.00,
  "Shapes BBQ": 3.50,
  "Cadbury Dairy Milk": 5.50,
  "Toilet Paper": 12.00,
  "Paper Towels": 5.50,
  "Dishwashing Liquid": 4.00,
  "Laundry Detergent": 18.00,
  "Surface Spray": 5.00,
  "Shampoo": 8.00,
  "Toothpaste": 5.50,
  "Deodorant": 6.00,
  "Body Wash": 7.00,
  "Nappies": 32.00,
  "Baby Formula": 28.00,
  "Baby Wipes": 4.50,
  "Dog Food Dry": 18.00,
  "Cat Food Wet": 12.00,
};

const PROMO_CODES_DATA = [
  // Major Retailers - Public Codes
  { storeName: "Amazon AU", storeUrl: "amazon.com.au", storeCategory: "online", code: "FIRST10", description: "10% off your first order", discountType: "percentage", discountValue: 10, minPurchase: 50, isVerified: true, isHidden: false, isNewUser: true, successRate: 95, source: "affiliate" },
  { storeName: "Amazon AU", storeUrl: "amazon.com.au", storeCategory: "online", code: "PRIME5", description: "$5 off for Prime members", discountType: "fixed", discountValue: 5, minPurchase: 30, isVerified: true, isHidden: false, successRate: 90, source: "affiliate" },
  { storeName: "eBay AU", storeUrl: "ebay.com.au", storeCategory: "online", code: "PLUSNOV", description: "15% off eligible items", discountType: "percentage", discountValue: 15, maxDiscount: 100, isVerified: true, isHidden: false, successRate: 85, source: "affiliate" },
  { storeName: "eBay AU", storeUrl: "ebay.com.au", storeCategory: "online", code: "PNOV24", description: "20% off select sellers", discountType: "percentage", discountValue: 20, maxDiscount: 150, isVerified: true, isHidden: true, successRate: 78, source: "scraped" },
  { storeName: "Catch", storeUrl: "catch.com.au", storeCategory: "online", code: "CATCH20", description: "20% off sitewide", discountType: "percentage", discountValue: 20, maxDiscount: 50, isVerified: true, isHidden: false, successRate: 88, source: "affiliate" },
  { storeName: "Catch", storeUrl: "catch.com.au", storeCategory: "online", code: "XMASCLUB", description: "Extra 25% for Club Catch members", discountType: "percentage", discountValue: 25, maxDiscount: 100, isVerified: true, isHidden: true, successRate: 72, source: "community" },
  // Electronics
  { storeName: "JB Hi-Fi", storeUrl: "jbhifi.com.au", storeCategory: "electronics", code: "JBPERKS", description: "$20 off $100+ spend", discountType: "fixed", discountValue: 20, minPurchase: 100, isVerified: true, isHidden: false, successRate: 92, source: "affiliate" },
  { storeName: "JB Hi-Fi", storeUrl: "jbhifi.com.au", storeCategory: "electronics", code: "STAFFSALE", description: "Staff discount 18% off", discountType: "percentage", discountValue: 18, isVerified: false, isHidden: true, successRate: 45, source: "community" },
  { storeName: "Harvey Norman", storeUrl: "harveynorman.com.au", storeCategory: "electronics", code: "HNFREE", description: "Free delivery on $500+", discountType: "freeShipping", discountValue: 0, minPurchase: 500, isVerified: true, isHidden: false, successRate: 95, source: "manual" },
  { storeName: "Harvey Norman", storeUrl: "harveynorman.com.au", storeCategory: "electronics", code: "HN15OFF", description: "15% off appliances", discountType: "percentage", discountValue: 15, maxDiscount: 200, isVerified: true, isHidden: true, successRate: 65, source: "scraped" },
  { storeName: "The Good Guys", storeUrl: "thegoodguys.com.au", storeCategory: "electronics", code: "TGGBF", description: "Black Friday - Extra 10%", discountType: "percentage", discountValue: 10, isVerified: true, isHidden: false, successRate: 88, source: "affiliate" },
  { storeName: "The Good Guys", storeUrl: "thegoodguys.com.au", storeCategory: "electronics", code: "PRICEMATCH", description: "Price match + 5% extra", discountType: "percentage", discountValue: 5, isVerified: true, isHidden: true, successRate: 82, source: "manual" },
  // Fashion
  { storeName: "The Iconic", storeUrl: "theiconic.com.au", storeCategory: "fashion", code: "ICONIC15", description: "15% off first order", discountType: "percentage", discountValue: 15, isVerified: true, isHidden: false, isNewUser: true, successRate: 94, source: "affiliate" },
  { storeName: "The Iconic", storeUrl: "theiconic.com.au", storeCategory: "fashion", code: "FLASH30", description: "Flash sale - 30% off", discountType: "percentage", discountValue: 30, maxDiscount: 80, isVerified: true, isHidden: true, successRate: 68, source: "scraped" },
  { storeName: "ASOS", storeUrl: "asos.com", storeCategory: "fashion", code: "ASOS20", description: "20% off everything", discountType: "percentage", discountValue: 20, isVerified: true, isHidden: false, successRate: 90, source: "affiliate" },
  { storeName: "ASOS", storeUrl: "asos.com", storeCategory: "fashion", code: "STUDENT15", description: "Extra 15% student discount", discountType: "percentage", discountValue: 15, isVerified: true, isHidden: true, isStackable: true, successRate: 85, source: "community" },
  { storeName: "Cotton On", storeUrl: "cottonon.com", storeCategory: "fashion", code: "PERKS25", description: "25% off for Perks members", discountType: "percentage", discountValue: 25, isVerified: true, isHidden: false, successRate: 88, source: "affiliate" },
  // Home & Garden
  { storeName: "Bunnings", storeUrl: "bunnings.com.au", storeCategory: "home", code: "TRADIES10", description: "10% off for PowerPass", discountType: "percentage", discountValue: 10, isVerified: true, isHidden: false, successRate: 85, source: "manual" },
  { storeName: "Bunnings", storeUrl: "bunnings.com.au", storeCategory: "home", code: "WEEKENDSPECIAL", description: "Extra 15% off clearance", discountType: "percentage", discountValue: 15, isVerified: true, isHidden: true, successRate: 55, source: "community" },
  { storeName: "IKEA", storeUrl: "ikea.com.au", storeCategory: "home", code: "FAMILY10", description: "10% off IKEA Family", discountType: "percentage", discountValue: 10, isVerified: true, isHidden: false, successRate: 92, source: "affiliate" },
  { storeName: "IKEA", storeUrl: "ikea.com.au", storeCategory: "home", code: "DELIVERY0", description: "Free delivery over $200", discountType: "freeShipping", minPurchase: 200, isVerified: true, isHidden: true, successRate: 90, source: "scraped" },
  { storeName: "Kmart", storeUrl: "kmart.com.au", storeCategory: "retail", code: "KMARTFREE", description: "Free Click & Collect", discountType: "freeShipping", isVerified: true, isHidden: false, successRate: 98, source: "manual" },
  { storeName: "Target", storeUrl: "target.com.au", storeCategory: "retail", code: "TARGET20", description: "20% off home range", discountType: "percentage", discountValue: 20, isVerified: true, isHidden: false, successRate: 85, source: "affiliate" },
  { storeName: "Big W", storeUrl: "bigw.com.au", storeCategory: "retail", code: "BIGW15", description: "15% off toys", discountType: "percentage", discountValue: 15, isVerified: true, isHidden: false, successRate: 88, source: "affiliate" },
  // Health & Beauty
  { storeName: "Chemist Warehouse", storeUrl: "chemistwarehouse.com.au", storeCategory: "health", code: "CW10FIRST", description: "10% off first order", discountType: "percentage", discountValue: 10, isVerified: true, isHidden: false, isNewUser: true, successRate: 95, source: "affiliate" },
  { storeName: "Chemist Warehouse", storeUrl: "chemistwarehouse.com.au", storeCategory: "health", code: "HEALTHSAVE", description: "Extra 15% off vitamins", discountType: "percentage", discountValue: 15, isVerified: true, isHidden: true, successRate: 70, source: "scraped" },
  { storeName: "Priceline", storeUrl: "priceline.com.au", storeCategory: "health", code: "SISTER40", description: "40% off fragrances", discountType: "percentage", discountValue: 40, isVerified: true, isHidden: false, successRate: 92, source: "affiliate" },
  { storeName: "Priceline", storeUrl: "priceline.com.au", storeCategory: "health", code: "PLGIFT20", description: "20% off gift sets", discountType: "percentage", discountValue: 20, isVerified: true, isHidden: true, successRate: 75, source: "community" },
  // Food Delivery
  { storeName: "Uber Eats", storeUrl: "ubereats.com", storeCategory: "food", code: "EATS30", description: "$30 off first 2 orders", discountType: "fixed", discountValue: 30, isVerified: true, isHidden: false, isNewUser: true, successRate: 96, source: "affiliate" },
  { storeName: "Uber Eats", storeUrl: "ubereats.com", storeCategory: "food", code: "PERTHLOCAL", description: "Free delivery Perth", discountType: "freeShipping", isVerified: false, isHidden: true, successRate: 45, source: "community" },
  { storeName: "DoorDash", storeUrl: "doordash.com", storeCategory: "food", code: "DASH50", description: "50% off first order", discountType: "percentage", discountValue: 50, maxDiscount: 20, isVerified: true, isHidden: false, isNewUser: true, successRate: 94, source: "affiliate" },
  { storeName: "Menulog", storeUrl: "menulog.com.au", storeCategory: "food", code: "MENU20", description: "$20 off $40+ order", discountType: "fixed", discountValue: 20, minPurchase: 40, isVerified: true, isHidden: false, isNewUser: true, successRate: 90, source: "affiliate" },
  // Travel
  { storeName: "Booking.com", storeUrl: "booking.com", storeCategory: "travel", code: "GENIUS15", description: "15% off Genius members", discountType: "percentage", discountValue: 15, isVerified: true, isHidden: false, successRate: 88, source: "affiliate" },
  { storeName: "Expedia", storeUrl: "expedia.com.au", storeCategory: "travel", code: "SAVE12", description: "12% off hotels", discountType: "percentage", discountValue: 12, isVerified: true, isHidden: false, successRate: 85, source: "affiliate" },
  { storeName: "Qantas", storeUrl: "qantas.com", storeCategory: "travel", code: "FFPOINTS", description: "Double FF points", discountType: "percentage", discountValue: 0, isVerified: true, isHidden: true, successRate: 80, source: "scraped" },
  // Grocery Delivery
  { storeName: "Woolworths", storeUrl: "woolworths.com.au", storeCategory: "groceries", code: "WOWFREE", description: "Free delivery $100+", discountType: "freeShipping", minPurchase: 100, isVerified: true, isHidden: false, successRate: 95, source: "manual" },
  { storeName: "Woolworths", storeUrl: "woolworths.com.au", storeCategory: "groceries", code: "EVERYDAY10", description: "10% off Everyday Rewards", discountType: "percentage", discountValue: 10, maxDiscount: 30, isVerified: true, isHidden: true, successRate: 65, source: "community" },
  { storeName: "Coles", storeUrl: "coles.com.au", storeCategory: "groceries", code: "COLESFLYBUYS", description: "Triple Flybuys points", discountType: "percentage", discountValue: 0, isVerified: true, isHidden: false, successRate: 92, source: "manual" },
  { storeName: "Coles", storeUrl: "coles.com.au", storeCategory: "groceries", code: "FRESHSAVE", description: "$15 off fresh produce $80+", discountType: "fixed", discountValue: 15, minPurchase: 80, isVerified: true, isHidden: true, successRate: 58, source: "scraped" },
  // Pet
  { storeName: "Pet Circle", storeUrl: "petcircle.com.au", storeCategory: "pet", code: "FIRST25", description: "25% off first order", discountType: "percentage", discountValue: 25, isVerified: true, isHidden: false, isNewUser: true, successRate: 96, source: "affiliate" },
  { storeName: "Pet Circle", storeUrl: "petcircle.com.au", storeCategory: "pet", code: "AUTOSHIP20", description: "20% off AutoShip orders", discountType: "percentage", discountValue: 20, isVerified: true, isHidden: true, successRate: 88, source: "manual" },
  { storeName: "PETstock", storeUrl: "petstock.com.au", storeCategory: "pet", code: "VIP15", description: "15% off VIP members", discountType: "percentage", discountValue: 15, isVerified: true, isHidden: false, successRate: 85, source: "affiliate" },
  // Services
  { storeName: "Spotify", storeUrl: "spotify.com", storeCategory: "entertainment", code: "PREMIUM3M", description: "3 months Premium $0", discountType: "fixed", discountValue: 0, isVerified: true, isHidden: false, isNewUser: true, successRate: 98, source: "affiliate" },
  { storeName: "Netflix", storeUrl: "netflix.com", storeCategory: "entertainment", code: "BASIC1", description: "First month $1", discountType: "fixed", discountValue: 0, isVerified: false, isHidden: true, isNewUser: true, successRate: 40, source: "community" },
  { storeName: "Stan", storeUrl: "stan.com.au", storeCategory: "entertainment", code: "STAN30", description: "30-day free trial", discountType: "percentage", discountValue: 100, isVerified: true, isHidden: false, isNewUser: true, successRate: 95, source: "affiliate" },
];

export async function seedProductData() {
  console.log("Seeding stores...");
  
  // Insert stores
  const insertedStores: Record<string, string> = {};
  for (const store of STORES_DATA) {
    try {
      const [inserted] = await db.insert(stores).values(store).returning();
      insertedStores[store.slug] = inserted.id;
      console.log(`  - Added store: ${store.name}`);
    } catch (e) {
      // Store might already exist
      console.log(`  - Store ${store.name} already exists`);
    }
  }
  
  console.log("\nSeeding products...");
  
  // Insert products and store products
  for (const product of PRODUCTS_DATA) {
    try {
      const [insertedProduct] = await db.insert(products).values(product).returning();
      console.log(`  - Added product: ${product.name}`);
      
      // Add pricing for grocery stores
      const groceryStores = ["woolworths", "coles", "aldi", "spudshed", "iga", "farmer-jacks"];
      const basePrice = BASE_PRICES[product.name] || 5.00;
      
      for (const storeSlug of groceryStores) {
        if (insertedStores[storeSlug]) {
          const multiplier = STORE_PRICE_MULTIPLIERS[storeSlug] || 1.0;
          const price = Math.round(basePrice * multiplier * 100) / 100;
          const isOnSpecial = Math.random() < 0.2; // 20% chance of special
          const wasPrice = isOnSpecial ? Math.round(price * 1.25 * 100) / 100 : null;
          
          await db.insert(storeProducts).values({
            productId: insertedProduct.id,
            storeId: insertedStores[storeSlug],
            currentPrice: price.toString(),
            wasPrice: wasPrice?.toString(),
            isOnSpecial,
            specialType: isOnSpecial ? (Math.random() < 0.5 ? "half_price" : "member_price") : null,
            inStock: Math.random() > 0.05, // 95% in stock
          });
        }
      }
    } catch (e) {
      console.log(`  - Product ${product.name} may already exist`);
    }
  }
  
  console.log("\nSeeding promo codes...");
  
  // Insert promo codes
  for (const promo of PROMO_CODES_DATA) {
    try {
      await db.insert(promoCodes).values({
        ...promo,
        discountValue: promo.discountValue?.toString(),
        minPurchase: promo.minPurchase?.toString(),
        maxDiscount: promo.maxDiscount?.toString(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        lastVerified: new Date(),
      });
      console.log(`  - Added promo: ${promo.code} for ${promo.storeName}`);
    } catch (e) {
      console.log(`  - Promo ${promo.code} may already exist`);
    }
  }
  
  console.log("\nProduct data seeding complete!");
}
