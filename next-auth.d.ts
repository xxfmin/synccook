// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  // returned by getSession() and useSession()
  interface Session extends DefaultSession {
    user: {
      id: string;
      firstName: string;
      lastName: string;
    } & DefaultSession["user"];
  }

  // user object returned by authorize() method
  interface User extends DefaultUser {
    id: string;
    firstName: string;
    lastName: string;
  }
}

declare module "next-auth/jwt" {
  // the JWT token stored in the cookie

  interface JWT extends DefaultJWT {
    id: string;
    firstName: string;
    lastName: string;
  }
}
