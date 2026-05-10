import { createAuthClient } from "better-auth/react";

const AUTH_URL =
    process.env.NEXT_PUBLIC_AUTH_URL ||
    `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "")}/api/auth`;

export const authClient = createAuthClient({
    baseURL: AUTH_URL,
    fetchOptions: {
        credentials: "include",
    },
});

export const { signIn, signUp, signOut, useSession } = authClient;