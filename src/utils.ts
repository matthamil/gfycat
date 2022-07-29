export const isExpired = (ms = 0) => ms >= Date.now();

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
