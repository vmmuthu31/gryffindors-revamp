import Image from "next/image";

const StatsSection = () => {
  return (
    <section className="lg:pb-16 pb-10 bg-background">
      <div className="flex container items-center justify-start gap-8">
        <Image
          src="/assets/starknet.svg"
          alt="Stats"
          className="lg:w-60 lg:h-60 w-24 h-24 md:w-40 md:h-40"
          width={250}
          height={250}
        />
        <Image
          src="/assets/phoenixguild.svg"
          alt="Stats"
          className="lg:w-60 lg:h-60 w-24 h-24 md:w-40 md:h-40"
          width={250}
          height={250}
        />
        <Image
          src="/assets/ethglobal.svg"
          alt="Stats"
          className="lg:w-60 lg:h-60 w-24 h-24 md:w-40 md:h-40"
          width={250}
          height={250}
        />
      </div>

      <div className="container lg:mt-10 mt-5">
        <hr className="border-t-[#511111]/50 border-border" />
      </div>
      <div className="container lg:mt-10 mt-5">
        <p className="text-start text-lg text-foreground font-dmsans mx-auto mb-12">
          At Gryffindors, we don&apos;t just build—we engineer the decentralized
          future. From game-changing smart contracts to high-impact dApps, we
          turn ambitious Web3 visions into reality. With a track record of
          winning, scaling, and innovating, we help startups, DAOs, and
          enterprises push the boundaries of what&apos;s possible on-chain.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          <div className="flex flex-col items-center text-center gap-2">
            <p className="text-sm lg:text-2xl font-dmsans text-foreground">
              blockchain deployments
            </p>
            <hr className="border-t-[#511111] border-dashed border w-full lg:mb-5" />
            <p className="text-3xl md:text-4xl whitespace-nowrap lg:text-7xl font-thunder italic font-bold text-[#770002] mb-1">
              200+
            </p>
          </div>

          {/* Hackathon Achievements */}
          <div className="flex flex-col items-center text-center gap-2">
            <p className="text-sm lg:text-2xl font-dmsans text-foreground">
              hackathon achievements
            </p>
            <hr className="border-t-[#511111] border-dashed border w-full lg:mb-5" />

            <p className="text-3xl md:text-4xl whitespace-nowrap lg:text-7xl font-thunder italic font-bold text-[#770002] mb-1">
              25+ wins
            </p>
          </div>

          {/* Project & Bounty Earnings */}
          <div className="flex flex-col items-center text-center gap-2">
            <p className="text-sm lg:text-2xl font-dmsans text-foreground">
              project & bounty earnings
            </p>
            <hr className="border-t-[#511111] border-dashed border w-full lg:mb-5" />

            <p className="text-3xl md:text-4xl whitespace-nowrap lg:text-7xl font-thunder italic font-bold text-[#770002] mb-1">
              60 lakhs+
            </p>
          </div>

          {/* Funded & Recognized */}
          <div className="flex flex-col items-center text-center gap-2">
            <p className="text-sm lg:text-2xl font-dmsans text-foreground">
              funded & recognized
            </p>
            <hr className="border-t-[#511111] border-dashed border w-full lg:mb-5" />

            <p className="text-3xl md:text-4xl whitespace-nowrap lg:text-7xl font-thunder italic font-bold text-[#770002] mb-1">
              $25k+
            </p>
          </div>

          {/* Community Members */}
          <div className="flex flex-col items-center text-center gap-2">
            <p className="text-sm lg:text-2xl font-dmsans text-foreground">
              community members
            </p>
            <hr className="border-t-[#511111] border-dashed border w-full lg:mb-5" />

            <p className="text-3xl md:text-4xl whitespace-nowrap lg:text-7xl font-thunder italic font-bold text-[#770002] mb-1">
              500+
            </p>
          </div>

          {/* Global Clients Served */}
          <div className="flex flex-col items-center text-center gap-2">
            <p className="text-sm lg:text-2xl font-dmsans text-foreground">
              global clients served
            </p>
            <hr className="border-t-[#511111] border-dashed border w-full lg:mb-5" />

            <p className="text-3xl md:text-4xl whitespace-nowrap lg:text-7xl font-thunder italic font-bold text-[#770002] mb-1">
              50+
            </p>
          </div>

          {/* Workshops & Events */}
          <div className="flex flex-col items-center text-center gap-2">
            <p className="text-sm lg:text-2xl font-dmsans text-foreground">
              workshops & events
            </p>
            <hr className="border-t-[#511111] border-dashed border w-full lg:mb-5" />

            <p className="text-3xl md:text-4xl whitespace-nowrap lg:text-7xl font-thunder italic font-bold text-[#770002] mb-1">
              20+
            </p>
          </div>

          {/* Ecosystem Partnerships */}
          <div className="flex flex-col items-center text-center gap-2">
            <p className="text-sm lg:text-2xl font-dmsans text-foreground">
              ecosystem partnerships
            </p>
            <hr className="border-t-[#511111] border-dashed border w-full lg:mb-5" />

            <p className="text-3xl md:text-4xl whitespace-nowrap lg:text-7xl font-thunder italic font-bold text-[#770002] mb-1">
              10+
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
