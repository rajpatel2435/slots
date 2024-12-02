// cache.js
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600  }); // 1 hour



export const getCachedData = (key) => {
  return cache.get(key);
};

export const setCachedData = (key, value) => {
  cache.set(key, value);
};

 