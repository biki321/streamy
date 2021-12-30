import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      username: string;
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

/** Example on how to extend the built-in types for JWT */
declare module "next-auth/jwt" {
  interface JWT {
    /** This is an example. You can find me in types/next-auth.d.ts */
    accessToken: string;
    refreshToken: string;
    username: string;
    accessTokenExpires: number;
  }
}
