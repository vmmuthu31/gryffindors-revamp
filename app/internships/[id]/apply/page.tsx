"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import EligibilityTest from "@/components/internship/EligibilityTest";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, User, Mail } from "lucide-react";
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
  razorpay_payment_id: string;
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
  modal?: {
    ondismiss?: () => void;
  };
  prefill: { name: string; email: string };
  theme: { color: string };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

type Step = "eligibility" | "userDetails" | "payment" | "completed";

const ApplyPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const internshipId = params.id as string;

  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("eligibility");
  const [eligibilityScore, setEligibilityScore] = useState(0);

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [referralCode, setReferralCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [referralError, setReferralError] = useState("");
  const [isApplyingReferral, setIsApplyingReferral] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
      setStep("userDetails");
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUserDetailsSubmit = () => {
    let hasError = false;

    if (!studentName.trim()) {
      setNameError("Name is required");
      hasError = true;
    } else if (studentName.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!studentEmail.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(studentEmail)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!hasError) {
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

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const verifyPayment = async (
    response: RazorpayResponse
  ): Promise<boolean> => {
    try {
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          internshipId: internship.id,
          internshipTitle: internship.title,
          discountApplied: appliedDiscount,
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim().toLowerCase(),
        }),
      });

      const data = await verifyRes.json();

      if (verifyRes.ok && data.success) {
        return true;
      } else {
        console.error("Payment verification failed:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      return false;
    }
  };

  const handlePayment = async () => {
    if (!studentEmail || !studentName) {
      toast.error("Please fill in your details first");
      setStep("userDetails");
      return;
    }

    if (isProcessingPayment) {
      return;
    }

    setIsProcessingPayment(true);

    try {
      const scriptLoaded = await loadRazorpay();

      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        setIsProcessingPayment(false);
        return;
      }

      const finalAmount = Math.max(0, internship.price - appliedDiscount);

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          internshipId: internship.id,
          internshipTitle: internship.title,
          studentEmail: studentEmail.trim().toLowerCase(),
          studentName: studentName.trim(),
        }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        toast.error(errorData.error || "Failed to create order");
        setIsProcessingPayment(false);
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
        handler: async function (response: RazorpayResponse) {
          toast.loading("Verifying payment...", { id: "payment-verify" });

          const verified = await verifyPayment(response);

          toast.dismiss("payment-verify");

          if (verified) {
            toast.success("Payment Successful! Please verify your email.");
            router.push(
              `/auth/verify-email?email=${encodeURIComponent(
                studentEmail.trim().toLowerCase()
              )}`
            );
          } else {
            toast.error(
              "Payment received but verification failed. Please contact support."
            );
          }

          setIsProcessingPayment(false);
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            toast.info("Payment cancelled. You can try again.");
          },
        },
        prefill: {
          name: studentName,
          email: studentEmail,
        },
        theme: {
          color: "#841a1c",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  const getStepNumber = (currentStep: Step): number => {
    const steps: Step[] = [
      "eligibility",
      "userDetails",
      "payment",
      "completed",
    ];
    return steps.indexOf(currentStep) + 1;
  };

  const getStepTitle = (currentStep: Step): string => {
    switch (currentStep) {
      case "eligibility":
        return "Step 1: Eligibility Check";
      case "userDetails":
        return "Step 2: Your Details";
      case "payment":
        return "Step 3: Secure Enrollment";
      default:
        return "";
    }
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
              {getStepTitle(step)}
            </h1>
            <p className="text-gray-600">
              Application for:{" "}
              <span className="font-semibold text-black">
                {internship.title}
              </span>
            </p>
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`h-2 w-16 rounded-full ${
                    getStepNumber(step) >= stepNum
                      ? "bg-[#841a1c]"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {step === "eligibility" && (
          <EligibilityTest
            track={internship.track}
            onComplete={handleEligibilityComplete}
          />
        )}

        {step === "userDetails" && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
              <p className="text-gray-600">
                You scored <strong>{eligibilityScore.toFixed(0)}%</strong> and
                qualify for the program.
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Enter Your Details</h3>
              <p className="text-sm text-gray-500 mb-6">
                We&apos;ll use this information to create your account and send
                login credentials after payment.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => {
                        setStudentName(e.target.value);
                        setNameError("");
                      }}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] outline-none ${
                        nameError ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {nameError && (
                    <p className="text-xs text-red-500 mt-1">{nameError}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => {
                        setStudentEmail(e.target.value);
                        setEmailError("");
                      }}
                      placeholder="Enter your email address"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] outline-none ${
                        emailError ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-xs text-red-500 mt-1">{emailError}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Login credentials will be sent to this email
                  </p>
                </div>
              </div>

              <Button
                onClick={handleUserDetailsSubmit}
                className="w-full mt-6 bg-[#841a1c] hover:bg-[#681416] py-6 text-lg"
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4">
              Complete Your Enrollment
            </h2>
            <p className="text-gray-600 mb-6">
              Almost there, <strong>{studentName}</strong>! Complete payment to
              start your journey.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2 text-sm text-gray-500">
                <span>Email</span>
                <span className="text-gray-700">{studentEmail}</span>
              </div>
            </div>

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
              <div className="flex flex-col sm:flex-row gap-2">
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
              disabled={isProcessingPayment}
              className="w-full bg-[#841a1c] hover:bg-[#681416] py-6 text-lg disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Pay & Enroll Now"
              )}
            </Button>
            <p className="text-xs text-gray-400 mt-4">
              Secured by Razorpay. 100% Refundable within 7 days.
            </p>

            <button
              onClick={() => setStep("userDetails")}
              className="mt-4 text-sm text-gray-500 hover:text-[#841a1c]"
            >
              ← Edit your details
            </button>
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
                Payment Status:{" "}
                <strong className="text-green-600">Success</strong>
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800">
                📧 We&apos;ve sent your login credentials to{" "}
                <strong>{studentEmail}</strong>
              </p>
            </div>
            <p className="text-lg text-gray-700 mb-8">
              Welcome aboard, <strong>{studentName}</strong>! Check your email
              for access details.
            </p>
            <Link href="/auth/login">
              <Button className="bg-[#841a1c] hover:bg-[#681416] w-full max-w-sm">
                Go to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyPage;
