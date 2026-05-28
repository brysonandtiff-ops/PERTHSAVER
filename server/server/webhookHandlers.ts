import { getStripeSync, getUncachableStripeClient, getStripeSecretKey } from './stripeClient';
import { storage } from './storage';
import type Stripe from 'stripe';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string, uuid: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature, uuid);

    const event = JSON.parse(payload.toString()) as Stripe.Event;

    await WebhookHandlers.handleSubscriptionEvents(event);
  }

  private static async handleSubscriptionEvents(event: Stripe.Event): Promise<void> {
    const eventType = event.type;

    if (eventType.startsWith('customer.subscription.')) {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === 'string' 
        ? subscription.customer 
        : subscription.customer.id;

      const user = await storage.getUserByStripeCustomerId(customerId);
      if (!user) {
        console.log(`No user found for Stripe customer: ${customerId}`);
        return;
      }

      const planName = await WebhookHandlers.getPlanNameFromSubscription(subscription);

      switch (eventType) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await storage.updateUser(user.id, {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            subscriptionPlan: planName,
          });
          console.log(`Updated subscription for user ${user.id}: ${subscription.status} - ${planName}`);
          break;

        case 'customer.subscription.deleted':
          await storage.updateUser(user.id, {
            stripeSubscriptionId: null,
            subscriptionStatus: 'canceled',
            subscriptionPlan: 'starter',
          });
          console.log(`Canceled subscription for user ${user.id}`);
          break;
      }
    }

    if (eventType === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = typeof session.customer === 'string' 
        ? session.customer 
        : session.customer?.id;

      if (customerId && session.subscription) {
        const user = await storage.getUserByStripeCustomerId(customerId);
        if (user) {
          const subscriptionId = typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription.id;

          await storage.updateUser(user.id, {
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: 'active',
          });
          console.log(`Checkout completed for user ${user.id}`);
        }
      }
    }
  }

  private static async getPlanNameFromSubscription(subscription: Stripe.Subscription): Promise<string> {
    try {
      const stripe = await getUncachableStripeClient();
      const firstItem = subscription.items.data[0];
      if (!firstItem?.price?.product) return 'premium';
      
      const productId = typeof firstItem.price.product === 'string'
        ? firstItem.price.product
        : firstItem.price.product.id;

      const product = await stripe.products.retrieve(productId);
      return product.name.toLowerCase();
    } catch (error) {
      console.error('Error getting plan name:', error);
      return 'premium';
    }
  }
}
