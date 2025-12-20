"use client";

import React from "react";
import { motion } from "framer-motion";
import RunningHeading from "@/components/RunningHeading";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const TermsPage = () => {
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
            { text: "TERMS", isOutline: false },
            { text: "AND", isOutline: false },
            { text: "CONDITIONS", isOutline: true },
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
                    Welcome to Gryffindors (&quot;Company&quot;, &quot;we&quot;,
                    &quot;our&quot;, &quot;us&quot;)! These Terms and Conditions
                    (&quot;Terms&quot;, &quot;Terms and Conditions&quot;) govern
                    your use of our website located at gryffindors.com (the
                    &quot;Service&quot;) and any associated services operated by
                    Gryffindors.
                  </p>
                  <p className="text-gray-700">
                    By accessing or using the Service, you agree to be bound by
                    these Terms. If you disagree with any part of the terms,
                    then you may not access the Service.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    2. Web3 Services
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Our services include but are not limited to smart contract
                    development, dApp development, DeFi solutions, NFT
                    ecosystems, blockchain consulting, and other Web3-related
                    services.
                  </p>
                  <p className="text-gray-700 mb-4">
                    You acknowledge that blockchain technologies and
                    cryptocurrencies are subject to various risks, including but
                    not limited to volatility, regulatory uncertainty, and
                    technical vulnerabilities.
                  </p>
                  <p className="text-gray-700">
                    While we strive to provide secure and reliable Web3
                    solutions, we make no guarantees regarding the performance,
                    value, or continued availability of blockchain networks or
                    cryptocurrencies.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    3. Intellectual Property
                  </h2>
                  <p className="text-gray-700 mb-4">
                    The Service and its original content (excluding content
                    provided by users), features, and functionality are and will
                    remain the exclusive property of Gryffindors and its
                    licensors. The Service is protected by copyright, trademark,
                    and other laws.
                  </p>
                  <p className="text-gray-700">
                    Our trademarks and trade dress may not be used in connection
                    with any product or service without the prior written
                    consent of Gryffindors.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    4. Project Deliverables
                  </h2>
                  <p className="text-gray-700 mb-4">
                    For custom development projects, all deliverables will be
                    specified in a separate Statement of Work (SOW) or contract
                    between Gryffindors and the client.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Unless explicitly stated otherwise in writing, Gryffindors
                    retains ownership of all proprietary methods, techniques,
                    processes, and reusable code components developed during the
                    course of providing services.
                  </p>
                  <p className="text-gray-700">
                    Upon full payment for services, clients are granted
                    appropriate license rights to deliverables as specified in
                    their individual agreements.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    5. Links To Other Websites
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Our Service may contain links to third-party websites or
                    services that are not owned or controlled by Gryffindors.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Gryffindors has no control over, and assumes no
                    responsibility for, the content, privacy policies, or
                    practices of any third-party websites or services. You
                    further acknowledge and agree that Gryffindors shall not be
                    responsible or liable, directly or indirectly, for any
                    damage or loss caused or alleged to be caused by or in
                    connection with the use of or reliance on any such content,
                    goods, or services available on or through any such websites
                    or services.
                  </p>
                  <p className="text-gray-700">
                    We strongly advise you to read the terms and conditions and
                    privacy policies of any third-party websites or services
                    that you visit.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    6. Termination
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We may terminate or suspend your access to our Service
                    immediately, without prior notice or liability, for any
                    reason whatsoever, including without limitation if you
                    breach the Terms.
                  </p>
                  <p className="text-gray-700">
                    All provisions of the Terms which by their nature should
                    survive termination shall survive termination, including,
                    without limitation, ownership provisions, warranty
                    disclaimers, indemnity, and limitations of liability.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    7. Governing Law
                  </h2>
                  <p className="text-gray-700 mb-4">
                    These Terms shall be governed and construed in accordance
                    with the laws of India, without regard to its conflict of
                    law provisions.
                  </p>
                  <p className="text-gray-700">
                    Our failure to enforce any right or provision of these Terms
                    will not be considered a waiver of those rights. If any
                    provision of these Terms is held to be invalid or
                    unenforceable by a court, the remaining provisions of these
                    Terms will remain in effect.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#841a1c] mb-4">
                    8. Changes To Terms
                  </h2>
                  <p className="text-gray-700 mb-4">
                    We reserve the right, at our sole discretion, to modify or
                    replace these Terms at any time. If a revision is material,
                    we will try to provide at least 30 days&apos; notice prior
                    to any new terms taking effect.
                  </p>
                  <p className="text-gray-700 mb-4">
                    By continuing to access or use our Service after those
                    revisions become effective, you agree to be bound by the
                    revised terms. If you do not agree to the new terms, please
                    stop using the Service.
                  </p>
                  <p className="text-gray-700">
                    These Terms and Conditions were last updated on March 14,
                    2025.
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
                    If you have any questions about these Terms, please contact
                    us at:
                  </p>
                  <p className="text-gray-700">Email: support@gryffindors.in</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="flex justify-center mt-12">
            <Link
              href="/privacy-policy"
              className="text-[#841a1c] font-medium hover:underline"
            >
              View our Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
