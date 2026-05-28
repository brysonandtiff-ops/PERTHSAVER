import { getUncachableStripeClient } from './stripeClient';

async function createSubscriptionProducts() {
  const stripe = await getUncachableStripeClient();

  console.log('Creating Perth Saver subscription products...');

  const existingProducts = await stripe.products.search({
    query: "active:'true'"
  });

  if (existingProducts.data.length > 0) {
    console.log('Products already exist. Listing current products:');
    for (const product of existingProducts.data) {
      const prices = await stripe.prices.list({ product: product.id, active: true });
      console.log(`- ${product.name} (${product.id})`);
      for (const price of prices.data) {
        console.log(`  Price: $${(price.unit_amount || 0) / 100}/${price.recurring?.interval || 'one-time'} (${price.id})`);
      }
    }
    return;
  }

  const starterProduct = await stripe.products.create({
    name: 'Starter',
    description: 'Perfect for exploring deals - Access to 1,600+ local deals, basic price tracking, and community feed',
    metadata: {
      plan: 'starter',
      features: JSON.stringify([
        'Access to 1,600+ local deals',
        'Basic price tracking',
        'Community feed',
        'Save up to 5 items',
        'Perth Saver Points'
      ])
    }
  });

  await stripe.prices.create({
    product: starterProduct.id,
    unit_amount: 0,
    currency: 'aud',
    recurring: { interval: 'month' },
    metadata: { plan: 'starter' }
  });

  console.log(`Created Starter plan: ${starterProduct.id}`);

  const premiumProduct = await stripe.products.create({
    name: 'Premium',
    description: 'Maximize your savings with advanced features, unlimited saved items, and real-time price alerts',
    metadata: {
      plan: 'premium',
      popular: 'true',
      features: JSON.stringify([
        'All Starter features',
        'Advanced price predictions',
        'Unlimited saved items',
        'Price drop alerts (real-time)',
        'Weekly savings reports',
        'Budget tracking',
        'Priority support'
      ])
    }
  });

  const premiumMonthlyPrice = await stripe.prices.create({
    product: premiumProduct.id,
    unit_amount: 999,
    currency: 'aud',
    recurring: { interval: 'month' },
    metadata: { plan: 'premium', billing: 'monthly' }
  });

  const premiumYearlyPrice = await stripe.prices.create({
    product: premiumProduct.id,
    unit_amount: 9590,
    currency: 'aud',
    recurring: { interval: 'year' },
    metadata: { plan: 'premium', billing: 'yearly', savings: '20%' }
  });

  console.log(`Created Premium plan: ${premiumProduct.id}`);
  console.log(`  Monthly price: ${premiumMonthlyPrice.id} - $9.99/month`);
  console.log(`  Yearly price: ${premiumYearlyPrice.id} - $95.90/year (save 20%)`);

  const familyProduct = await stripe.products.create({
    name: 'Family',
    description: 'For multiple household members - All Premium features plus family sharing and exclusive rewards',
    metadata: {
      plan: 'family',
      features: JSON.stringify([
        'All Premium features',
        'Add up to 4 family members',
        'Shared shopping lists',
        'Family budget management',
        'Monthly meal plans',
        'Exclusive rewards',
        '24/7 Priority support'
      ])
    }
  });

  const familyMonthlyPrice = await stripe.prices.create({
    product: familyProduct.id,
    unit_amount: 1999,
    currency: 'aud',
    recurring: { interval: 'month' },
    metadata: { plan: 'family', billing: 'monthly' }
  });

  const familyYearlyPrice = await stripe.prices.create({
    product: familyProduct.id,
    unit_amount: 19190,
    currency: 'aud',
    recurring: { interval: 'year' },
    metadata: { plan: 'family', billing: 'yearly', savings: '20%' }
  });

  console.log(`Created Family plan: ${familyProduct.id}`);
  console.log(`  Monthly price: ${familyMonthlyPrice.id} - $19.99/month`);
  console.log(`  Yearly price: ${familyYearlyPrice.id} - $191.90/year (save 20%)`);

  console.log('\nAll subscription products created successfully!');
}

createSubscriptionProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error creating products:', error);
    process.exit(1);
  });
