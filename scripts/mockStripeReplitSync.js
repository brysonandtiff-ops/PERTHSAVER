export async function runMigrations() {
  return Promise.resolve();
}

export class StripeSync {
  async findOrCreateManagedWebhook() {
    return Promise.resolve({ webhook: { url: "" }, uuid: "" });
  }
  async syncBackfill() {
    return Promise.resolve();
  }
}

export default {
  runMigrations,
  StripeSync,
};
