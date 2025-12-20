"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "otp">("register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === "register") {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }

    setLoading(true);

    try {
      if (step === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Registration failed");
        } else {
          const otpRes = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          });

          if (otpRes.ok) {
            setStep("otp");
          } else {
            setError("Account created but failed to send OTP. Please login.");
            setTimeout(() => router.push("/auth/login"), 2000);
          }
        }
      } else {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Verification failed");
        } else {
          setSuccess(true);
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-xl text-center p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
          <p className="text-gray-500">Redirecting to login...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#841a1c] p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <Image
              src="/assets/logo.png"
              alt="Gryffindors Logo"
              width={32}
              height={32}
              className="object-contain"
            />{" "}
            <span className="text-2xl font-bold text-white">Gryffindors</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Start Your
            <br />
            Journey Today
          </h1>
          <p className="text-white/80 text-lg">
            Join thousands of students learning the latest tech skills.
          </p>
        </div>

        <div className="space-y-3 text-white/80">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#d79c64]" />
            <span>Expert-led curriculum</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#d79c64]" />
            <span>Real-world projects</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#d79c64]" />
            <span>Verifiable certificates</span>
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
            <CardTitle className="text-2xl">
              {step === "register" ? "Create Account" : "Verify Email"}
            </CardTitle>
            <p className="text-gray-500 text-sm mt-1">
              {step === "register"
                ? "Sign up to get started with your learning journey"
                : `We sent a code to ${formData.email}`}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              {step === "register" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
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
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none transition"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none transition text-center tracking-widest text-lg"
                  />
                  <div className="text-center mt-2">
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await fetch("/api/auth/send-otp", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: formData.email }),
                        });
                        if (res.ok) setError("");
                        else setError("Failed to resend code");
                      }}
                      className="text-sm text-[#841a1c] hover:underline"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#841a1c] hover:bg-[#681416] py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {step === "register"
                      ? "Creating account..."
                      : "Verifying..."}
                  </>
                ) : step === "register" ? (
                  "Create Account"
                ) : (
                  "Verify & Login"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#841a1c] font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
