"use client";

import { useEffect, useState } from "react";
import RunningWordsTicker from "@/components/RunningWordsTicker";
import Image from "next/image";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative pt-10 pb-0 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        {/* TODO: ADD STATS */}
      </div>

      {/* Decorative circles */}
      <div className="circle-decoration w-64 h-64 -top-32 -left-32 opacity-5"></div>
      <div className="circle-decoration w-96 h-96 -bottom-48 -right-48 opacity-5"></div>

      <div className="mx-auto px-4 sm:px-6 lg:px-24">
        <div className="flex flex-col items-start max-w-7xl">
          {/* Main Heading */}
          <div
            className={`opacity-0 ${
              isLoaded ? "animate-fade-in animate-delay-100" : ""
            }`}
          >
            <div className="text-5xl md:text-7xl font-thunder lg:text-[168px] font-bold text-primary mb-6 leading-tight tracking-normal">
              <div className="flex items-center lg:gap-8 gap-2">
                <span className="whitespace-nowrap">BRIDGING VISION TO</span>
                <div className="flex items-center lg:-mt-4 lg:gap-4 gap-2">
                  <Image
                    src="/assets/head1.svg"
                    alt="Star"
                    className="md:w-24 md:h-24 w-10 h-10 opacity-50"
                    width={120}
                    height={120}
                  />
                  <Image
                    src="/assets/head2.svg"
                    alt="Star"
                    className="md:w-24 md:h-24 w-10 h-10 opacity-50"
                    width={120}
                    height={120}
                  />
                </div>
              </div>
              <div className="flex items-center lg:gap-8 gap-4">
                <div className="flex lg:flex-row flex-col items-center -mt-4 gap-4">
                  <Image
                    src="/assets/head3.svg"
                    alt="Star"
                    className="md:w-24 md:h-24 w-10 h-10 opacity-50"
                    width={120}
                    height={120}
                  />
                  <Image
                    src="/assets/head4.svg"
                    alt="Star"
                    className="md:w-24 md:h-24 w-10 h-10 opacity-50"
                    width={120}
                    height={120}
                  />
                </div>
                <span>
                  REALITY IN THE{" "}
                  <span className="text-[#D99F65]">
                    WEB3 <span className="lg:hidden block">REVOLUTION</span>
                  </span>
                </span>
              </div>
              <div className="flex items-start justify-end gap-8">
                <div
                  className={`flex gap-2 mt-5 items-center ${
                    isLoaded ? "animate-fade-in animate-delay-100" : ""
                  }`}
                >
                  <div className="flex items-center bg-[#D99F65] p-6">
                    <p className="text-white font-dmsans font-semibold text-lg lg:text-2xl">
                      a web3-native agency specializing <br /> in blockchain
                      solutions.
                    </p>
                  </div>
                  <div className=" hidden lg:flex  gap-2">
                    <div className="w-8 h-28 bg-[#D99F65] border-2 border-white"></div>
                    <div className="w-6 h-28 bg-[#D99F65] border-2 border-white"></div>
                    <div className="w-4 h-28 bg-[#D99F65] border-2 border-white"></div>
                    <div className="w-1 h-28 border-2 border-[#D99F65] bg-[#D99F65] "></div>
                  </div>
                </div>
                <span className="text-[#D99F65] hidden lg:block">
                  REVOLUTION
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div
            className={`mb-8 max-w-2xl opacity-0 ${
              isLoaded ? "animate-fade-in animate-delay-200" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-1 rounded-full bg-primary"></div>
              <div className="w-1 h-1 rounded-full bg-primary"></div>
              <div className="w-1 h-1 rounded-full bg-primary"></div>
              <div className="w-1 h-1 rounded-full bg-primary"></div>
              <p className="text-sm font-medium uppercase text-muted-foreground">
                HELLO
              </p>
            </div>
            <p className="text-lg text-foreground/90">
              <span className="font-bold">Gryffindors</span> is a Web3 agency
              specializing in blockchain smart contracts, dApps and crypto
              solutions that scale. We create elegant experiences and
              decentralized solutions that takes the Web3 products.
            </p>
          </div>

          {/* Service Tags as running ticker */}
          <div
            className={`w-full opacity-0 ${
              isLoaded ? "animate-fade-in animate-delay-300" : ""
            }`}
          >
            <RunningWordsTicker />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
