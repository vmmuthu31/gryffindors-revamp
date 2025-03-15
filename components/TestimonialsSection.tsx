"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import RunningHeading from "./RunningHeading";

const testimonials = [
  {
    id: 1,
    text: "Gryffindors brought our Web3 vision to life! Their deep expertise in smart contracts and dApp development made the entire process seamless. Recommend for any blockchain project!",
    author: "Jane Doe",
    position: "CEO of XYZ Protocol",
    category: "DEFI SOLUTIONS",
  },
  {
    id: 2,
    text: "Partnering with Gryffindors for Web3 hackathons has been a game-changer. Their ability to execute, innovate, and deliver is unmatched. Their community engagement is top-notch!",
    author: "Alice Nguyen",
    position: "Head of Ecosystem at ABC",
    category: "NFT Ecosystems",
  },
  {
    id: 3,
    text: "As a startup in the blockchain space, we needed expert guidance. Gryffindors helped us refine our tokenomics and smart contract strategy, setting us up for long-term success.",
    author: "Sophia Patel",
    position: "Founder of DeFiConnect",
    category: "DAO Infrastructure",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      result.push({ ...testimonials[index], order: i });
    }
    return result;
  };

  return (
    <div>
      <RunningHeading
        words={[
          { text: "BUILT", isOutline: false },
          { text: "ON", isOutline: false },
          { text: "TRUST", isOutline: true },
        ]}
        speed={40}
        direction="left"
        className="lg:mb-10 mb-5 container"
      />
      <section className="bg-background" id="testimonials">
        <div className="lg:px-20 px-4">
          <div className="mb-12 overflow-hidden">
            <p className="text-center text-lg font-medium lowercase text-foreground/80 max-w-3xl mx-auto">
              Over the past three years, we&apos;ve had the privilege of working
              with incredible teams, founders, and developers in the Web3 space.
              Here&apos;s what they have to say!
            </p>
          </div>

          <div className="relative w-full max-w-7xl mx-auto min-h-[400px]">
            {/* Mobile view: Single testimonial */}
            <div className="lg:hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonials[currentIndex].id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="w-full"
                >
                  <Card className="bg-[#770002] border-none shadow-[0px_0px_35px_0px_#FFFFFFCC_inset]">
                    <CardContent className="p-8">
                      <p className="text-white font-dmsans font-medium text-xl mb-6">
                        &quot;{testimonials[currentIndex].text}&quot;
                      </p>
                      <div>
                        <p className="font-bold font-thunder text-3xl text-white">
                          - {testimonials[currentIndex].author}
                        </p>
                        <p className="text-sm font-dmsans font-medium text-white">
                          {testimonials[currentIndex].position}
                        </p>
                        <div className="flex">
                          <div className="bg-white px-2 py-1 mt-2">
                            <p className="text-xs text-[#770002] uppercase">
                              {testimonials[currentIndex].category}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop view: Grid layout */}
            <div className="hidden mb-10 lg:block">
              <div className="grid grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {getVisibleTestimonials().map((testimonial) => (
                    <motion.div
                      key={`${testimonial.id}-${testimonial.order}`}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          delay: testimonial.order * 0.1,
                        },
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.8,
                        y: -20,
                        transition: { duration: 0.3 },
                      }}
                      className="h-full"
                    >
                      <Card className="bg-[#770002] border-none shadow-[0px_0px_35px_0px_#FFFFFFCC_inset] h-full transform hover:scale-105 transition-transform duration-300">
                        <CardContent className="p-8">
                          <p className="text-white font-dmsans font-medium text-xl mb-6">
                            &quot;{testimonial.text}&quot;
                          </p>
                          <div>
                            <p className="font-bold font-thunder text-4xl text-white">
                              - {testimonial.author}
                            </p>
                            <p className="text-xl font-dmsans font-medium text-white">
                              {testimonial.position}
                            </p>
                            <div className="flex">
                              <div className="bg-white px-2 py-1 mt-2">
                                <p className="text-base text-[#770002] uppercase">
                                  {testimonial.category}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2 my-8">
              {testimonials.map((_, index) => (
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
        </div>
      </section>
    </div>
  );
};

export default TestimonialsSection;
