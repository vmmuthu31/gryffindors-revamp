"use client";

import React from "react";
import { motion } from "framer-motion";
import RunningHeading from "@/components/RunningHeading";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const PrivacyPolicyPage = () => {
  // Animation variants for content sections
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
            { text: "PRIVACY", isOutline: false },
            { text: "POLICY", isOutline: true },
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
                    1. Introduction
                  </h2>
                  <p className="text-gray-700 mb-4">
                    At Gryffindors, we respect your privacy and are committed to
                    protecting your personal data. This Privacy Policy explains
                    how we collect, use, and safeguard your information when you
                    visit our website or use our services.
                  </p>
                  <p className="text-gray-700">
                    Please read this Privacy Policy carefully. If you do not
                    agree with the terms of this Privacy Policy, please do not
                    access our website or use our services.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    2. Information We Collect
                  </h2>
                  <p className="text-gray-700 mb-4">
                    <span className="font-medium">Personal Data:</span> We may
                    collect personal identification information such as your
                    name, email address, phone number, and company name when you
                    fill out forms on our website, subscribe to our newsletter,
                    or contact us directly.
                  </p>
                  <p className="text-gray-700 mb-4">
                    <span className="font-medium">Usage Data:</span> We may
                    automatically collect information about how you interact
                    with our website, including your IP address, browser type,
                    pages viewed, time spent on pages, and other diagnostic
                    data.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Blockchain Data:</span> When
                    you interact with our Web3 services, we may collect public
                    blockchain data such as wallet addresses and transaction
                    hashes. This information is publicly available on the
                    blockchain and not considered private.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    3. How We Use Your Information
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We use the information we collect for various purposes,
                    including:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li>To provide and maintain our services</li>
                    <li>To notify you about changes to our services</li>
                    <li>
                      To respond to your inquiries and provide customer support
                    </li>
                    <li>
                      To gather analysis or valuable information to improve our
                      services
                    </li>
                    <li>
                      To send you marketing and promotional communications (with
                      your consent)
                    </li>
                    <li>To detect, prevent, and address technical issues</li>
                  </ul>
                  <p className="text-gray-700">
                    We will never sell your personal information to third
                    parties.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    4. Cookies and Tracking Technologies
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We use cookies and similar tracking technologies to track
                    activity on our website and store certain information.
                    Cookies are files with a small amount of data that may
                    include an anonymous unique identifier.
                  </p>
                  <p className="text-gray-700 mb-4">
                    You can instruct your browser to refuse all cookies or to
                    indicate when a cookie is being sent. However, if you do not
                    accept cookies, you may not be able to use some portions of
                    our website.
                  </p>
                  <p className="text-gray-700">
                    We use both session cookies (which expire when you close
                    your browser) and persistent cookies (which stay on your
                    device until you delete them).
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    5. Data Security
                  </h2>
                  <p className="text-gray-700 mb-4">
                    The security of your data is important to us, but remember
                    that no method of transmission over the Internet or method
                    of electronic storage is 100% secure. While we strive to use
                    commercially acceptable means to protect your personal data,
                    we cannot guarantee its absolute security.
                  </p>
                  <p className="text-gray-700">
                    For blockchain-related services, please be aware that
                    information stored on a blockchain is public by nature and
                    cannot be deleted or modified.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    6. Third-Party Services
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We may employ third-party companies and individuals to
                    facilitate our services, provide services on our behalf,
                    perform service-related functions, or assist us in analyzing
                    how our services are used.
                  </p>
                  <p className="text-gray-700">
                    These third parties have access to your personal data only
                    to perform these tasks on our behalf and are obligated not
                    to disclose or use it for any other purpose.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    7. Your Data Protection Rights
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Depending on your location, you may have certain rights
                    regarding your personal data:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li>
                      The right to access, update, or delete your information
                    </li>
                    <li>
                      The right to rectification (to correct inaccurate data)
                    </li>
                    <li>The right to object to our processing of your data</li>
                    <li>
                      The right to restriction (request that we restrict
                      processing)
                    </li>
                    <li>The right to data portability</li>
                    <li>The right to withdraw consent</li>
                  </ul>
                  <p className="text-gray-700">
                    Please note that these rights may be limited in some
                    circumstances, such as when we have a legal obligation to
                    retain certain data.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    8. Changes to This Privacy Policy
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We may update our Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy
                    on this page and updating the &quot;last updated&quot; date.
                  </p>
                  <p className="text-gray-700 mb-4">
                    You are advised to review this Privacy Policy periodically
                    for any changes. Changes to this Privacy Policy are
                    effective when they are posted on this page.
                  </p>
                  <p className="text-gray-700">
                    This Privacy Policy was last updated on March 14, 2025.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    9. Contact Us
                  </h2>
                  <p className="text-gray-700 mb-4">
                    If you have any questions about this Privacy Policy or our
                    data practices, please contact us at:
                  </p>
                  <p className="text-gray-700">Email: support@gryffindors.in</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="flex justify-center mt-12">
            <Link
              href="/terms-and-conditions"
              className="text-[#841a1c] font-medium hover:underline"
            >
              View our Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
