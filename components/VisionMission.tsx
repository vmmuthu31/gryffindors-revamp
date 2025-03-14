"use client";

import { useInView } from "react-intersection-observer";

const VisionMission = () => {
  const { ref: visionRef, inView: visionInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { ref: missionRef, inView: missionInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="circle-decoration w-72 h-72 -top-36 right-36 opacity-10"></div>

      <div className="container grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Vision Section */}
        <div
          ref={visionRef}
          className={`flex flex-col space-y-6 transition-all duration-700 transform ${
            visionInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-4xl md:text-5xl lg:text-[168px] font-thunder font-bold text-primary tracking-normal">
            VISION
          </p>
          <p className="text-lg lowercase text-foreground font-dmsans">
            to lead the transformation of the digital economy by making web3
            mainstream—one decentralized solution at a time. we empower
            businesses, startups, and creators with cutting-edge blockchain
            technology, ensuring a scalable, secure, and trustless future.{" "}
          </p>
        </div>

        {/* Mission Section */}
        <div
          ref={missionRef}
          className={`flex flex-col space-y-6 transition-all duration-700 delay-300 transform ${
            missionInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-4xl md:text-5xl lg:text-[168px] font-thunder font-bold text-primary tracking-normal">
            MISSION
          </p>
          <p className="text-lg lowercase text-foreground font-dmsans">
            We design, build, and scale decentralized solutions that accelerate
            Web3 adoption. Through smart contracts, dApps, DeFi, GameFi, and
            privacy-focused innovations, we help organizations leverage
            blockchain to create seamless, transparent, and future-ready digital
            experiences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
