import { createAuthClient } from "better-auth/react";

// Prefer an auth-specific URL if provided (contains /api/auth),
// otherwise fall back to the backend root URL.
const baseURL = process.env.NEXT_PUBLIC_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "";

export const authClient = createAuthClient({
    baseURL,
    fetchOptions: {
        credentials: "include",
    },
});

export const { signIn, signUp, signOut, useSession } = authClient;