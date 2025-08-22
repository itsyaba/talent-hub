"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { IconBrandGoogle } from "@tabler/icons-react";
import { Checkbox } from "../ui/checkbox";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name: fullname,
      },
      {
        onRequest: (ctx: any) => {
          if (password !== confirmPassword) {
            setError("Password is not matching");
            return;
          }
          setLoading(true);
        },
        onSuccess: (ctx: any) => {
          router.push("/onboarding");
          toast.success("Account created successfully! Please complete your profile.");
        },
        onError: (ctx: any) => {
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
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Get started with your new account</CardDescription>
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
                <Label htmlFor="email">Full Name</Label>
                <Input
                  onChange={(e) => setFullname(e.target.value)}
                  value={fullname}
                  id="name"
                  type="text"
                  placeholder="Achour Meguenni"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                  type="email"
                  placeholder="me@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <PasswordInput
                  onChange={(e: any) => setPassword(e.target.value)}
                  value={password}
                  id="password"
                  type="password"
                  required
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirm Password</Label>
                </div>
                <PasswordInput
                  onChange={(e: any) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  id="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button disabled={loading} type="submit" className="w-full">
                  {loading ? <Loader2 className="animate-spin" strokeWidth={2} /> : "Sign Up"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
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
                      router.push("/onboarding");
                      toast.success("Authentication successful! Please complete your profile.");
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
