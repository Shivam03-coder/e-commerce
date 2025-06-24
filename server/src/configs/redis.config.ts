import Redis from "ioredis";

class RedisService {
  private client: Redis;
  constructor() {
    this.client = new Redis(process.env.REDIS_URL as string);

    this.client.on("connect", () => {
      console.log("Redis connected");
    });

    this.client.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }

  public getClient(): Redis {
    return this.client;
  }

  public async set(
    key: string,
    value: string | number,
    expiryInSec?: number
  ): Promise<"OK"> {
    if (expiryInSec) {
      return this.client.set(key, value, "EX", expiryInSec);
    }
    return this.client.set(key, value);
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  public async sismember(
    key: string,
    member: string | number
  ): Promise<boolean> {
    const result = await this.client.sismember(key, member);
    return result === 1;
  }

  public async sadd(
    key: string,
    ...members: (string | number)[]
  ): Promise<number> {
    return this.client.sadd(key, ...members);
  }
}

const redis = new RedisService();
export default redis;
