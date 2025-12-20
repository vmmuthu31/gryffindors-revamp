"use client";

interface WordStyle {
  text: string;
  isOutline: boolean;
}

interface RunningHeadingProps {
  words: WordStyle[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
  filledColor?: string;
  outlineWidth?: string;
  outlineColor?: string;
}

const RunningHeading: React.FC<RunningHeadingProps> = ({
  words,
  speed = 10,
  direction = "left",
  className = "",
  filledColor = "text-[#841a1c]",
  outlineWidth = "2px",
  outlineColor = "#841a1c",
}) => {
  const HeadingGroup = () => (
    <div className="flex items-center whitespace-nowrap px-12">
      {words.map((word, index) => (
        <span
          key={index}
          className={`text-8xl lg:text-[200px] font-thunder font-extrabold uppercase mr-5 ${
            word.isOutline ? "text-transparent" : filledColor
          }`}
          style={
            word.isOutline
              ? {
                  WebkitTextStroke: `${outlineWidth} ${outlineColor}`,
                  textShadow: "none",
                }
              : {}
          }
        >
          {word.text}
        </span>
      ))}
    </div>
  );

  return (
    <div className={`w-full overflow-hidden relative ${className}`}>
      <div className="flex whitespace-nowrap">
        {/* Create an infinite marquee animation with CSS instead of framer-motion */}
        <div
          className="flex whitespace-nowrap animate-marquee"
          style={{
            animationDirection: direction === "left" ? "normal" : "reverse",
            animationDuration: `${speed}s`,
          }}
        >
          {/* Use multiple copies to ensure continuous flow */}
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <HeadingGroup key={i} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default RunningHeading;
