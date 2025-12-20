"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import RunningHeading from "@/components/RunningHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ServiceType {
  id: number;
  title: string;
  icon: string;
  description: string;
  features: string[];
  caseStudy?: {
    title: string;
    description: string;
  };
}

const ServicesPage = () => {
  const [expandedService, setExpandedService] = useState<number | null>(null);

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

  const services: ServiceType[] = [
    {
      id: 1,
      title: "Smart Contract Development",
      icon: "/assets/services/smart-contract-icon.svg",
      description:
        "We build secure, auditable, and efficient smart contracts that power decentralized applications across multiple blockchain platforms.",
      features: [
        "Solidity and Rust contract development",
        "Security-first approach with best practices",
        "Comprehensive testing and verification",
        "Upgradable contract patterns",
        "Multi-chain compatibility",
        "Gas optimization techniques",
      ],
      caseStudy: {
        title: "DeFi Protocol Smart Contracts",
        description:
          "Developed secure staking and reward distribution contracts for a DeFi protocol, resulting in $20M+ TVL within three months of launch.",
      },
    },
    {
      id: 2,
      title: "dApp Development",
      icon: "/assets/services/dapp-icon.svg",
      description:
        "End-to-end decentralized application development that combines blockchain backend with intuitive frontend experiences.",
      features: [
        "Full-stack dApp architecture",
        "React, Next.js frontend development",
        "Web3 integration with wallets and providers",
        "Backend infrastructure setup",
        "Responsive UI/UX design",
        "Performance optimization",
      ],
      caseStudy: {
        title: "NFT Marketplace dApp",
        description:
          "Built a custom NFT marketplace with advanced filtering, bidding functionality, and creator royalties, processing over 5,000 transactions in the first month.",
      },
    },
    {
      id: 3,
      title: "DeFi & Web3 Payment Solutions",
      icon: "/assets/services/defi-icon.svg",
      description:
        "Custom decentralized finance solutions and Web3 payment systems that enable new financial primitives and business models.",
      features: [
        "Liquidity pool implementation",
        "Tokenomics design and implementation",
        "Yield farming mechanisms",
        "Cross-chain bridges",
        "Web3 payment gateway integration",
        "Financial security auditing",
      ],
      caseStudy: {
        title: "Cross-Chain Liquidity Solution",
        description:
          "Engineered a cross-chain liquidity protocol that reduced slippage by 60% and enhanced capital efficiency for traders and liquidity providers.",
      },
    },
    {
      id: 4,
      title: "NFT & Tokenization Services",
      icon: "/assets/services/nft-icon.svg",
      description:
        "End-to-end NFT development and tokenization services to bring digital and real-world assets onto the blockchain.",
      features: [
        "ERC-721 and ERC-1155 token development",
        "Generative art systems",
        "Metadata handling and IPFS integration",
        "Royalty and revenue sharing mechanics",
        "Asset tokenization frameworks",
        "Marketplace integration",
      ],
    },
    {
      id: 5,
      title: "On-Chain Data Analytics & Insights",
      icon: "/assets/services/analytics-icon.svg",
      description:
        "Extract valuable insights from blockchain data to inform business decisions and strategy.",
      features: [
        "Custom analytics dashboards",
        "Real-time on-chain data monitoring",
        "Wallet profiling and segmentation",
        "Transaction pattern analysis",
        "Market intelligence reports",
        "Competitive landscape mapping",
      ],
    },
    {
      id: 6,
      title: "GameFi & Metaverse Development",
      icon: "/assets/services/gamefi-icon.svg",
      description:
        "Build immersive blockchain games and metaverse experiences with play-to-earn mechanics and digital ownership.",
      features: [
        "GameFi tokenomics design",
        "In-game asset development",
        "Unity and Unreal Engine integration",
        "Play-to-earn mechanics",
        "Virtual world building",
        "Metaverse infrastructure",
      ],
      caseStudy: {
        title: "Web3 Gaming Platform",
        description:
          "Developed an on-chain gaming platform with customizable avatars and tournaments, achieving 50,000 monthly active users within six months.",
      },
    },
    {
      id: 7,
      title: "Product & Growth Design",
      icon: "/assets/services/product-icon.svg",
      description:
        "Strategic product design and growth strategies tailored for Web3 projects to maximize adoption and engagement.",
      features: [
        "User experience research and design",
        "Growth hacking for Web3 products",
        "Onboarding optimization",
        "Conversion funnel analysis",
        "Community-led growth strategies",
        "A/B testing frameworks",
      ],
    },
    {
      id: 8,
      title: "Design Systems & Branding",
      icon: "/assets/services/design-icon.svg",
      description:
        "Create cohesive visual identities and design systems for Web3 projects that communicate your vision and values.",
      features: [
        "Brand identity development",
        "Design system creation",
        "UI component libraries",
        "Visual language definition",
        "Responsive design principles",
        "Accessibility guidelines",
      ],
    },
  ];

  const toggleService = (id: number) => {
    if (expandedService === id) {
      setExpandedService(null);
    } else {
      setExpandedService(id);
    }
  };

  const renderServiceIcon = () => {
    return (
      <div className="w-16 h-16 rounded-full bg-[#841a1c]/10 flex items-center justify-center mb-4">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="#841a1c"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="#841a1c"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="#841a1c"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-[#fbf2f1] min-h-screen">
      <div className="container py-16">
        <RunningHeading
          words={[
            { text: "OUR", isOutline: false },
            { text: "SERVICES", isOutline: true },
          ]}
          speed={40}
          direction="left"
        />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-3xl md:text-4xl font-bold text-[#841a1c] mb-6">
              Building secure, scalable, and user-friendly Web3 solutions
            </p>
            <p className="text-gray-700 max-w-3xl mx-auto text-lg">
              From game-changing smart contracts to high-impact dApps, we turn
              ambitious Web3 visions into reality. With a track record of
              winning, scaling, and innovating, we help startups, DAOs, and
              enterprises push the boundaries of what&apos;s possible on-chain.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <Card
                  className={`bg-white/50 backdrop-blur-sm border-none shadow-sm hover:shadow-md transition-all duration-300 h-full ${
                    expandedService === service.id
                      ? "ring-2 ring-[#841a1c]/20"
                      : ""
                  }`}
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col h-full">
                      {renderServiceIcon()}
                      <p className="text-2xl font-bold text-[#841a1c] mb-3">
                        {service.title}
                      </p>
                      <p className="text-gray-700 mb-4">
                        {service.description}
                      </p>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          expandedService === service.id
                            ? "max-h-[1000px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="pt-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Key Features:
                          </h4>
                          <ul className="list-disc pl-5 mb-4 space-y-1 text-gray-700">
                            {service.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>

                          {service.caseStudy && (
                            <div className="mt-4 bg-[#841a1c]/5 p-4 rounded-md">
                              <h4 className="font-medium text-[#841a1c] mb-1">
                                Case Study: {service.caseStudy.title}
                              </h4>
                              <p className="text-sm text-gray-700">
                                {service.caseStudy.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto pt-4">
                        <Button
                          variant="outline"
                          onClick={() => toggleService(service.id)}
                          className="w-full border-[#841a1c] text-[#841a1c] hover:bg-[#841a1c] hover:text-white"
                        >
                          {expandedService === service.id
                            ? "Show Less"
                            : "Learn More"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-24"
          >
            <p className="text-3xl font-bold text-[#841a1c] mb-12 text-center">
              Our Development Process
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Discovery",
                  description:
                    "We define your vision, goals, technical requirements, and roadmap.",
                },
                {
                  step: "02",
                  title: "Design",
                  description:
                    "Architecting solutions with security, scalability, and user experience in mind.",
                },
                {
                  step: "03",
                  title: "Development",
                  description:
                    "Building secure and efficient code with regular milestone reviews.",
                },
                {
                  step: "04",
                  title: "Deployment",
                  description:
                    "Rigorous testing, audit preparation, and seamless launch support.",
                },
              ].map((phase, index) => (
                <Card
                  key={index}
                  className="bg-white/50 backdrop-blur-sm border-none shadow-sm"
                >
                  <CardContent className="p-6">
                    <div className="text-[#841a1c]/20 text-4xl font-bold mb-3">
                      {phase.step}
                    </div>
                    <p className="text-xl font-bold text-[#841a1c] mb-2">
                      {phase.title}
                    </p>
                    <p className="text-gray-700">{phase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-24 text-center"
          >
            <Card className="bg-[#841a1c] text-white border-none shadow-lg overflow-hidden">
              <CardContent className="p-12 relative">
                <div className="absolute right-0 top-0 opacity-10">
                  <svg
                    width="300"
                    height="300"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>

                <p className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
                  Ready to build your Web3 vision?
                </p>
                <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8 relative z-10">
                  Let&apos;s collaborate to create innovative blockchain
                  solutions that push the boundaries of what&apos;s possible.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                  <Button
                    asChild
                    className="bg-white text-[#841a1c] hover:bg-white/90 px-8 py-6 text-lg"
                  >
                    <Link href="/contact">Contact Us</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                  >
                    <Link href="/portfolio">View Our Work</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
