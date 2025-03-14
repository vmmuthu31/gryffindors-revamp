"use client";

const tickerItems = [
  "Smart Contracts",
  "dApps Development",
  "DeFi Solutions",
  "NFT Ecosystems",
  "ZK Rollups",
  "Blockchain Security",
  "Web3 Consulting",
  "Decentralized Identity",
  "GameFi & Metaverse",
  "DAO Infrastructure",
];

const RunningWordsTicker = ({
  direction = "right",
}: {
  direction?: "right" | "left";
}) => {
  return (
    <div className="ticker-container">
      <div className="flex">
        <div
          className={`ticker-wrapper animate-marquee ${
            direction === "left" ? "animate-marquee-reverse" : ""
          }`}
        >
          {tickerItems.map((item, index) => (
            <span key={`ticker-1-${index}`} className="ticker-item">
              {item}
              <span className="mx-2">✦</span>
            </span>
          ))}
        </div>

        {/* Duplicate for seamless loop */}
        <div
          className={`ticker-wrapper animate-marquee ${
            direction === "left" ? "animate-marquee-reverse" : ""
          }`}
        >
          {tickerItems.map((item, index) => (
            <span key={`ticker-2-${index}`} className="ticker-item">
              {item}
              <span className="mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RunningWordsTicker;
