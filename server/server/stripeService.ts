import { getUncachableStripeClient } from './stripeClient';
import { db } from './db';
import { sql } from 'drizzle-orm';

export class StripeService {
  async getStripeClient() {
    return await getUncachableStripeClient();
  }

  async createCustomer(email: string, userId: string, name?: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.customers.create({
      email,
      name: name || undefined,
      metadata: { userId },
    });
  }

  async createCheckoutSession(
    customerId: string, 
    priceId: string, 
    successUrl: string, 
    cancelUrl: string,
    trialDays: number = 180
  ) {
    const stripe = await getUncachableStripeClient();
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: trialDays,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    const stripe = await getUncachableStripeClient();
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  async getProduct(productId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE id = ${productId}`
    ) as any;
    return result.rows?.[0] ?? result[0] ?? null;
  }

  async listProducts(active = true, limit = 20) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE active = ${active} LIMIT ${limit}`
    ) as any;
    return result.rows ?? result ?? [];
  }

  async listProductsWithPrices(active = true, limit = 20) {
    const result = await db.execute(
      sql`
        WITH paginated_products AS (
          SELECT id, name, description, metadata, active
          FROM stripe.products
          WHERE active = ${active}
          ORDER BY id
          LIMIT ${limit}
        )
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          p.active as product_active,
          p.metadata as product_metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring,
          pr.active as price_active,
          pr.metadata as price_metadata
        FROM paginated_products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        ORDER BY p.id, pr.unit_amount
      `
    ) as any;
    return result.rows ?? result ?? [];
  }

  async getPrice(priceId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.prices WHERE id = ${priceId}`
    ) as any;
    return result.rows?.[0] ?? result[0] ?? null;
  }

  async listPrices(active = true, limit = 20) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.prices WHERE active = ${active} LIMIT ${limit}`
    ) as any;
    return result.rows ?? result ?? [];
  }

  async getPricesForProduct(productId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.prices WHERE product = ${productId} AND active = true`
    ) as any;
    return result.rows ?? result ?? [];
  }

  async getSubscription(subscriptionId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.subscriptions WHERE id = ${subscriptionId}`
    ) as any;
    return result.rows?.[0] ?? result[0] ?? null;
  }

  async getCustomerSubscriptions(customerId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.subscriptions WHERE customer = ${customerId} ORDER BY created DESC`
    ) as any;
    return result.rows ?? result ?? [];
  }
}

export const stripeService = new StripeService();
