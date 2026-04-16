import { z } from "zod";

// Phone (mainland China)
export const phoneSchema = z
  .string()
  .regex(/^1[3-9]\d{9}$/, "手机号格式错误");

// OTP code — 6 digits
export const otpSchema = z.string().regex(/^\d{6}$/, "验证码必须为 6 位数字");

export const sendOtpSchema = z.object({ phone: phoneSchema });

export const signInSchema = z.object({
  phone: phoneSchema,
  code: otpSchema,
});
