"use client";

import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimatedCounter = ({
  target,
  duration = 3,
}: {
  target: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const counterInView = useInView(counterRef);

  useEffect(() => {
    if (!counterInView) return;

    let startTime: number | null = null;
    let animationFrame: number | null = null;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);
      const easedProgress = easeOutQuart(progress);

      const targetNum = parseInt(target.replace(/[^\d.-]/g, ""));
      setCount(Math.floor(easedProgress * targetNum));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(targetNum);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [counterInView, target, duration]);

  // Format the output to match the target format (e.g., "200+" or "$25k+")
  const formatOutput = () => {
    if (target.includes("$"))
      return `$${count}k${target.includes("+") ? "+" : ""}`;
    if (target.includes("lakhs"))
      return `${count} lakhs${target.includes("+") ? "+" : ""}`;
    if (target.includes("wins")) return `${count}+ wins`;
    return `${count}${target.includes("+") ? "+" : ""}`;
  };

  return <span ref={counterRef}>{formatOutput()}</span>;
};

const StatsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.8,
      },
    },
  };

  const hoverVariants = {
    initial: { scale: 1, boxShadow: "0px 0px 0px rgba(119, 0, 2, 0)" },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 20px rgba(119, 0, 2, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const numberVariants = {
    initial: {
      color: "#770002",
      textShadow: "0px 0px 0px rgba(119, 0, 2, 0)",
    },
    hover: {
      color: "#b90003",
      textShadow: "0px 0px 15px rgba(119, 0, 2, 0.5)",
      scale: 1.08,
      transition: {
        duration: 0.3,
        yoyo: Infinity,
        repeatDelay: 0.5,
      },
    },
  };

  const statsData = [
    { title: "blockchain deployments", value: "200+" },
    { title: "hackathon achievements", value: "25+ wins" },
    { title: "project & bounty earnings", value: "60 lakhs+" },
    { title: "funded & recognized", value: "$25k+" },
    { title: "community members", value: "500+" },
    { title: "global clients served", value: "50+" },
    { title: "workshops & events", value: "20+" },
    { title: "ecosystem partnerships", value: "10+" },
  ];

  return (
    <section ref={sectionRef} className="lg:pb-16 pb-10 bg-background">
      <div className="flex container items-center justify-start gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/assets/starknet.svg"
            alt="Starknet"
            className="lg:w-60 lg:h-60 w-24 h-24 md:w-40 md:h-40"
            width={250}
            height={250}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Image
            src="/assets/phoenixguild.svg"
            alt="Phoenix Guild"
            className="lg:w-60 lg:h-60 w-24 h-24 md:w-40 md:h-40"
            width={250}
            height={250}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Image
            src="/assets/ethglobal.svg"
            alt="ETH Global"
            className="lg:w-60 lg:h-60 w-24 h-24 md:w-40 md:h-40"
            width={250}
            height={250}
          />
        </motion.div>
      </div>

      <div className="container lg:mt-10 mt-5">
        <motion.hr
          className="border-t border-border"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      <div className="container lg:mt-10 mt-5">
        <motion.p
          className="text-start text-lg text-foreground font-dmsans mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          At Gryffindors, we don&apos;t just build—we engineer the decentralized
          future. From game-changing smart contracts to high-impact dApps, we
          turn ambitious Web3 visions into reality. With a track record of
          winning, scaling, and innovating, we help startups, DAOs, and
          enterprises push the boundaries of what&apos;s possible on-chain.
        </motion.p>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-gradient-to-br from-transparent to-black/5"
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
              // eslint-disable-next-line
              variants={hoverVariants}
            >
              <p className="text-sm lg:text-xl font-dmsans text-foreground font-medium">
                {stat.title}
              </p>

              <motion.div
                className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#770002]/50 to-transparent my-2"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isInView ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              />

              <motion.p
                className="text-3xl md:text-4xl lg:text-7xl font-thunder italic font-bold text-[#770002] relative"
                variants={numberVariants}
                whileHover="hover"
              >
                {isInView ? (
                  <AnimatedCounter
                    target={stat.value}
                    duration={2 + index * 0.2}
                  />
                ) : (
                  "0"
                )}

                <motion.span
                  className="absolute inset-0 bg-[#770002] opacity-0 blur-lg -z-10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.15 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
