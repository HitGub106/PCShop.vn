import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sql } from "@vercel/postgres";

import { normalizeEmail, validateLogin } from "./app/lib/authValidation";

type UserRow = {
  id: number | string;
  full_name: string;
  email: string;
  password: string;
  role: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    error: "/login",
    signIn: "/login",
  },
  secret:
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "local-development-auth-secret-change-before-production",
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials.email === "string" ? credentials.email : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";
        const errors = validateLogin({ email, password });

        if (Object.keys(errors).length > 0) {
          return null;
        }

        const { rows } = await sql<UserRow>`
          SELECT id, full_name, email, password, role
          FROM users
          WHERE email = ${normalizeEmail(email)}
          LIMIT 1;
        `;
        const user = rows[0];

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.full_name,
          fullName: user.full_name,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "admin",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials.email === "string" ? credentials.email : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";
        const errors = validateLogin({ email, password });

        if (Object.keys(errors).length > 0) {
          return null;
        }

        const { rows } = await sql<UserRow>`
          SELECT id, full_name, email, password, role
          FROM users
          WHERE email = ${normalizeEmail(email)}
          LIMIT 1;
        `;
        const user = rows[0];

        if (!user || user.role !== "admin") {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.full_name,
          fullName: user.full_name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fullName = user.fullName ?? user.name ?? "";
        token.role = user.role ?? "user";
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.id ?? "");
      session.user.fullName = String(token.fullName ?? session.user.name ?? "");
      session.user.name = session.user.fullName;
      session.user.role = String(token.role ?? "user");

      return session;
    },
  },
});
