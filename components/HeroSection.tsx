"use client";

import { useEffect, useState, useRef } from "react";
import RunningText from "@/components/RunningText";
import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playRoar = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    setIsLoaded(true);
    audioRef.current = new Audio("/audio/lion.mp3");
    audioRef.current.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", () =>
          setIsPlaying(false)
        );
      }
    };
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

      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center ">
          {/* Main Heading */}
          <div
            className={`opacity-0 ${
              isLoaded ? "animate-fade-in animate-delay-100" : ""
            }`}
          >
            <div className="text-5xl w-full md:text-7xl font-thunder lg:text-[168px] font-bold text-primary mb-6 leading-tight tracking-normal">
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
                    WEB3 <span className="lg:hidden block">REVOLUTION.</span>
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
                  REVOLUTION.
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div
            className={`mb-8 lg:px-24 w-full opacity-0 ${
              isLoaded ? "animate-fade-in animate-delay-200" : ""
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 justify-end">
              <div className="flex justify-between w-full items-start gap-2 ">
                <div className="flex lg:ml-20 items-center gap-2 ">
                  <Image
                    src="/assets/minus.svg"
                    alt="Hello"
                    width={20}
                    height={20}
                  />
                  <p className="text-sm lg:text-2xl font-medium uppercase text-[#D99F65]">
                    HELLO
                  </p>
                </div>
                <Image
                  src="/assets/fort.svg"
                  alt="Hello"
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex flex-col w-full items-center md:items-start gap-2 ">
                <div className="flex items-center md:gap-4 gap-2">
                  <span className="text-lg lg:text-[38px] uppercase font-bold">
                    Gryffindors
                  </span>{" "}
                  <span className="text-lg lg:text-[22px] text-black/60 uppercase font-medium">
                    [grif−in−dorz]
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={isPlaying ? { rotate: [0, 15, -15, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    onClick={playRoar}
                    className="cursor-pointer"
                  >
                    <Image
                      src="/assets/sound.svg"
                      alt="Play Sound"
                      className="w-6 h-6 mt-1"
                      width={28}
                      height={28}
                    />
                  </motion.div>
                </div>
                <p>noun</p>
                <div className="flex items-start gap-4">
                  <p className="text-lg font-bold">1</p>
                  <p className="text-lg max-w-xl text-foreground/90">
                    <span className="font-bold">Gryffindors</span> is a Web3
                    agency specializing in blockchain smart contracts, dApps and
                    crypto solutions that scale. We create elegant experiences
                    and decentralized solutions that takes the Web3 products.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Tags as running ticker */}
          <div
            className={`w-full opacity-0 ${
              isLoaded ? "animate-fade-in animate-delay-300" : ""
            }`}
          >
            <RunningText direction="left" />
          </div>

          <Image
            src="/assets/teamshuttle.svg"
            alt="Hero Image"
            className="w-full py-5"
            width={1000}
            height={1000}
          />
          <div
            className={`w-full pb-10 opacity-0 ${
              isLoaded ? "animate-fade-in animate-delay-300" : ""
            }`}
          >
            <RunningText direction="left" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
