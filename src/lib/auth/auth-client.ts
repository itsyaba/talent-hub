import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Create a mock auth type for now since we're using lazy initialization
type MockAuth = {
  $Infer: {
    Session: any;
    User: any;
  };
};

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  plugins: [inferAdditionalFields<MockAuth>()],
  fetchOptions: {
    credentials: "include",
  },
});

const { useSession, signOut } = authClient;

export { useSession, signOut };
