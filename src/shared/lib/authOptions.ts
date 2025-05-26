import { compare } from "bcrypt";
import { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { handleOAuthSignIn } from "@/modules/Auth/services/handleOAuthSignIn";
import { handleUserCart } from "@/modules/Auth/services/handleUserCart";
import { mergeCarts } from "@/modules/Auth/services/mergeCarts";

import { prisma } from "../../../prisma/prisma-client";
import { getCartToken } from "./getCartToken";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const values = {
          email: credentials.email,
        };

        const findUser = await prisma.user.findUnique({
          where: values,
        });
        if (!findUser) {
          return null;
        }

        if (!findUser.verified) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          findUser.password,
        );
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: findUser.id,
          email: findUser.email,
          name: findUser.fullName,
          role: findUser.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        const cartToken = await getCartToken();

        // Обрабатываем вход в зависимости от типа провайдера
        if (account?.provider === "credentials") {
          if (user.id) {
            await handleUserCart(user.id);
          }
          if (cartToken && user.id) {
            await mergeCarts(cartToken, user.id);
          }
          return true;
        }

        // Обрабатываем вход через OAuth
        return await handleOAuthSignIn(user, account, cartToken);
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
    async jwt({ token }) {
      if (!token.email) return token;

      const findUser = await prisma.user.findUnique({
        where: {
          email: token.email,
        },
      });

      if (findUser) {
        token.id = findUser.id;
        token.email = findUser.email;
        token.name = findUser.fullName;
        token.role = findUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};
