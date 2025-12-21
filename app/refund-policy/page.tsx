"use client";

import { motion } from "framer-motion";
import RunningHeading from "@/components/RunningHeading";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const RefundPolicyPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="bg-[#fbf2f1] min-h-screen">
      <div className="container py-16">
        <RunningHeading
          words={[
            { text: "CANCELLATION", isOutline: false },
            { text: "&", isOutline: false },
            { text: "REFUNDS", isOutline: true },
          ]}
          speed={40}
          direction="left"
        />

        <div className="max-w-4xl mx-auto mt-20 mb-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    1. Overview
                  </h2>
                  <p className="text-gray-700 mb-4">
                    At Gryffindors, we are committed to providing high-quality
                    educational programs. We understand that circumstances may
                    change, and we have established this Cancellation and Refund
                    Policy to ensure transparency and fairness.
                  </p>
                  <p className="text-gray-700">
                    This policy applies to all internship programs and courses
                    offered through our platform.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    2. 7-Day Refund Policy
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We offer a{" "}
                    <span className="font-semibold">100% refund</span> within{" "}
                    <span className="font-semibold">7 days</span> of your
                    enrollment, no questions asked. If you are not satisfied
                    with our program, simply contact us within this period.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-700 font-medium">
                      ✓ Full refund within 7 days of payment
                    </p>
                    <p className="text-green-700 font-medium">
                      ✓ No questions asked
                    </p>
                    <p className="text-green-700 font-medium">
                      ✓ Refund processed within 5-7 business days
                    </p>
                  </div>
                  <p className="text-gray-700">
                    To request a refund, email us at{" "}
                    <span className="font-medium">support@gryffindors.in</span>{" "}
                    with your payment ID and reason for the refund.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    3. After 7 Days
                  </h2>
                  <p className="text-gray-700 mb-4">
                    After the 7-day period, refunds are handled on a
                    case-by-case basis. We consider:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li>How much of the course has been accessed</li>
                    <li>Time since enrollment</li>
                    <li>Reason for cancellation</li>
                    <li>Any exceptional circumstances</li>
                  </ul>
                  <p className="text-gray-700">
                    Partial refunds may be offered based on the above factors.
                    Contact our support team to discuss your situation.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    4. Non-Refundable Cases
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Refunds will not be provided in the following cases:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li>
                      If more than 50% of the course content has been accessed
                    </li>
                    <li>If any certificate has been issued</li>
                    <li>
                      If the request is made after the program completion date
                    </li>
                    <li>If the user has violated our Terms and Conditions</li>
                    <li>
                      Promotional or discounted purchases (unless specified
                      otherwise)
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    5. Cancellation by Gryffindors
                  </h2>
                  <p className="text-gray-700 mb-4">
                    In rare cases, we may need to cancel a program due to
                    unforeseen circumstances. In such cases:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li>
                      You will receive a full refund of the enrollment fee
                    </li>
                    <li>
                      We will notify you at least 7 days in advance (when
                      possible)
                    </li>
                    <li>
                      You may have the option to transfer to another program
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    6. How to Request a Refund
                  </h2>
                  <p className="text-gray-700 mb-4">
                    To request a cancellation or refund, please follow these
                    steps:
                  </p>
                  <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700">
                    <li>
                      Email us at{" "}
                      <span className="font-medium">
                        support@gryffindors.in
                      </span>
                    </li>
                    <li>Include your registered email address</li>
                    <li>Provide your payment ID or transaction reference</li>
                    <li>State your reason for the refund request</li>
                  </ol>
                  <p className="text-gray-700">
                    We will review your request and respond within 2-3 business
                    days. Approved refunds are processed within 5-7 business
                    days to your original payment method.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    7. Contact Us
                  </h2>
                  <p className="text-gray-700 mb-4">
                    If you have any questions about our Cancellation and Refund
                    Policy, please contact us:
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Email:</span>{" "}
                    support@gryffindors.in
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Response Time:</span> Within
                    24-48 hours
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-[#841a1c] text-white border-none shadow-lg">
                <CardContent className="p-8 text-center">
                  <p className="text-lg mb-2">
                    Your satisfaction is our priority
                  </p>
                  <p className="text-2xl font-bold">
                    100% Refund within 7 Days - No Questions Asked
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="flex justify-center gap-6 mt-12">
            <Link
              href="/terms-and-conditions"
              className="text-[#841a1c] font-medium hover:underline"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="text-[#841a1c] font-medium hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-[#841a1c] font-medium hover:underline"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
