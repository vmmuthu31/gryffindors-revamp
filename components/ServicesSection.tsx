"use client";

import { useState } from "react";
import RunningHeading from "./RunningHeading";

const services = [
  {
    id: "01",
    title: "Smart Contract Development",
    description:
      "Secure, audited, and optimized smart contracts that power decentralized applications. We specialize in Solidity, Rust, and other blockchain programming languages.",
  },
  {
    id: "02",
    title: "dApp Development",
    description:
      "End-to-end decentralized application development with seamless user experiences. Our dApps connect blockchain functionality with intuitive interfaces.",
  },
  {
    id: "03",
    title: "DeFi & Web3 Payment Solutions",
    description:
      "Custom DeFi protocols, yield farming platforms, DEXs, and Web3 payment integrations that maximize financial efficiency and security.",
  },
  {
    id: "04",
    title: "NFT & Tokenization Services",
    description:
      "Complete NFT ecosystem development including marketplaces, collections, and utility-focused tokenization solutions for digital and physical assets.",
  },
  {
    id: "05",
    title: "On-Chain Data Analytics & Insights",
    description:
      "Blockchain data analysis tools and dashboards that provide actionable insights for protocol optimization and market strategy.",
  },
  {
    id: "06",
    title: "GameFi & Metaverse Development",
    description:
      "Engaging blockchain games, play-to-earn ecosystems, and metaverse experiences that combine entertainment with tokenomics.",
  },
  {
    id: "07",
    title: "Product & Growth Design",
    description:
      "Strategic product design and growth frameworks specifically tailored for Web3 products to maximize adoption and engagement.",
  },
  {
    id: "08",
    title: "Design Systems & Branding",
    description:
      "Comprehensive design systems and brand identity development that capture the essence of Web3 innovation while ensuring usability.",
  },
];

const ServicesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  return (
    <div className="container">
      <div className="mb-10 overflow-hidden">
        <RunningHeading
          words={[
            { text: "OUR", isOutline: false },
            { text: "SERVICES", isOutline: true },
          ]}
          speed={40}
          direction="right"
        />
      </div>
      <p className="text-center text-2xl lowercase font-medium">
        Building secure, scalable, and user-friendly Web3 solutions
      </p>
      <section id="services" className="md:py-16 pt-10 px-0.5 bg-background">
        <div className="max-w-7xl mx-auto border-x-[3px] px-2 md:px-20 border-[#770002]">
          {services.map((service, index) => (
            <div
              key={service.id}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              className="border-b border-muted py-4 transition-all duration-300"
            >
              <div className="flex lg:hidden border-b cursor-pointer border-[#511111]/50 pb-4 justify-between items-center">
                <div className="flex items-center gap-8">
                  <span
                    className={`text-sm font-medium ${
                      hoveredIndex === index ? "text-black" : "text-[#ada9a8]"
                    }`}
                  >
                    /{service.id}/
                  </span>
                  <span className="text-2xl">
                    {hoveredIndex === index ? (
                      <span className="text-black whitespace-nowrap">
                        ( - )
                      </span>
                    ) : (
                      <span className="text-[#ada9a8] whitespace-nowrap">
                        ( + )
                      </span>
                    )}
                  </span>
                </div>
                <p className="md:text-xl text-end font-dmsans font-semibold text-foreground">
                  {service.title}
                </p>
              </div>

              <div className="hidden lg:flex lg:flex-row lg:items-start border-b cursor-pointer border-[#511111]/50 pb-4">
                <div className="flex items-center gap-32 lg:w-1/3">
                  <span
                    className={`text-2xl font-medium ${
                      hoveredIndex === index ? "text-black" : "text-[#ada9a8]"
                    }`}
                  >
                    /{service.id}/
                  </span>
                  <span className="text-2xl">
                    {hoveredIndex === index ? (
                      <span className="text-black whitespace-nowrap">
                        ( - )
                      </span>
                    ) : (
                      <span className="text-[#ada9a8] whitespace-nowrap">
                        ( + )
                      </span>
                    )}
                  </span>
                </div>

                <div className="lg:w-2/3 flex flex-col items-end">
                  <p className="text-3xl font-dmsans font-semibold text-foreground">
                    {service.title}
                  </p>

                  {hoveredIndex === index && (
                    <div className="mt-4 text-foreground/80">
                      <p className="text-right text-base max-w-xl">
                        {service.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {hoveredIndex === index && (
                <div className="lg:hidden text-foreground/80 mt-2 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="justify-end">
                    <p className="text-sm text-right">{service.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServicesSection;
