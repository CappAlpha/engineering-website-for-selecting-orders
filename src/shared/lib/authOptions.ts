import { UserRole } from "@prisma/client";
import { compare, hashSync } from "bcrypt";
import {
  Account,
  type User,
  type Profile,
  type Session,
  type AuthOptions,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

import { prisma } from "../../../prisma/prisma-client";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      profile(profile: Profile & GoogleProfile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: UserRole.USER,
        };
      },
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
        // TODO: add email verification
        // if (!findUser.verified) {
        //   return null;
        // }

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
    async signIn({ user, account }: { user: User; account: Account | null }) {
      try {
        if (account?.provider === "credentials") {
          return true;
        }

        if (!user.email) {
          return false;
        }

        // Find user and check if he has provider or email
        const findUser = await prisma.user.findFirst({
          where: {
            OR: [
              {
                provider: account?.provider,
                providerId: account?.providerAccountId,
              },
              { email: user.email },
            ],
          },
        });

        // If user exist and has provider, update it
        if (findUser) {
          await prisma.user.update({
            where: {
              id: findUser.id,
            },
            data: {
              provider: account?.provider,
              providerId: account?.providerAccountId,
            },
          });

          return true;
        }

        await prisma.user.create({
          data: {
            id: crypto.randomUUID(),
            fullName: user.name ?? "User #" + user.id,
            email: user.email,
            // TODO: do we need to better encrypt?
            password: hashSync(user.name + user.id, 10),
            // TODO: add email verification
            verified: new Date(),
            provider: account?.provider,
            providerId: account?.providerAccountId,
          },
        });

        return true;
      } catch (err) {
        console.error("Error [SIGNIN]", err);
        return false;
      }
    },
    async jwt({ token }: { token: JWT }) {
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
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};
