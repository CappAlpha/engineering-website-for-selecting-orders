// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: UserRole;
  }

  interface Profile extends OAuthUserConfig<GoogleProfile> {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
  }
}
