import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";

// Edge-compatible Auth.js config (no PrismaAdapter here — see auth.ts).
// Provider's authorize() runs in node runtime via the route handler; that's fine.
export default {
  providers: [
    Credentials({
      name: "Phone OTP",
      credentials: {
        phone: { label: "手机号", type: "tel" },
        code: { label: "验证码", type: "text" },
      },
      authorize: async (credentials) => {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { phone, code } = parsed.data;

        const token = await prisma.verificationToken.findFirst({
          where: { identifier: phone, token: code, expires: { gt: new Date() } },
        });
        if (!token) return null;

        // One-shot: delete after use
        await prisma.verificationToken.deleteMany({
          where: { identifier: phone },
        });

        // Upsert user by phone
        const user = await prisma.user.upsert({
          where: { phone },
          create: { phone, name: phone },
          update: {},
        });

        return { id: user.id, name: user.name, email: user.email ?? undefined };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
