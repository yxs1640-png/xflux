import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      planTier?: string;
    };
  }

  interface User {
    planTier?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    planTier?: string;
  }
}
