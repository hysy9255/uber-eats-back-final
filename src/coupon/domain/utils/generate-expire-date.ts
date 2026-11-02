export const generateExpire = (days: number): Date => {
  const expire = new Date();
  expire.setDate(expire.getDate() + days);
  return expire;
};
