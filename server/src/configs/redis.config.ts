import Redis from "ioredis";

class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL as string);

    this.client.on("connect", () => {
      console.log("✅ Redis connected");
    });

    this.client.on("error", (err) => {
      console.error("❌ Redis error:", err);
    });
  }

  public getClient(): Redis {
    return this.client;
  }

  // -------------------- Basic Key-Value --------------------

  public async set(
    key: string,
    value: string | number,
    expiryInSec?: number
  ): Promise<"OK"> {
    if (expiryInSec) {
      return this.client.set(key, value.toString(), "EX", expiryInSec);
    }
    return this.client.set(key, value.toString());
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  // -------------------- Set Operations --------------------

  public async sadd(
    key: string,
    ...members: (string | number)[]
  ): Promise<number> {
    return this.client.sadd(key, ...members.map(String));
  }

  public async srem(
    key: string,
    ...members: (string | number)[]
  ): Promise<number> {
    return this.client.srem(key, ...members.map(String));
  }

  public async sismember(
    key: string,
    member: string | number
  ): Promise<boolean> {
    const result = await this.client.sismember(key, member.toString());
    return result === 1;
  }

  public async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  // -------------------- Hash Operations (Optional) --------------------

  public async hset(
    key: string,
    field: string,
    value: string | number
  ): Promise<number> {
    return this.client.hset(key, field, value.toString());
  }

  public async hget(key: string, field: string): Promise<string | null> {
    return this.client.hget(key, field);
  }

  public async hdel(key: string, ...fields: string[]): Promise<number> {
    return this.client.hdel(key, ...fields);
  }

  // -------------------- Counter (Optional) --------------------

  public async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }
}

const redis = new RedisService();
export default redis;
