"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

const TeamSection = () => {
  const [positions, setPositions] = useState(teamMembers.map((_, i) => i));

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

  useEffect(() => {
    const interval = setInterval(shufflePositions, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-muted/30" id="team">
      <div className="container">
        <div className="mb-10 overflow-hidden">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap text-4xl md:text-5xl font-bold text-primary text-center"
          >
            MEET THE TEAM • MEET THE TEAM • MEET THE TEAM • MEET THE TEAM •
          </motion.div>
          <p className="text-center text-lg text-foreground/80 max-w-3xl mx-auto mt-4">
            What started with a group of passionate Web3 builders has grown into
            a powerhouse team helping the most ambitious projects in blockchain
            succeed.
          </p>
        </div>

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
      </div>
    </section>
  );
};

export default TeamSection;
