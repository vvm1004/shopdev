const redis = require("redis");
const { reservationInventory } = require("../models/repositories/inventory.repo");
const redisClient = redis.createClient();

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; //3 seconds temporary lock

  for (let i = 0; i < retryTimes.length; i++) {
    const result = await redisClient.setnxAsync(key, expireTime);
    console.log(`result:::`, result);
    if (result === 1) {
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReservation.modifiedCount) {
        await redisClient.pexpireAsync(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  return await redisClient.delAsync(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};