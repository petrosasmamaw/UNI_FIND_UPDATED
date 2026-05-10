import { betterAuth } from "better-auth";
import { toNodeHandler } from "better-auth/node";
import { createRequire } from "module";
import { Pool } from "pg";
import { sendPasswordResetEmail, sendVerificationEmail } from "./server/email.mjs";
import { getPasswordResetEmailTemplate, getVerificationEmailTemplate } from "./server/emailTemplates.mjs";

const require = createRequire(import.meta.url);
const { getAllowedOrigins } = require("./src/config/origins.js");

const connectionString = process.env.DATABASE_URL;
const authBaseURL = process.env.BETTER_AUTH_URL || "http://localhost:5000";
const webOrigins = getAllowedOrigins();
const hasEmailCredentials = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

if (!process.env.BETTER_AUTH_SECRET) {
  console.warn("BETTER_AUTH_SECRET is not set. Set it in backend/.env");
}

if (!connectionString) {
  throw new Error("DATABASE_URL is required for Better Auth");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const socialProviders = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: authBaseURL,
  trustedOrigins: [...new Set([...webOrigins, authBaseURL])],
  useSecureCookies: process.env.NODE_ENV === "production",
  defaultCookieAttributes: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
  database: pool,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: hasEmailCredentials,
    sendResetPassword: async ({ user, url }) => {
      if (!hasEmailCredentials) {
        console.warn(`Skipping password reset email for ${user.email} because email transport is not configured.`);
        return;
      }

      const html = getPasswordResetEmailTemplate(user.name || user.email, url);
      await sendPasswordResetEmail({
        to: user.email,
        subject: "Reset your password",
        html,
      });
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      if (!hasEmailCredentials) {
        console.warn(`Skipping verification email for ${user.email} because email transport is not configured.`);
        return;
      }

      const html = getVerificationEmailTemplate(user.name || user.email, url);
      await sendVerificationEmail({
        to: user.email,
        subject: "Verify your email address",
        html,
      });
    },
    sendOnSignUp: hasEmailCredentials,
  },
  socialProviders,
});

export const nodeHandler = toNodeHandler(auth);