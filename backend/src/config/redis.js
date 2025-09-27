// Simple in-memory cache (no Redis required)
class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  async get(key) {
    return this.cache.get(key) || null;
  }

  async set(key, value) {
    this.cache.set(key, value);
    return 'OK';
  }

  async setEx(key, seconds, value) {
    this.cache.set(key, value);
    setTimeout(() => {
      this.cache.delete(key);
    }, seconds * 1000);
    return 'OK';
  }

  async del(key) {
    this.cache.delete(key);
    return 1;
  }

  async connect() {
    console.log('✅ Memory cache initialized');
    return this;
  }

  on() {
    return this;
  }
}

const redisClient = new MemoryCache();

export const connectRedis = async () => {
  await redisClient.connect();
};

export { redisClient };