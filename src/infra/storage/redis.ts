import IoRedis, { Redis as RedisInterface } from 'ioredis';

export class RedisSingleton {
  private static redis: RedisInterface;

  static getInstance() {
    if (!this.redis) {
      this.redis = new IoRedis();
    }

    return this.redis;
  }
}

export type Redis = IoRedis