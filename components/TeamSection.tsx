"use client";

import { useState, useEffect, useCallback } from "react";
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
    twitter: "https://x.com/Barfi_31",
    linkedin: "https://www.linkedin.com/in/vmmuthu31/",
  },
  {
    id: 2,
    name: "D Prashant",
    role: "Product Designer",
    bio: "A product designer shaping Web3 experiences. Contributor at Starknet Foundation and part of The Phoenix Guild Chennai, previously at SecureDApp, bringing intuitive design to blockchain products.",
    image: "/assets/team/prashant.png",
    twitter: "#",
    linkedin: "https://www.linkedin.com/in/prashantdp/",
  },
  {
    id: 3,
    name: "Thirumurugan S",
    role: "Blockchain Developer",
    bio: "Web3 hackathon champion with 20+ wins, Tech Lead at The Phoenix Guild Chennai, and Starknet contributor. Currently building StarkShoot and developing at Winks.fun, pushing the boundaries of blockchain gaming.",
    image: "/assets/team/thiru.png",
    twitter: "https://x.com/0xThiru",
    linkedin: "https://www.linkedin.com/in/thirumurugan-sivalingam-935464218/",
  },
  {
    id: 4,
    name: "Nagipragalathan N",
    role: "Blockchain Developer",
    bio: "Web3 hackathon champion with 20+ wins, Tech Lead at The Phoenix Guild Chennai, and Starknet contributor. Currently building StarkShoot and developing at Winks.fun, pushing the boundaries of blockchain gaming.",
    image: "/assets/team/nagipragalathan.png",
    twitter: "https://x.com/NagiPragalathan",
    linkedin: "https://www.linkedin.com/in/nagi-pragalathan/",
  },
];

const extendedTeamMembers = [
  {
    id: 5,
    name: "Vishal Akash",
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
    name: "Gokul Priyan",
    role: "Frontend Developer",
    image: "/assets/team/gokul.png",
  },
  {
    id: 8,
    name: "Kiran",
    role: "Frontend Developer",
    image: "/assets/team/kiran.png",
  },
  {
    id: 9,
    name: "Manikandan",
    role: "Full Stack Developer",
    image: "/assets/team/manikandan.png",
  },
  {
    id: 10,
    name: "Naveen Pandian",
    role: "Full Stack Developer",
    image: "/assets/team/naveen.jpeg",
  },
  {
    id: 11,
    name: "Sunil S",
    role: "Full Stack Developer",
    image: "/assets/team/sunil.png",
  },
  {
    id: 12,
    name: "Rajan R",
    role: "Blockchain Developer",
    image: "/assets/team/rajan.png",
  },
  {
    id: 13,
    name: "Ganesh P",
    role: "Web Developer",
    image: "/assets/team/ganesh.png",
  },
];

// Duplicate array for infinite looping
const duplicatedTeam = [...extendedTeamMembers, ...extendedTeamMembers];

const TeamSection = () => {
  const [positions, setPositions] = useState(teamMembers.map((_, i) => i));
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const shufflePositions = useCallback(() => {
    if (isAnimating) {
      setPositions((prevPositions) => {
        const newPositions = [...prevPositions];
        for (let i = newPositions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newPositions[i], newPositions[j]] = [
            newPositions[j],
            newPositions[i],
          ];
        }
        return newPositions;
      });
    }
  }, [isAnimating]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isAnimating) {
        setCurrentIndex((prev) => (prev + 1) % positions.length);
      }
    }, 10000); // Change card every 10 seconds

    return () => clearInterval(timer);
  }, [positions.length, isAnimating]);

  // Auto slide for extended team
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating) {
        setDirection(1);
        setSlideIndex((prev) => (prev + 1) % duplicatedTeam.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    const interval = setInterval(shufflePositions, 3000);
    return () => clearInterval(interval);
  }, [shufflePositions]);

  // Handle card hover
  const handleCardHover = (id: number | null) => {
    setHoveredCardId(id);
    setIsAnimating(id === null); // Stop animations when a card is hovered
  };

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
        className="pt-10 lg:pt-0"
      />
      <section className="md:py-10 bg-muted/30" id="team">
        <div className="">
          <div className="mb-10 overflow-hidden">
            <p className="text-center text-lg text-foreground/80 max-w-3xl mx-auto mt-4">
              What started with a group of passionate Web3 builders has grown
              into a powerhouse team helping the most ambitious projects in
              blockchain succeed.
            </p>
          </div>

          {/* Main team members */}
          <div className="max-w-7xl mx-auto">
            {/* Mobile view: Single card */}
            <div className="lg:hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={teamMembers[positions[currentIndex]].id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="w-full"
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  onHoverStart={() =>
                    handleCardHover(teamMembers[positions[currentIndex]].id)
                  }
                  onHoverEnd={() => handleCardHover(null)}
                >
                  <Card className="overflow-hidden border-none bg-muted/30">
                    <CardContent className="p-0">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={teamMembers[positions[currentIndex]].image}
                          alt={teamMembers[positions[currentIndex]].name}
                          fill
                          className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xl font-thunder lg:text-3xl font-bold text-primary">
                          {teamMembers[positions[currentIndex]].name}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          {teamMembers[positions[currentIndex]].role}
                        </p>
                        <p className="text-sm h-32 text-foreground/80 mb-4">
                          {teamMembers[positions[currentIndex]].bio}
                        </p>
                        <div className="flex space-x-3">
                          <Link
                            href={teamMembers[positions[currentIndex]].twitter}
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
                            href={teamMembers[positions[currentIndex]].linkedin}
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
              </AnimatePresence>

              {/* Navigation dots for mobile */}
              <div className="flex justify-center gap-2 mt-8">
                {positions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? "bg-primary" : "bg-primary/30"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop view: Grid layout */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-4 gap-6">
                <AnimatePresence>
                  {positions.map((position) => (
                    <motion.div
                      key={teamMembers[position].id}
                      layout={hoveredCardId !== teamMembers[position].id}
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
                      onHoverStart={() =>
                        handleCardHover(teamMembers[position].id)
                      }
                      onHoverEnd={() => handleCardHover(null)}
                    >
                      <Card
                        className={`overflow-hidden border-none bg-muted/30 h-full ${
                          hoveredCardId !== null &&
                          hoveredCardId !== teamMembers[position].id
                            ? "opacity-60"
                            : ""
                        }`}
                      >
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
                                target="_blank"
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
                                target="_blank"
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
            </div>
          </div>

          {/* Extended team - Single item slide carousel that works on all screens */}
          <div className="mt-20 mb-10">
            <div className="relative overflow-hidden max-w-7xl mx-auto">
              {/* This is the key to making it work on all screens - a single slide approach */}
              <AnimatePresence custom={direction} mode="popLayout">
                <motion.div
                  key={slideIndex}
                  custom={direction}
                  initial={{
                    x: direction > 0 ? "100%" : "-100%",
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  }}
                  exit={{
                    x: direction > 0 ? "-100%" : "100%",
                    opacity: 0,
                    transition: {
                      duration: 0.5,
                    },
                  }}
                  className="w-full"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {/* Display current item and next few items */}
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const memberIdx =
                        (slideIndex + idx) % duplicatedTeam.length;
                      const member = duplicatedTeam[memberIdx];

                      // Hide items that don't fit screen
                      const visibilityClass =
                        (idx >= 1 &&
                          typeof window !== "undefined" &&
                          window.innerWidth < 640) || // Hide on xs
                        (idx >= 2 &&
                          typeof window !== "undefined" &&
                          window.innerWidth < 768) || // Hide on sm
                        (idx >= 3 &&
                          typeof window !== "undefined" &&
                          window.innerWidth < 1024) || // Hide on md
                        (idx >= 4 &&
                          typeof window !== "undefined" &&
                          window.innerWidth < 1280) // Hide on lg
                          ? "hidden"
                          : "";

                      return (
                        <motion.div
                          key={`${member.id}-${idx}`}
                          className={visibilityClass}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              delay: idx * 0.1,
                              duration: 0.3,
                            },
                          }}
                          whileHover={{ y: -8 }}
                        >
                          <Card className="overflow-hidden border-none bg-muted/20 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                            <CardContent className="p-0">
                              <div className="aspect-square relative overflow-hidden">
                                <Image
                                  src={member.image}
                                  alt={member.name}
                                  fill
                                  className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                                />
                                <div className="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                              <div className="p-4">
                                <p className="text-lg font-bold text-primary">
                                  {member.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {member.role}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Simple indicators */}
            <div className="flex justify-center mt-6 space-x-1.5">
              {extendedTeamMembers.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    slideIndex % extendedTeamMembers.length === idx
                      ? "bg-primary"
                      : "bg-primary/30"
                  }`}
                  onClick={() => {
                    setDirection(
                      idx > slideIndex % extendedTeamMembers.length ? 1 : -1
                    );
                    setSlideIndex(idx);
                  }}
                  aria-label={`Show team member ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamSection;
