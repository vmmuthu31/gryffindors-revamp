"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getRedirectUrl = (role: string) => {
    if (callbackUrl) return callbackUrl;
    switch (role) {
      case "ADMIN":
        return "/admin/dashboard";
      case "MENTOR":
        return "/mentor/dashboard";
      default:
        return "/student/dashboard";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role || "STUDENT";

      router.push(getRedirectUrl(role));
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#841a1c] p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Image
                src="/assets/logo.png"
                alt="Gryffindors Logo"
                width={32}
                height={32}
                className="object-contain"
              />{" "}
            </div>
            <span className="text-2xl font-bold text-white">Gryffindors</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to the
            <br />
            LMS Portal
          </h1>
          <p className="text-white/80 text-lg">
            Access your courses, track your progress, and earn your certificate.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white/10 backdrop-blur rounded-lg">
            <p className="text-white/90 italic">
              "The best investment in India's tech future."
            </p>
            <p className="text-white/60 text-sm mt-2">— Gryffindors Team</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="lg:hidden flex justify-center mb-4">
              <Image
                src="/assets/logo.png"
                alt="Gryffindors Logo"
                width={32}
                height={32}
                className="object-contain"
              />{" "}
            </div>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <p className="text-gray-500 text-sm mt-1">
              Enter your credentials to access your dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none transition"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#841a1c] hover:bg-[#681416] py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-gray-500 hover:text-[#841a1c]"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[#841a1c] font-medium hover:underline"
              >
                Register here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#841a1c]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
