"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import EligibilityTest from "@/components/internship/EligibilityTest";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Internship {
  id: string;
  title: string;
  track: string;
  price: number;
  duration: string;
}

interface RazorpayResponse {
  razorpay_paymentId: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string };
  theme: { color: string };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

const ApplyPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const internshipId = params.id as string;

  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"eligibility" | "payment" | "completed">(
    "eligibility"
  );
  const [eligibilityScore, setEligibilityScore] = useState(0);

  const [referralCode, setReferralCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [referralError, setReferralError] = useState("");
  const [isApplyingReferral, setIsApplyingReferral] = useState(false);

  const fetchInternship = useCallback(async () => {
    try {
      const res = await fetch(`/api/internships/${internshipId}`);
      if (res.ok) {
        const data = await res.json();
        setInternship(data);
      }
    } catch (error) {
      console.error("Failed to fetch internship:", error);
    } finally {
      setLoading(false);
    }
  }, [internshipId]);

  useEffect(() => {
    fetchInternship();
  }, [fetchInternship]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#841a1c]" />
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-600">Internship not found</p>
        <Link href="/internships" className="text-[#841a1c] hover:underline">
          ← Back to Internships
        </Link>
      </div>
    );
  }

  const handleEligibilityComplete = (passed: boolean, score: number) => {
    setEligibilityScore(score);
    if (passed) {
      setStep("payment");
    }
  };

  const handleApplyReferral = async () => {
    if (!referralCode || !session?.user?.id) return;
    setIsApplyingReferral(true);
    setReferralError("");

    try {
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: referralCode, userId: session.user.id }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAppliedDiscount(data.discount);
        toast.success(`Referral applied! You saved ₹${data.discount}`);
      } else {
        setReferralError(data.error || "Invalid referral code");
        setAppliedDiscount(0);
      }
    } catch {
      setReferralError("Failed to apply referral");
    } finally {
      setIsApplyingReferral(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!session?.user) {
      toast.error("Please log in to continue");
      router.push(`/auth/login?callbackUrl=/internships/${internshipId}/apply`);
      return;
    }

    const res = await loadRazorpay();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const finalAmount = Math.max(0, internship.price - appliedDiscount);

    const orderRes = await fetch("/api/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ amount: finalAmount }),
    });

    if (!orderRes.ok) {
      toast.error("Server error. Are API keys set?");
      return;
    }

    const orderData = await orderRes.json();

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Gryffindors",
      description: `Internship Enrollment: ${internship.title}`,
      image: "/assets/logo.png",
      order_id: orderData.id,
      handler: function (response: RazorpayResponse) {
        toast.success(
          `Payment Successful! Payment ID: ${response.razorpay_paymentId}`
        );
        setStep("completed");
      },
      prefill: {
        name: session.user.name || "Student",
        email: session.user.email || "",
      },
      theme: {
        color: "#841a1c",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link
          href="/internships"
          className="inline-flex items-center text-gray-500 hover:text-[#841a1c] mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Internships
        </Link>

        {step !== "completed" && (
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#841a1c] mb-2">
              {step === "eligibility"
                ? "Step 1: Eligibility Check"
                : "Step 2: Secure Enrollment"}
            </h1>
            <p className="text-gray-600">
              Application for:{" "}
              <span className="font-semibold text-black">
                {internship.title}
              </span>
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <div
                className={`h-2 w-16 rounded-full ${
                  ["eligibility", "payment", "completed"].includes(step)
                    ? "bg-[#841a1c]"
                    : "bg-gray-200"
                }`}
              />
              <div
                className={`h-2 w-16 rounded-full ${
                  ["payment", "completed"].includes(step)
                    ? "bg-[#841a1c]"
                    : "bg-gray-200"
                }`}
              />
            </div>
          </div>
        )}

        {step === "eligibility" && (
          <EligibilityTest
            track={internship.track}
            onComplete={handleEligibilityComplete}
          />
        )}

        {step === "payment" && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4">
              You&apos;re Eligible! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Congratulations! You scored{" "}
              <strong>{eligibilityScore.toFixed(0)}%</strong> and qualify for
              the <strong>{internship.title}</strong> internship program.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span>Program Fee</span>
                <span
                  className={
                    appliedDiscount
                      ? "line-through text-gray-400"
                      : "font-semibold"
                  }
                >
                  ₹{internship.price.toLocaleString()}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Referral Discount</span>
                  <span className="font-semibold">
                    -₹{appliedDiscount.toLocaleString()}
                  </span>
                </div>
              )}
              {appliedDiscount > 0 && (
                <div className="flex justify-between mb-2 pt-2 border-t">
                  <span className="font-bold">Total Pay</span>
                  <span className="font-bold text-xl text-[#841a1c]">
                    ₹{(internship.price - appliedDiscount).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Duration</span>
                <span>{internship.duration}</span>
              </div>
            </div>

            <div className="mb-6 text-left">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Have a referral code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) =>
                    setReferralCode(e.target.value.toUpperCase())
                  }
                  placeholder="Enter code"
                  disabled={appliedDiscount > 0}
                  className="flex-1 px-3 py-2 border rounded-lg uppercase tracking-wide focus:ring-2 focus:ring-[#841a1c] outline-none"
                />
                <Button
                  type="button"
                  onClick={handleApplyReferral}
                  disabled={
                    !referralCode || isApplyingReferral || appliedDiscount > 0
                  }
                  variant="outline"
                  className="border-[#841a1c] text-[#841a1c] hover:bg-[#841a1c] hover:text-white"
                >
                  {isApplyingReferral ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              {referralError && (
                <p className="text-xs text-red-500 mt-1">{referralError}</p>
              )}
              {appliedDiscount > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  Code applied successfully!
                </p>
              )}
            </div>

            <Button
              onClick={handlePayment}
              className="w-full bg-[#841a1c] hover:bg-[#681416] py-6 text-lg"
            >
              Pay & Enroll Now
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              Secured by Razorpay. 100% Refundable within 7 days.
            </p>
          </div>
        )}

        {step === "completed" && (
          <div className="text-center p-10 bg-white rounded-xl shadow-xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#841a1c] mb-4">
              Enrollment Complete! 🎉
            </h2>
            <div className="space-y-2 mb-8">
              <p className="text-gray-600">
                Eligibility Score:{" "}
                <strong>{eligibilityScore.toFixed(0)}%</strong>
              </p>
              <p className="text-gray-600">
                Payment Status: <strong>Success</strong>
              </p>
            </div>
            <p className="text-lg text-gray-700 mb-8">
              Welcome aboard! You will receive an email shortly with access to
              your dashboard and course materials.
            </p>
            <Link href="/student/dashboard">
              <Button className="bg-[#841a1c] hover:bg-[#681416] w-full max-w-sm">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyPage;
