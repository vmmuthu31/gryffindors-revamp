"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RunningHeading from "./RunningHeading";

const teamMembers = [
  {
    id: 1,
    name: "Vairamuthu M",
    role: "Full Stack Developer",
    bio: "A Web3 full-stack developer and open-source contributor with a passion for blockchain innovation. GSoC '22 alum, hackathon winner, and mentor, currently building at Polkassembly.",
    image: "/assets/team/vm.png",
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 2,
    name: "D Prashant",
    role: "Product Designer",
    bio: "A product designer shaping Web3 experiences. Contributor at Starknet Foundation and part of The Phoenix Guild Chennai, previously at SecureDApp, bringing intuitive design to blockchain products.",
    image: "/assets/team/prashant.png",
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 3,
    name: "Thirumurugan S",
    role: "Blockchain Developer",
    bio: "Web3 hackathon champion with 20+ wins, Tech Lead at The Phoenix Guild Chennai, and Starknet contributor. Currently building StarkShoot and developing at Winks.fun, pushing the boundaries of blockchain gaming.",
    image: "/assets/team/thiru.png",
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 4,
    name: "Nagipragalathan T",
    role: "Blockchain Developer",
    bio: "Web3 hackathon champion with 20+ wins, Tech Lead at The Phoenix Guild Chennai, and Starknet contributor. Currently building StarkShoot and developing at Winks.fun, pushing the boundaries of blockchain gaming.",
    image: "/assets/team/nagipragalathan.png",
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
];

// Adding the additional team members for the bottom row
const extendedTeamMembers = [
  {
    id: 5,
    name: "Vishal",
    role: "Frontend Developer",
    image: "/assets/team/vishal.png",
  },
  {
    id: 6,
    name: "Deepak Raja",
    role: "Blockchain Developer",
    image: "/assets/team/deepak.png",
  },
  {
    id: 7,
    name: "Sunil",
    role: "Full Stack Developer",
    image: "/assets/team/sunil.png",
  },
  {
    id: 8,
    name: "Rajan",
    role: "Blockchain Developer",
    image: "/assets/team/rajan.png",
  },
  {
    id: 9,
    name: "Ganesh",
    role: "Web Developer",
    image: "/assets/team/ganesh.png",
  },
];

const TeamSection = () => {
  const [positions, setPositions] = useState(teamMembers.map((_, i) => i));
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  // For main team members - keep the shuffling animation
  const shufflePositions = () => {
    setPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      for (let i = newPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newPositions[i], newPositions[j]] = [newPositions[j], newPositions[i]];
      }
      return newPositions;
    });
  };

  // For extended team members - carousel functionality
  const nextSlide = () => {
    setDirection(1);
    setCurrentCarouselIndex((prev) =>
      prev === extendedTeamMembers.length - 4 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentCarouselIndex((prev) =>
      prev === 0 ? extendedTeamMembers.length - 4 : prev - 1
    );
  };

  // Get visible extended team members for the carousel
  const getVisibleExtendedMembers = () => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentCarouselIndex + i) % extendedTeamMembers.length;
      result.push({ ...extendedTeamMembers[index], order: i });
    }
    return result;
  };

  useEffect(() => {
    // Main team members shuffling
    const interval = setInterval(shufflePositions, 3000);

    // Extended team carousel auto-play
    let carouselInterval;
    if (isAutoPlaying) {
      carouselInterval = setInterval(() => {
        nextSlide();
      }, 4000);
    }

    return () => {
      clearInterval(interval);
      if (carouselInterval) clearInterval(carouselInterval);
    };
  }, [isAutoPlaying]);

  // Pause auto-play when hovering over carousel
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div className="container">
      <RunningHeading
        words={[
          { text: "MEET", isOutline: false },
          { text: "THE", isOutline: false },
          { text: "TEAM", isOutline: true },
        ]}
        speed={40}
        direction="left"
      />
      <section className="md:py-14 py-10 bg-muted/30" id="team">
        <div className="">
          <div className="mb-10 overflow-hidden">
            <p className="text-center text-lg text-foreground/80 max-w-3xl mx-auto mt-4">
              What started with a group of passionate Web3 builders has grown
              into a powerhouse team helping the most ambitious projects in
              blockchain succeed.
            </p>
          </div>

          {/* Main team members */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            <AnimatePresence>
              {positions.map((position) => (
                <motion.div
                  key={teamMembers[position].id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    },
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.5,
                    layout: { duration: 0.6 },
                  }}
                >
                  <Card className="overflow-hidden border-none bg-muted/30 h-full">
                    <CardContent className="p-0">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={teamMembers[position].image}
                          alt={teamMembers[position].name}
                          fill
                          className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xl font-thunder lg:text-3xl font-bold text-primary">
                          {teamMembers[position].name}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          {teamMembers[position].role}
                        </p>
                        <p className="text-sm h-32 text-foreground/80 mb-4">
                          {teamMembers[position].bio}
                        </p>
                        <div className="flex space-x-3">
                          <Link
                            href={teamMembers[position].twitter}
                            className="text-foreground/60 hover:text-primary"
                          >
                            <Image
                              src="/assets/x.svg"
                              alt="Twitter"
                              width={20}
                              height={20}
                            />
                          </Link>
                          <Link
                            href={teamMembers[position].linkedin}
                            className="text-foreground/60 hover:text-primary"
                          >
                            <Image
                              src="/assets/linkedin.svg"
                              alt="LinkedIn"
                              width={20}
                              height={20}
                            />
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div
            className="mt-16 relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="absolute top-1/2 -left-12 transform -translate-y-1/2 z-10">
              <motion.button
                onClick={prevSlide}
                className="bg-primary/80 hover:bg-primary text-white p-3 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </motion.button>
            </div>

            <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 z-10">
              <motion.button
                onClick={nextSlide}
                className="bg-primary/80 hover:bg-primary text-white p-3 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </motion.button>
            </div>

            {/* Carousel Container */}
            <div className="overflow-hidden max-w-7xl mx-auto">
              <div className="relative">
                <motion.div className="grid grid-cols-4 gap-6" initial={false}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {getVisibleExtendedMembers().map((member) => (
                      <motion.div
                        key={`${member.id}-${member.order}`}
                        initial={{
                          opacity: 0,
                          x: direction > 0 ? 100 : -100,
                          rotateY: direction > 0 ? 45 : -45,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          rotateY: 0,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                            delay: member.order * 0.1,
                          },
                        }}
                        exit={{
                          opacity: 0,
                          x: direction > 0 ? -100 : 100,
                          rotateY: direction > 0 ? -45 : 45,
                          scale: 0.8,
                          transition: { duration: 0.3 },
                        }}
                        className="h-full transform-gpu"
                      >
                        <Card className="overflow-hidden border-none bg-muted/20 h-full hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-0">
                            <div className="aspect-square relative overflow-hidden">
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                              />
                              <motion.div
                                className="absolute inset-0 bg-primary/10"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                              />
                            </div>
                            <motion.div
                              className="p-4"
                              whileHover={{
                                backgroundColor: "rgba(132, 26, 28, 0.05)",
                              }}
                            >
                              <p className="text-lg font-bold text-primary">
                                {member.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {member.role}
                              </p>
                            </motion.div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({
                length: Math.ceil(extendedTeamMembers.length / 4),
              }).map((_, index) => {
                const isActive = Math.floor(currentCarouselIndex / 4) === index;
                return (
                  <motion.button
                    key={index}
                    onClick={() => {
                      const newDirection =
                        index > Math.floor(currentCarouselIndex / 4) ? 1 : -1;
                      setDirection(newDirection);
                      setCurrentCarouselIndex(index * 4);
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      isActive ? "bg-primary" : "bg-primary/30"
                    }`}
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 0.9 }}
                    animate={
                      isActive
                        ? {
                            scale: [1, 1.2, 1],
                            transition: { repeat: Infinity, repeatDelay: 2 },
                          }
                        : {}
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamSection;
