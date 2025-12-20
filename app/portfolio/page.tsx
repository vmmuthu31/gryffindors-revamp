"use client";

import React, { useState } from "react";
import { motion, Variant } from "framer-motion";
import { Tab } from "@headlessui/react";
import RunningHeading from "@/components/RunningHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type ProjectCategory =
  | "all"
  | "defi"
  | "nft"
  | "dao"
  | "gaming"
  | "dapp"
  | "app";

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
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");

  const containerVariants: Record<string, Variant> = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Record<string, Variant> = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const projects: ProjectType[] = [
    {
      id: 1,
      title: "Kanalabs",
      category: ["defi", "gaming", "dapp"],
      image: "/projects/cryptocoffee.png",
      description:
        "Earn and Play with Cryptocurrency Deposits in Crypto Coffee - A Web3 Deposit Game Application. Deposit tokens, compete in the leaderboard, and earn rewards.",
      technologies: ["Solidity", "React", "Web3.js", "Polygon"],
      metrics: [
        { name: "Funding/Grants", value: 80, unit: "K", change: 100 },
        { name: "Users", value: 5, unit: "K", change: 20 },
      ],
      timeline: [],
      completion: 100,
    },
    {
      id: 2,
      title: "Gigshub & ISAFT",
      category: ["dapp", "dao"],
      image: "/projects/gigshub.png",
      description:
        "A decentralized freelancing platform to explore opportunities, earn tokens, and revolutionize hiring. Find gigs, post jobs, and tokenize progress.",
      technologies: ["Solidity", "Next.js", "IPFS", "Filecoin"],
      metrics: [
        { name: "Grants", value: 5, unit: "L", change: 0 },
        { name: "Freelancers", value: 1.2, unit: "K", change: 15 },
      ],
      timeline: [],
      completion: 100,
    },
    {
      id: 3,
      title: "Payant",
      category: ["defi", "dapp"],
      image: "/projects/payant.png",
      description:
        "Making client-contractor relationships trustless. Get paid on time using Smart Contracts and Swaps under the hood.",
      technologies: ["Solidity", "React", "Smart Contracts", "DeFi"],
      metrics: [
        { name: "Volume", value: 60, unit: "K", change: 0 },
        { name: "Transactions", value: 250, unit: "+", change: 10 },
      ],
      timeline: [],
      completion: 100,
    },
    {
      id: 4,
      title: "Aramvellum",
      category: ["app"],
      image: "/projects/aramvellum.png",
      description:
        "Project #JusticeForAll. An initiative to make justice accessible to everyone and empower marginalized communities with legal representation.",
      technologies: ["React", "Firebase", "Web3 Integration"],
      metrics: [
        { name: "Reach", value: 15, unit: "K", change: 0 },
        { name: "Volunteers", value: 50, unit: "+", change: 5 },
      ],
      timeline: [],
      completion: 100,
    },
    {
      id: 5,
      title: "Okto Token Disbursal",
      category: ["dapp", "defi"],
      image: "/projects/okto.png",
      description:
        "Powered by Okto Orchestration layer. An embedded wallet solution to disperse tokens directly to multiple users via CSV or address list.",
      technologies: ["Okto SDK", "React", "Node.js"],
      metrics: [
        { name: "Volume", value: 1, unit: "L", change: 0 },
        { name: "Disbursals", value: 500, unit: "+", change: 25 },
      ],
      timeline: [],
      completion: 100,
    },
    {
      id: 6,
      title: "Starknet Hacker House",
      category: ["dapp"],
      image: "/projects/starknethh.png",
      description:
        "Official platform for Starknet Hacker House events. Seamless registration, project submission, and event management for participants.",
      technologies: ["Starknet", "Next.js", "Cairo"],
      metrics: [
        { name: "Participants", value: 5, unit: "L", change: 0 },
        { name: "Hackers", value: 200, unit: "+", change: 0 },
      ],
      timeline: [],
      completion: 100,
    },
    {
      id: 7,
      title: "NapFT",
      category: ["nft", "dapp"],
      image: "/projects/napFT.png",
      description:
        "A purely on-chain NFT collection pushing the boundaries of what is possible with SVG generation on Ethereum.",
      technologies: ["Solidity", "SVG", "ERC-721"],
      metrics: [
        { name: "Volume", value: 10, unit: "K", change: 0 },
        { name: "Holders", value: 150, unit: "", change: 5 },
      ],
      timeline: [],
      completion: 100,
    },
  ];

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
        {/* Project filters */}
        <div className="mb-10">
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
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
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
