// Coinbase Commerce Integration for Perth Saver
// Enables cryptocurrency payments (Bitcoin, Ethereum, USDC)

import { Request, Response } from "express";
import crypto from "crypto";

const { COINBASE_COMMERCE_API_KEY, COINBASE_COMMERCE_WEBHOOK_SECRET } = process.env;

const COINBASE_API_URL = "https://api.commerce.coinbase.com";

let isCoinbaseEnabled = false;

function initCoinbase() {
  if (!COINBASE_COMMERCE_API_KEY) {
    console.log("[Coinbase] API key not configured - crypto payments disabled");
    return false;
  }
  if (!COINBASE_COMMERCE_WEBHOOK_SECRET) {
    console.log("[Coinbase] Webhook secret not configured - webhooks will be rejected");
  }
  console.log("[Coinbase] Commerce integration initialized");
  return true;
}

isCoinbaseEnabled = initCoinbase();

function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!COINBASE_COMMERCE_WEBHOOK_SECRET) {
    return false;
  }
  
  const expectedSignature = crypto
    .createHmac("sha256", COINBASE_COMMERCE_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export function isCoinbaseConfigured() {
  return isCoinbaseEnabled;
}

export async function createCryptoCharge(req: Request, res: Response) {
  if (!isCoinbaseEnabled || !COINBASE_COMMERCE_API_KEY) {
    return res.status(503).json({ error: "Coinbase Commerce not configured" });
  }

  try {
    const { amount, currency, name, description, redirectUrl, cancelUrl } = req.body;

    if (!amount || !currency || !name) {
      return res.status(400).json({ error: "Missing required fields: amount, currency, name" });
    }

    const chargeData = {
      name,
      description: description || `Perth Saver subscription payment`,
      pricing_type: "fixed_price",
      local_price: {
        amount: amount.toString(),
        currency: currency.toUpperCase(),
      },
      redirect_url: redirectUrl || `${req.protocol}://${req.get('host')}/payment/success`,
      cancel_url: cancelUrl || `${req.protocol}://${req.get('host')}/pricing`,
      metadata: {
        user_id: req.session?.userId?.toString() || "guest",
        timestamp: new Date().toISOString(),
      },
    };

    const response = await fetch(`${COINBASE_API_URL}/charges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": COINBASE_COMMERCE_API_KEY,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify(chargeData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Coinbase] Charge creation failed:", errorData);
      return res.status(response.status).json({ 
        error: "Failed to create crypto charge",
        details: errorData 
      });
    }

    const data = await response.json();
    res.json({
      id: data.data.id,
      code: data.data.code,
      hosted_url: data.data.hosted_url,
      pricing: data.data.pricing,
      expires_at: data.data.expires_at,
    });
  } catch (error) {
    console.error("[Coinbase] Error creating charge:", error);
    res.status(500).json({ error: "Failed to create crypto charge" });
  }
}

export async function getCryptoCharge(req: Request, res: Response) {
  if (!isCoinbaseEnabled || !COINBASE_COMMERCE_API_KEY) {
    return res.status(503).json({ error: "Coinbase Commerce not configured" });
  }

  try {
    const { chargeId } = req.params;

    const response = await fetch(`${COINBASE_API_URL}/charges/${chargeId}`, {
      headers: {
        "X-CC-Api-Key": COINBASE_COMMERCE_API_KEY,
        "X-CC-Version": "2018-03-22",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Charge not found" });
    }

    const data = await response.json();
    res.json({
      id: data.data.id,
      code: data.data.code,
      status: data.data.timeline?.[data.data.timeline.length - 1]?.status || "NEW",
      pricing: data.data.pricing,
      payments: data.data.payments,
    });
  } catch (error) {
    console.error("[Coinbase] Error fetching charge:", error);
    res.status(500).json({ error: "Failed to fetch charge status" });
  }
}

export async function handleCoinbaseWebhook(req: Request, res: Response) {
  try {
    const signature = req.headers["x-cc-webhook-signature"] as string;
    
    if (!signature) {
      console.error("[Coinbase] Webhook rejected: Missing signature header");
      return res.status(401).json({ error: "Missing webhook signature" });
    }

    if (!COINBASE_COMMERCE_WEBHOOK_SECRET) {
      console.error("[Coinbase] Webhook rejected: Webhook secret not configured");
      return res.status(503).json({ error: "Webhook handler not configured" });
    }

    const rawBody = JSON.stringify(req.body);
    
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error("[Coinbase] Webhook rejected: Invalid signature");
      return res.status(401).json({ error: "Invalid webhook signature" });
    }

    const event = req.body;
    const eventType = event.event?.type;

    console.log(`[Coinbase] Webhook verified and received: ${eventType}`);

    switch (eventType) {
      case "charge:confirmed":
        console.log("[Coinbase] Payment confirmed:", event.event.data.code);
        break;
      case "charge:failed":
        console.log("[Coinbase] Payment failed:", event.event.data.code);
        break;
      case "charge:pending":
        console.log("[Coinbase] Payment pending:", event.event.data.code);
        break;
      default:
        console.log("[Coinbase] Unhandled event type:", eventType);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("[Coinbase] Webhook error:", error);
    res.status(400).json({ error: "Webhook processing failed" });
  }
}
