/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/auth-client";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Loader2, Terminal } from "lucide-react";

import { toast } from "sonner";
import { PasswordInput } from "../ui/password-input";
import { IconBrandApple, IconBrandGoogle } from "@tabler/icons-react";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();

    const { data, error } = await authClient.signIn.email(
      {
        /**
         * The user email
         */
        email,
        /**
         * The user password
         */
        password,
        /**
         * a url to redirect to after the user verifies their email (optional)
         */
        callbackURL: "/dashboard",
        /**
         * remember the user session after the browser is closed.
         * @default true
         */
        rememberMe: false,
      },
      {
        onRequest: (ctx) => {
          setLoading(true);
        },
        onSuccess: (ctx) => {},
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      }
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border border-red-500" variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forget-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <PasswordInput
                  onChange={(e: any) => setPassword(e.target.value)}
                  value={password}
                  id="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button disabled={loading} type="submit" className="w-full">
                  {loading ? <Loader2 className="animate-spin" strokeWidth={2} /> : "Login"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
          <hr className="w-full h-px border-input my-4" />
          <div className="flex my-3 gap-2">
            <button
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "google",
                  fetchOptions: {
                    onRequest: (ctx: any) => {
                      toast.loading("Authenticating...");
                    },
                    onSuccess: (ctx: any) => {
                      toast.success("Authentication Redirecting...");
                    },
                    onError: (ctx: any) => {
                      setError(ctx.error.message);
                    },
                  },
                });
              }}
              className="group w-full cursor-pointer  space-x-1 py-3 flex transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8688921_inset]  border-white/10  items-center justify-center border rounded-lg hover:bg-transparent/20 duration-150 active:bg-transparent/50"
            >
              <IconBrandGoogle className="w-5 h-5 fill-current" />
              {/* Continue with Google */}
            </button>
            <button
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "apple",
                });
              }}
              className="group w-full cursor-pointer  space-x-1 py-3 flex transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8688921_inset]  border-white/10  items-center justify-center border rounded-lg hover:bg-transparent/20 duration-150 active:bg-transparent/50"
            >
              <IconBrandApple className="w-5 h-5 fill-current" />
              {/* Continue with Apple */}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
