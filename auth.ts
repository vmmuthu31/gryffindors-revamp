import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "STUDENT" | "MENTOR" | "ADMIN";
  createdAt: string;
  applications: Array<{
    id: string;
    status: string;
    internship: { title: string };
  }>;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[Auth] Authorizing:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.log("[Auth] Missing credentials");
          return null;
        }

        const { data: user, error } = await supabaseAdmin
          .from("User")
          .select("*")
          .eq("email", credentials.email as string)
          .single();

        if (user) {
          console.log("[Auth] User found. Keys:", Object.keys(user));
        }

        if (error) {
          console.error("[Auth] Supabase error:", error);
        }

        const passwordHash = user?.password_hash || user?.passwordHash;

        if (error || !user || !passwordHash) {
          console.error(
            "[Auth] Authentication failed: invalid user or missing password hash"
          );
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          passwordHash
        );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as User).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as { role: string }).role =
          token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
