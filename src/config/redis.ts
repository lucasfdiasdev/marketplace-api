import "dotenv/config";
import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL;

const redisClient = () => {
  if (redisUrl) {
    console.log("Redis connected!");
    return redisUrl;
  }

  throw new Error("Redis ERROR connection!");
};

export const redis = new Redis(redisClient());
