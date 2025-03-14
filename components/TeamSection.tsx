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
    name: "Dev 1",
    role: "Frontend Developer",
    image: "/assets/team/dev1.png", // You'll need to add these images to your assets folder
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 6,
    name: "Dev 2",
    role: "Blockchain Developer",
    image: "/assets/team/dev2.png",
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 7,
    name: "Dev 3",
    role: "Full Stack Developer",
    image: "/assets/team/dev3.png",
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 8,
    name: "Dev 4",
    role: "Blockchain Developer",
    image: "/assets/team/dev4.png",
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 9,
    name: "Dev 5",
    role: "Web Developer",
    image: "/assets/team/dev5.png",
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
];

const TeamSection = () => {
  const [positions, setPositions] = useState(teamMembers.map((_, i) => i));
  const [extendedPositions, setExtendedPositions] = useState(
    extendedTeamMembers.map((_, i) => i)
  );

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

  const shuffleExtendedPositions = () => {
    setExtendedPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      for (let i = newPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newPositions[i], newPositions[j]] = [newPositions[j], newPositions[i]];
      }
      return newPositions;
    });
  };

  useEffect(() => {
    const interval = setInterval(shufflePositions, 3000);
    const extendedInterval = setInterval(shuffleExtendedPositions, 4000); // Different timing for variation
    return () => {
      clearInterval(interval);
      clearInterval(extendedInterval);
    };
  }, []);

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
        <div className="container">
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

          {/* Extended team members - smaller cards in a horizontal row */}
          <div className="mt-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
              <AnimatePresence>
                {extendedPositions.map((position) => (
                  <motion.div
                    key={extendedTeamMembers[position].id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      },
                    }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      duration: 0.4,
                      layout: { duration: 0.5 },
                    }}
                  >
                    <Card className="overflow-hidden border-none bg-muted/20 h-full">
                      <CardContent className="p-0">
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src={extendedTeamMembers[position].image}
                            alt={extendedTeamMembers[position].name}
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-bold text-primary">
                            {extendedTeamMembers[position].name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {extendedTeamMembers[position].role}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <Link
                              href={extendedTeamMembers[position].twitter}
                              className="text-foreground/60 hover:text-primary"
                            >
                              <Image
                                src="/assets/x.svg"
                                alt="Twitter"
                                width={16}
                                height={16}
                              />
                            </Link>
                            <Link
                              href={extendedTeamMembers[position].linkedin}
                              className="text-foreground/60 hover:text-primary"
                            >
                              <Image
                                src="/assets/linkedin.svg"
                                alt="LinkedIn"
                                width={16}
                                height={16}
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
      </section>
    </div>
  );
};

export default TeamSection;
