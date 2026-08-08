import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getStripePublishableKey } from "../../server/server/stripeClient";

describe("Stripe Production Configuration & Fail-Closed Guard", () => {
  it("returns configured publishable key if environment variable is present", async () => {
    process.env.STRIPE_PUBLISHABLE_KEY = "pk_test_perth_saver_unit_test";
    const key = await getStripePublishableKey();
    assert.equal(key, "pk_test_perth_saver_unit_test");
  });

  it("checks PUBLIC_STRIPE_PUBLISHABLE_KEY if STRIPE_PUBLISHABLE_KEY is unset", async () => {
    delete process.env.STRIPE_PUBLISHABLE_KEY;
    process.env.PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_public_key";
    const key = await getStripePublishableKey();
    assert.equal(key, "pk_test_public_key");
    delete process.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
  });

  it("returns empty string gracefully when no keys are configured (triggering 503 fail-closed route)", async () => {
    delete process.env.STRIPE_PUBLISHABLE_KEY;
    delete process.env.PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const key = await getStripePublishableKey();
    assert.equal(key, "");
  });
});
