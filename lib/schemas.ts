import { z } from "zod";

// Phone (mainland China) — Task 1.4+1.5 will use this in /api/auth/send-sms.
export const phoneSchema = z
  .string()
  .regex(/^1[3-9]\d{9}$/, "手机号格式错误");

// OTP code — 6 digits, dev echo will satisfy this in Task 1.4+1.5.
export const otpSchema = z.string().regex(/^\d{6}$/, "验证码必须为 6 位数字");
