import { randomInt } from 'crypto';

const COUPON_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateCouponCode(length = 10): string {
  let code = '';

  for (let i = 0; i < length; i++) {
    const index = randomInt(0, COUPON_CHARS.length);
    code += COUPON_CHARS[index];
  }

  return code;
}
