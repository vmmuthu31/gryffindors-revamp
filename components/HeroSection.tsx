"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import RunningWordsTicker from "@/components/RunningWordsTicker";

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

      <div className="container">
        <div className="flex flex-col items-start max-w-5xl">
          {/* Agency Tag */}
          <div
            className={`bg-accent/30 px-3 py-1 rounded-full mb-6 text-sm opacity-0 ${
              isLoaded ? "animate-fade-in" : ""
            }`}
          >
            <p className="text-primary font-medium">
              a web3 native agency specializing in blockchain solutions.
            </p>
          </div>

          {/* Main Heading */}
          <div
            className={`opacity-0 ${
              isLoaded ? "animate-fade-in animate-delay-100" : ""
            }`}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-6 leading-tight tracking-tighter">
              BRIDGING VISION TO
              <br />
              REALITY IN THE <span className="text-secondary">WEB3</span>
              <br />
              <span className="text-primary">REVOLUTION</span>
            </h1>
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

          {/* CTA Button */}
          <div
            className={`mt-6 mb-12 opacity-0 ${
              isLoaded ? "animate-fade-in animate-delay-400" : ""
            }`}
          >
            <Button
              variant="outline"
              className="rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              Connect with us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
