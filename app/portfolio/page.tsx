"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import RunningHeading from "@/components/RunningHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Define project types
type ProjectCategory = "all" | "defi" | "nft" | "dao" | "gaming" | "dapp";

interface ProjectType {
  id: number;
  title: string;
  category: ProjectCategory[];
  image: string;
  description: string;
  technologies: string[];
  metrics: {
    name: string;
    value: number;
    unit: string;
    change: number;
  }[];
  timeline: {
    name: string;
    value: number;
  }[];
  completion: number;
  link?: string;
}

const PortfolioPage = () => {
  // State for filtering projects
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );

  // Animation variants
  const containerVariants: Record<string, any> = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Record<string, any> = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Colors for charts
  const COLORS = [
    "#841a1c",
    "#d79c64",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
  ];

  // Portfolio overall KPIs
  const portfolioKPIs = [
    {
      title: "Total Projects",
      value: 48,
      change: 12,
      icon: (
        <svg
          className="w-6 h-6 text-[#841a1c]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "TVL (Total Value Locked)",
      value: 86.5,
      unit: "M",
      change: 24.3,
      icon: (
        <svg
          className="w-6 h-6 text-[#841a1c]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Active Users",
      value: 248.7,
      unit: "K",
      change: 18.2,
      icon: (
        <svg
          className="w-6 h-6 text-[#841a1c]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21pv-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      title: "Transaction Volume",
      value: 1.28,
      unit: "B",
      change: 32.5,
      icon: (
        <svg
          className="w-6 h-6 text-[#841a1c]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2p0a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2pa2 2 0 002-2M9 5a2 2 0 012-2pa2 2 0 012 2"
          />
        </svg>
      ),
    },
  ];

  // Chart data for portfolio overview
  const projectsByCategory = [
    { name: "DeFi", value: 35 },
    { name: "NFT", value: 25 },
    { name: "DAO", value: 15 },
    { name: "Gaming", value: 10 },
    { name: "Other dApps", value: 15 },
  ];

  const monthlyGrowthData = [
    { name: "Jan", defi: 4, nft: 2, dao: 1, gaming: 0 },
    { name: "Feb", defi: 5, nft: 3, dao: 1, gaming: 1 },
    { name: "Mar", defi: 6, nft: 4, dao: 2, gaming: 1 },
    { name: "Apr", defi: 8, nft: 5, dao: 2, gaming: 2 },
    { name: "May", defi: 10, nft: 7, dao: 3, gaming: 2 },
    { name: "Jun", defi: 12, nft: 9, dao: 4, gaming: 3 },
  ];

  const performanceMetrics = [
    { subject: "Security", A: 95, fullMark: 100 },
    { subject: "Scalability", A: 88, fullMark: 100 },
    { subject: "Innovation", A: 92, fullMark: 100 },
    { subject: "UX/UI", A: 90, fullMark: 100 },
    { subject: "Performance", A: 85, fullMark: 100 },
    { subject: "Integration", A: 89, fullMark: 100 },
  ];

  // Project data based on Gryffindors' focus areas
  const projects: ProjectType[] = [
    {
      id: 1,
      title: "DeFi Lending Protocol",
      category: ["defi", "dapp"],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlhuYYDLNp30cV_1u6Q7znzfzECXcL7tpfg&s",
      description:
        "A decentralized lending platform enabling users to borrow assets using crypto as collateral, with optimized interest rates and liquidity incentives.",
      technologies: ["Solidity", "React", "Ethers.js", "TheGraph", "Chainlink"],
      metrics: [
        { name: "TVL", value: 15.2, unit: "M", change: 24 },
        { name: "Users", value: 8.7, unit: "K", change: 32 },
        { name: "Txs", value: 125, unit: "K", change: 18 },
      ],
      timeline: [
        { name: "Jan", value: 2.4 },
        { name: "Feb", value: 4.8 },
        { name: "Mar", value: 7.5 },
        { name: "Apr", value: 9.2 },
        { name: "May", value: 12.7 },
        { name: "Jun", value: 15.2 },
      ],
      completion: 100,
    },
    {
      id: 2,
      title: "NFT Marketplace",
      category: ["nft", "dapp"],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlhuYYDLNp30cV_1u6Q7znzfzECXcL7tpfg&s",
      description:
        "A curated NFT marketplace focused on digital artists, featuring gasless minting, royalties, and a unique social discovery mechanism.",
      technologies: ["Solidity", "Next.js", "IPFS", "ERC-721", "ERC-1155"],
      metrics: [
        { name: "Volume", value: 3.5, unit: "M", change: 45 },
        { name: "Artists", value: 215, unit: "", change: 28 },
        { name: "NFTs", value: 12.5, unit: "K", change: 52 },
      ],
      timeline: [
        { name: "Jan", value: 0.4 },
        { name: "Feb", value: 0.9 },
        { name: "Mar", value: 1.5 },
        { name: "Apr", value: 2.2 },
        { name: "May", value: 2.9 },
        { name: "Jun", value: 3.5 },
      ],
      completion: 100,
    },
    {
      id: 3,
      title: "DAO Governance Platform",
      category: ["dao", "dapp"],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlhuYYDLNp30cV_1u6Q7znzfzECXcL7tpfg&s",
      description:
        "A comprehensive DAO governance framework enabling proposal creation, voting, treasury management, and delegate voting with on-chain execution.",
      technologies: ["Solidity", "React", "Aragon", "Snapshot", "ENS"],
      metrics: [
        { name: "DAOs", value: 28, unit: "", change: 75 },
        { name: "Treasury", value: 42.8, unit: "M", change: 34 },
        { name: "Proposals", value: 1.2, unit: "K", change: 22 },
      ],
      timeline: [
        { name: "Jan", value: 5 },
        { name: "Feb", value: 8 },
        { name: "Mar", value: 12 },
        { name: "Apr", value: 16 },
        { name: "May", value: 22 },
        { name: "Jun", value: 28 },
      ],
      completion: 100,
    },
    {
      id: 4,
      title: "Play-to-Earn Game",
      category: ["gaming", "nft"],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlhuYYDLNp30cV_1u6Q7znzfzECXcL7tpfg&s",
      description:
        "An immersive play-to-earn RPG game with NFT characters, land ownership, and in-game economy with deflationary token mechanics.",
      technologies: ["Unity", "Solidity", "ERC-721", "ERC-20", "Polygon"],
      metrics: [
        { name: "Players", value: 52.4, unit: "K", change: 128 },
        { name: "Revenue", value: 2.8, unit: "M", change: 87 },
        { name: "NFTs", value: 9.7, unit: "K", change: 42 },
      ],
      timeline: [
        { name: "Jan", value: 4.2 },
        { name: "Feb", value: 12.8 },
        { name: "Mar", value: 22.5 },
        { name: "Apr", value: 35.2 },
        { name: "May", value: 44.7 },
        { name: "Jun", value: 52.4 },
      ],
      completion: 100,
    },
    {
      id: 5,
      title: "Cross-Chain DEX",
      category: ["defi", "dapp"],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlhuYYDLNp30cV_1u6Q7znzfzECXcL7tpfg&s",
      description:
        "A DEX aggregator that sources liquidity from multiple chains and protocols to provide the best swap rates with minimal slippage.",
      technologies: [
        "Solidity",
        "Rust",
        "React",
        "Cross-chain bridges",
        "AMMs",
      ],
      metrics: [
        { name: "Volume", value: 124.5, unit: "M", change: 65 },
        { name: "Users", value: 18.2, unit: "K", change: 42 },
        { name: "Chains", value: 5, unit: "", change: 25 },
      ],
      timeline: [
        { name: "Jan", value: 18.4 },
        { name: "Feb", value: 42.8 },
        { name: "Mar", value: 67.5 },
        { name: "Apr", value: 82.2 },
        { name: "May", value: 102.7 },
        { name: "Jun", value: 124.5 },
      ],
      completion: 100,
    },
    {
      id: 6,
      title: "Identity Solution",
      category: ["dapp"],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlhuYYDLNp30cV_1u6Q7znzfzECXcL7tpfg&s",
      description:
        "A self-sovereign identity platform allowing users to control their personal data while enabling verifiable credentials for applications.",
      technologies: [
        "DIDs",
        "Verifiable Credentials",
        "IPFS",
        "zkProofs",
        "Ceramic",
      ],
      metrics: [
        { name: "Verifications", value: 108.7, unit: "K", change: 84 },
        { name: "Partners", value: 12, unit: "", change: 50 },
        { name: "Efficiency", value: 72, unit: "%", change: 28 },
      ],
      timeline: [
        { name: "Jan", value: 12.4 },
        { name: "Feb", value: 24.8 },
        { name: "Mar", value: 45.5 },
        { name: "Apr", value: 62.2 },
        { name: "May", value: 89.7 },
        { name: "Jun", value: 108.7 },
      ],
      completion: 100,
    },
    {
      id: 7,
      title: "Staking Platform",
      category: ["defi"],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlhuYYDLNp30cV_1u6Q7znzfzECXcL7tpfg&s",
      description:
        "Advanced staking solution with flexible lock periods, compounding rewards, and multi-asset support.",
      technologies: ["Solidity", "Next.js", "TheGraph", "zkSync", "Starknet"],
      metrics: [
        { name: "Staked", value: 32.6, unit: "M", change: 45 },
        { name: "APY", value: 14.8, unit: "%", change: 12 },
        { name: "Users", value: 6.2, unit: "K", change: 38 },
      ],
      timeline: [
        { name: "Feb", value: 8.4 },
        { name: "Mar", value: 14.8 },
        { name: "Apr", value: 19.5 },
        { name: "May", value: 25.2 },
        { name: "Jun", value: 32.6 },
      ],
      completion: 85,
    },
    {
      id: 8,
      title: "Metaverse Project",
      category: ["gaming", "nft"],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFlhuYYDLNp30cV_1u6Q7znzfzECXcL7tpfg&s",
      description:
        "Decentralized virtual world with land ownership, social experiences, and community-driven governance.",
      technologies: ["Unity", "WebGL", "ERC-721", "ERC-1155", "WebRTC"],
      metrics: [
        { name: "Users", value: 18.4, unit: "K", change: 142 },
        { name: "Land NFTs", value: 5.2, unit: "K", change: 68 },
        { name: "Events", value: 124, unit: "", change: 45 },
      ],
      timeline: [
        { name: "Mar", value: 2.8 },
        { name: "Apr", value: 8.5 },
        { name: "May", value: 12.2 },
        { name: "Jun", value: 18.4 },
      ],
      completion: 65,
    },
  ];

  // Filter projects based on active category
  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) =>
          project.category.includes(activeCategory as ProjectCategory)
        );

  return (
    <div className="container py-16">
      <RunningHeading
        words={[
          { text: "PORTFOLIO", isOutline: false },
          { text: "DASHBOARD", isOutline: true },
        ]}
        speed={40}
        direction="left"
      />

      <div className="max-w-7xl mx-auto mt-20">
        {/* Portfolio Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#841a1c]">
                Portfolio Analytics
              </p>
              <p className="text-gray-700 mt-2">
                Real-time insights into our Web3 projects and performance
                metrics
              </p>
            </div>

            <div className="flex mt-4 md:mt-0 bg-white/50 rounded-lg p-1">
              <button
                onClick={() => setTimeRange("week")}
                className={`px-4 py-2 rounded-md text-sm ${
                  timeRange === "week"
                    ? "bg-[#841a1c] text-white"
                    : "text-gray-700 hover:bg-white/80"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange("month")}
                className={`px-4 py-2 rounded-md text-sm ${
                  timeRange === "month"
                    ? "bg-[#841a1c] text-white"
                    : "text-gray-700 hover:bg-white/80"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange("year")}
                className={`px-4 py-2 rounded-md text-sm ${
                  timeRange === "year"
                    ? "bg-[#841a1c] text-white"
                    : "text-gray-700 hover:bg-white/80"
                }`}
              >
                Year
              </button>
            </div>
          </div>
        </motion.div>

        {/* Key Performance Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {portfolioKPIs.map((kpi, index) => (
            <Card
              key={index}
              className="bg-white/80 border-none shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      {kpi.title}
                    </p>
                    <div className="flex items-end mt-1">
                      <p className="text-2xl font-bold text-gray-900">
                        {kpi.value}
                      </p>
                      {kpi.unit && (
                        <span className="text-xl font-bold ml-0.5 text-gray-900">
                          {kpi.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-[#841a1c]/10 p-2 rounded-lg">
                    {kpi.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div
                    className={`flex items-center ${
                      kpi.change > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {kpi.change > 0 ? (
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                    <span className="font-medium">{Math.abs(kpi.change)}%</span>
                  </div>
                  <span className="text-gray-500 text-sm ml-2">
                    vs. last period
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Analytics Charts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
        >
          {/* Projects by Category */}
          <Card className="bg-white/80 border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-lg font-semibold text-gray-900 mb-6">
                Projects by Category
              </p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({
                        name,
                        percent,
                      }: {
                        name: string;
                        percent: number;
                      }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {projectsByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `${value} Projects`,
                        "Count",
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Growth */}
          <Card className="bg-white/80 border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-lg font-semibold text-gray-900 mb-6">
                Monthly Project Growth
              </p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyGrowthData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="defi" stackId="a" fill="#841a1c" />
                    <Bar dataKey="nft" stackId="a" fill="#d79c64" />
                    <Bar dataKey="dao" stackId="a" fill="#8884d8" />
                    <Bar dataKey="gaming" stackId="a" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-white/80 border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-lg font-semibold text-gray-900 mb-6">
                Performance Metrics
              </p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={performanceMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Gryffindors"
                      dataKey="A"
                      stroke="#841a1c"
                      fill="#841a1c"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Projects */}
          <Card className="bg-white/80 border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                Top-Performing Projects
              </p>
              <div className="space-y-4">
                {projects.slice(0, 4).map((project, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden mr-4 flex-shrink-0">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {project.title}
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge
                          variant="outline"
                          className="bg-[#841a1c]/10 text-[#841a1c] border-none text-xs"
                        >
                          {project.category[0]}
                        </Badge>
                        <span className="ml-2 text-xs text-gray-500">
                          {project.metrics[0].value}
                          {project.metrics[0].unit} {project.metrics[0].name}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex items-center ${
                        project.metrics[0].change > 0
                          ? "text-green-600"
                          : "text-red-600"
                      } ml-4`}
                    >
                      {project.metrics[0].change > 0 ? (
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                      <span className="font-medium text-sm">
                        {Math.abs(project.metrics[0].change)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project filters */}
        <div className="mb-10">
          <p className="text-2xl font-bold text-[#841a1c] mb-6">
            Project Portfolio
          </p>
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-white/50 p-1">
              {["all", "defi", "nft", "dao", "gaming", "dapp"].map(
                (category) => (
                  <Tab
                    key={category}
                    className={({ selected }: { selected: boolean }) =>
                      `w-full py-2.5 text-sm font-medium leading-5 rounded-lg transition-all duration-200
                      ${
                        selected
                          ? "bg-[#841a1c] text-white shadow"
                          : "text-gray-700 hover:bg-white/[0.12] hover:text-[#841a1c]"
                      }`
                    }
                    onClick={() =>
                      setActiveCategory(category as ProjectCategory)
                    }
                  >
                    {category.toUpperCase()}
                  </Tab>
                )
              )}
            </Tab.List>
          </Tab.Group>
        </div>

        {/* Projects grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card className="bg-white/80 border-none shadow-sm hover:shadow-md transition-all duration-300 h-full overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="outline"
                      className="bg-[#841a1c] text-white border-none"
                    >
                      {project.completion === 100 ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {project.category.map((cat) => (
                      <Badge
                        key={cat}
                        variant="outline"
                        className="bg-black/50 text-white border-none backdrop-blur-sm text-xs"
                      >
                        {cat.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-xl font-bold text-[#841a1c] mb-3">
                    {project.title}
                  </p>
                  <p className="text-gray-700 text-sm mb-5 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Project Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {project.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-lg p-2 text-center"
                      >
                        <p className="text-xs text-gray-500">{metric.name}</p>
                        <div className="flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-900">
                            {metric.value}
                          </span>
                          {metric.unit && (
                            <span className="text-sm ml-0.5">
                              {metric.unit}
                            </span>
                          )}
                        </div>
                        <div
                          className={`flex items-center justify-center text-xs ${
                            metric.change > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {metric.change > 0 ? (
                            <svg
                              className="w-3 h-3 mr-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3 mr-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                          <span>{Math.abs(metric.change)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Project Timeline Chart */}
                  <div className="h-32 mb-5">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={project.timeline}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip
                          formatter={(value: number) => [
                            `${value} ${project.metrics[0].unit}`,
                            project.metrics[0].name,
                          ]}
                          labelFormatter={(label: string) => `Month: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#841a1c"
                          strokeWidth={2}
                          dot={{ fill: "#841a1c", r: 4 }}
                          activeDot={{ r: 6, fill: "#841a1c" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Technologies */}
                  <div className="mb-5">
                    <p className="text-xs text-gray-500 mb-2">Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-[#841a1c]/10 text-[#841a1c] border-none text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-700 border-none text-xs"
                        >
                          +{project.technologies.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Completion Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-gray-500">Completion</p>
                      <p className="text-xs font-medium text-gray-700">
                        {project.completion}%
                      </p>
                    </div>
                    <Progress
                      value={project.completion}
                      className="h-2 bg-gray-100"
                    />
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <Button
                      variant="outline"
                      className="text-xs border-[#841a1c] text-[#841a1c] hover:bg-[#841a1c] hover:text-white"
                    >
                      View Details
                    </Button>

                    <Link
                      href={project.link || "#"}
                      className="text-xs text-[#841a1c] hover:underline"
                    >
                      Live Demo →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Portfolio Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <Card className="bg-gradient-to-r from-[#841a1c] to-[#bf2a2d] text-white border-none shadow-lg overflow-hidden">
            <CardContent className="p-8 md:p-12 relative">
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

              <div className="max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <p className="text-white/70 mb-1">Project Success Rate</p>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">98.2</span>
                      <span className="text-xl ml-1">%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/70 mb-1">Client Satisfaction</p>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">4.9</span>
                      <span className="text-xl ml-1">/5</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/70 mb-1">Web3 Expertise Level</p>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">Elite</span>
                      <span className="text-xl ml-1">Tier</span>
                    </div>
                  </div>
                </div>

                <p className="text-2xl md:text-3xl font-bold mb-4 relative z-10">
                  Ready to transform your Web3 vision into reality?
                </p>
                <p className="text-white/80 text-lg max-w-3xl mb-8 relative z-10">
                  With our data-driven approach and blockchain expertise, we
                  deliver solutions that drive real-world results.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                  <Button
                    asChild
                    className="bg-white text-[#841a1c] hover:bg-white/90 px-8 py-6"
                  >
                    <Link href="/contact">Schedule a Consultation</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-6"
                  >
                    <Link href="/services">Explore Our Services</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 mb-10"
        >
          <p className="text-2xl font-bold text-[#841a1c] mb-8">
            Recent Achievements
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/80 border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="mb-4 bg-[#841a1c]/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#841a1c]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Top 10 Web3 Development Companies
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Recognized among the top 10 Web3 development companies by
                  TechRadar Pro for our innovative blockchain solutions.
                </p>
                <p className="text-xs text-gray-500">June 2025</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="mb-4 bg-[#841a1c]/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#841a1c]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Security Excellence Award
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Received the Security Excellence Award at the Blockchain
                  Summit for our commitment to secure smart contract
                  development.
                </p>
                <p className="text-xs text-gray-500">April 2025</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="mb-4 bg-[#841a1c]/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#841a1c]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20pv-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  25th Hackathon Win
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Our team celebrated their 25th major hackathon win at
                  ETHGlobal, showcasing our continuous innovation in the Web3
                  space.
                </p>
                <p className="text-xs text-gray-500">March 2025</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Client Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 mb-20"
        >
          <p className="text-2xl font-bold text-[#841a1c] mb-8">
            Client Testimonials
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Jane Doe",
                role: "CEO of XYZ Protocol",
                text: "Gryffindors brought our Web3 vision to life! Their deep expertise in smart contracts and dApp development made the entire process seamless.",
                service: "DEFI SOLUTIONS",
              },
              {
                name: "Alex Chen",
                role: "Founder of MetaWorld",
                text: "The analytics-driven approach of Gryffindors helped us optimize our GameFi project for maximum engagement. Our user base grew 300% in just three months!",
                service: "GAMING & NFT",
              },
              {
                name: "Sophia Patel",
                role: "Founder of DeFiConnect",
                text: "As a startup in the blockchain space, we needed expert guidance. Gryffindors helped us refine our tokenomics and smart contract strategy, setting us up for long-term success.",
                service: "DAO INFRASTRUCTURE",
              },
            ].map((testimonial, idx) => (
              <Card
                key={idx}
                className="bg-white/80 border-none shadow-sm hover:shadow-md transition-all h-full"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-6">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 512 512"
                      fill="#841a1c"
                      opacity="0.2"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48p28c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48p28c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-6 flex-grow">
                    {testimonial.text}
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <Badge className="mt-3 bg-[#841a1c]/10 text-[#841a1c] hover:bg-[#841a1c]/20 border-none">
                      {testimonial.service}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="bg-white/90 border border-[#841a1c]/10 shadow-xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-2xl md:text-3xl font-bold text-[#841a1c] mb-4">
                  Ready to explore our Web3 expertise?
                </p>
                <p className="text-gray-700 text-lg mb-8">
                  Let&apos;s analyze your blockchain needs and build a
                  data-driven solution tailored to your vision.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Button
                    asChild
                    className="bg-[#841a1c] text-white hover:bg-[#4d1616] px-8 py-6"
                  >
                    <Link href="/contact">Get in Touch</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="border-[#841a1c] text-[#841a1c] hover:bg-[#841a1c]/5 px-8 py-6"
                  >
                    <Link href="/services">View All Services</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PortfolioPage;
