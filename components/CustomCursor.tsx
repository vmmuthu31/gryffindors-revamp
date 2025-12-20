"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  Bitcoin,
  Wallet,
  Network,
  Blocks,
  Database,
  Share2,
  Key,
  FileCode,
  ChevronRight,
} from "lucide-react";
import { FaEthereum } from "react-icons/fa";

export default function CustomCursor() {
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [hexRotation, setHexRotation] = useState(0);
  const [cursorMode, setCursorMode] = useState<string>("default");
  const [isHovering, setIsHovering] = useState(false);
  const [dotScale, setDotScale] = useState(1);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 22, stiffness: 350 };
  const strongSpringConfig = { damping: 28, stiffness: 550 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const dotX = useSpring(cursorX, strongSpringConfig);
  const dotY = useSpring(cursorY, strongSpringConfig);

  useEffect(() => {
    const interval = setInterval(() => {
      setHexRotation((prev) => (prev + 0.5) % 360);
    }, 50);

    const pulseDot = setInterval(() => {
      if (Math.random() > 0.5) {
        setDotScale(1.4);
        setTimeout(() => setDotScale(1), 150);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(pulseDot);
    };
  }, []);

  const blockchainElements = useRef({
    ethereum: ["eth", "ethereum", "web3"],
    "smart-contract": ["contract", "deploy", "solidity"],
    wallet: ["connect", "wallet", "account", "metamask"],
    nft: ["nft", "token", "collectible"],
    dao: ["dao", "governance", "vote"],
    defi: ["defi", "swap", "yield", "finance"],
    blockchain: ["block", "chain", "ledger", "hash"],
    cryptography: ["crypto", "encrypt", "secure"],
  });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(isTouch);

    if (isTouch) return;

    document.body.classList.add("custom-cursor-active");

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);

      const elementsUnderCursor = document.elementsFromPoint(
        e.clientX,
        e.clientY
      );

      const clickable = elementsUnderCursor.some((el) => {
        const tag = el.tagName.toLowerCase();
        return (
          tag === "button" ||
          tag === "a" ||
          el.getAttribute("role") === "button" ||
          getComputedStyle(el).cursor === "pointer"
        );
      });

      if (clickable) {
        setCursorVariant("clickable");
        setIsHovering(true);
      } else {
        setCursorVariant("default");
        setIsHovering(false);
      }

      let newCursorMode = "default";

      for (const el of elementsUnderCursor) {
        const textContent = el.textContent?.toLowerCase() || "";
        const attrs = [
          el.id?.toLowerCase() || "",
          ...[...el.classList].map((c) => c.toLowerCase()),
          el.getAttribute("data-blockchain")?.toLowerCase() || "",
          el.getAttribute("aria-label")?.toLowerCase() || "",
          el.getAttribute("alt")?.toLowerCase() || "",
          el.getAttribute("data-section")?.toLowerCase() || "",
        ];

        for (const [mode, keywords] of Object.entries(
          blockchainElements.current
        )) {
          if (
            keywords.some(
              (keyword) =>
                textContent.includes(keyword) ||
                attrs.some((attr) => attr.includes(keyword))
            )
          ) {
            newCursorMode = mode;
            break;
          }
        }

        if (newCursorMode !== "default") break;
      }

      setCursorMode(newCursorMode);
    };

    const handleMouseDown = () => {
      setCursorVariant("clicking");
      setDotScale(0.7);
      setTimeout(() => {
        setDotScale(1.2);
        setTimeout(() => {
          setDotScale(1);
        }, 150);
      }, 100);
    };

    const handleMouseUp = () => {
      setCursorVariant((prev) =>
        prev === "clicking" ? (isHovering ? "clickable" : "default") : prev
      );
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isHovering]);

  const variants = {
    default: {
      width: 60,
      height: 60,
      backgroundColor: "rgba(119, 0, 2, 0.03)",
      border: "2px solid rgba(119, 0, 2, 0.7)",
      x: "-50%",
      y: "-50%",
      rotate: [0, 360],
      transition: {
        rotate: {
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        },
        default: { type: "spring", mass: 0.6 },
      },
    },
    clickable: {
      width: 80,
      height: 80,
      backgroundColor: "rgba(255, 197, 0, 0.08)",
      border: "2px solid rgba(255, 197, 0, 0.8)",
      x: "-50%",
      y: "-50%",
      rotate: [0, 360],
      transition: {
        rotate: {
          repeat: Infinity,
          duration: 15,
          ease: "linear",
        },
        default: { type: "spring", mass: 0.6 },
      },
    },
    clicking: {
      width: 70,
      height: 70,
      backgroundColor: "rgba(255, 197, 0, 0.15)",
      border: "2px solid rgba(255, 197, 0, 0.9)",
      scale: 0.92,
      x: "-50%",
      y: "-50%",
      transition: { type: "spring", mass: 0.6 },
    },
  };

  if (isTouchDevice || !isVisible) return null;

  const getBlockchainIcon = () => {
    switch (cursorMode) {
      case "ethereum":
        return <FaEthereum className="text-[#770002] text-3xl" />;
      case "smart-contract":
        return <FileCode className="text-[#770002]" size={24} />;
      case "wallet":
        return <Wallet className="text-[#770002]" size={24} />;
      case "nft":
        return <Database className="text-[#770002]" size={24} />;
      case "dao":
        return <Share2 className="text-[#770002]" size={24} />;
      case "defi":
        return <Bitcoin className="text-[#770002]" size={24} />;
      case "blockchain":
        return <Blocks className="text-[#770002]" size={24} />;
      case "cryptography":
        return <Key className="text-[#770002]" size={24} />;
      default:
        return cursorVariant === "clickable" ? (
          <ChevronRight className="text-[#ffc500]" size={24} />
        ) : (
          <Network className="text-[#770002]" size={24} />
        );
    }
  };

  return (
    <>
      <motion.div
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
        animate={cursorVariant}
        variants={variants}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-hidden backdrop-blur-[2px]"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          className="absolute inset-0 opacity-30"
          style={{ transform: `rotate(${hexRotation}deg)` }}
        >
          <defs>
            <linearGradient id="hexFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={
                  cursorVariant === "clickable" ? "#ffc500" : "#770002"
                }
                stopOpacity="0.05"
              />
              <stop
                offset="50%"
                stopColor={
                  cursorVariant === "clickable" ? "#ffc500" : "#770002"
                }
                stopOpacity="0.02"
              />
              <stop
                offset="100%"
                stopColor={
                  cursorVariant === "clickable" ? "#ffc500" : "#770002"
                }
                stopOpacity="0.05"
              />
            </linearGradient>
          </defs>
          <pattern
            id="hexagons"
            width="28"
            height="48"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(0.5) rotate(0)"
          >
            <g>
              <polygon
                fill="url(#hexFill)"
                stroke={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
                strokeWidth="0.8"
                strokeOpacity="0.6"
                points="14.4,0 4.8,0 0,8.4 4.8,16.8 14.4,16.8 19.2,8.4"
              />
              <polygon
                fill="url(#hexFill)"
                stroke={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
                strokeWidth="0.8"
                strokeOpacity="0.6"
                points="4.8,16.8 0,25.2 4.8,33.6 14.4,33.6 19.2,25.2 14.4,16.8"
              />
              <polygon
                fill="url(#hexFill)"
                stroke={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
                strokeWidth="0.8"
                strokeOpacity="0.6"
                points="19.2,8.4 24,16.8 19.2,25.2 28.8,25.2 33.6,16.8 28.8,8.4"
              />
            </g>
          </pattern>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>

        {/* Glow effect layer */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              cursorVariant === "clickable"
                ? "0 0 15px 2px rgba(255, 197, 0, 0.3) inset"
                : "0 0 15px 2px rgba(119, 0, 2, 0.2) inset",
            opacity: 0.7,
          }}
        />

        {/* Icon container with hover effect */}
        <motion.div
          className="z-10 relative p-2 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            scale: {
              repeat: Infinity,
              duration: cursorVariant === "clickable" ? 1.5 : 3,
              ease: "easeInOut",
            },
          }}
        >
          {getBlockchainIcon()}
        </motion.div>

        {/* Animated inner blockchain nodes */}
        {cursorVariant !== "clicking" && (
          <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <g
                fill="none"
                stroke={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
                strokeOpacity="0.8"
              >
                <circle cx="50" cy="50" r="10" strokeWidth="1" />
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="5"
                  fill={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
                  fillOpacity="0.3"
                />
                <circle
                  cx="70"
                  cy="35"
                  r="4"
                  fill={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
                  fillOpacity="0.3"
                />
                <circle
                  cx="65"
                  cy="70"
                  r="5"
                  fill={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
                  fillOpacity="0.3"
                />
                <circle
                  cx="30"
                  cy="65"
                  r="4"
                  fill={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
                  fillOpacity="0.3"
                />
                <line x1="50" y1="50" x2="30" y2="30" strokeWidth="0.75" />
                <line x1="50" y1="50" x2="70" y2="35" strokeWidth="0.75" />
                <line x1="50" y1="50" x2="65" y2="70" strokeWidth="0.75" />
                <line x1="50" y1="50" x2="30" y2="65" strokeWidth="0.75" />
              </g>
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* Core dot follower - blockchain node */}
      <motion.div
        style={{
          left: dotX,
          top: dotY,
          x: "-50%",
          y: "-50%",
          scale: dotScale,
        }}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center"
        animate={{
          width: cursorVariant === "clickable" ? 12 : 10,
          height: cursorVariant === "clickable" ? 12 : 10,
          backgroundColor:
            cursorVariant === "clickable" ? "#ffc500" : "#770002",
          boxShadow:
            cursorVariant === "clickable"
              ? "0 0 10px 2px rgba(255, 197, 0, 0.6)"
              : "0 0 10px 2px rgba(119, 0, 2, 0.4)",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Technical blockchain network visualization */}
      <motion.div
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
          zIndex: 9997,
          position: "fixed",
          pointerEvents: "none",
        }}
        animate={{
          opacity: cursorVariant === "clickable" ? 0.8 : 0.6,
          scale: cursorVariant === "clickable" ? 1.1 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        className="w-[320px] h-[320px] absolute"
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient
              id="lineGradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="100"
              y2="100"
            >
              <stop
                offset="0%"
                stopColor={
                  cursorVariant === "clickable" ? "#ffc500" : "#770002"
                }
                stopOpacity="0.1"
              />
              <stop
                offset="50%"
                stopColor={
                  cursorVariant === "clickable" ? "#ffc500" : "#770002"
                }
                stopOpacity="0.6"
              />
              <stop
                offset="100%"
                stopColor={
                  cursorVariant === "clickable" ? "#ffc500" : "#770002"
                }
                stopOpacity="0.1"
              />
            </linearGradient>

            {/* Hash pattern */}
            <pattern
              id="hashPattern"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <text
                x="0"
                y="8"
                fontSize="4"
                fill={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
                fillOpacity="0.4"
              >
                #
              </text>
            </pattern>
          </defs>

          {/* Hash pattern background */}
          <rect
            width="100"
            height="100"
            fill="url(#hashPattern)"
            fillOpacity="0.05"
            style={{
              display: cursorVariant === "clickable" ? "block" : "none",
            }}
          />

          <g stroke="url(#lineGradient)" strokeWidth="0.4" filter="url(#glow)">
            {/* Animated network lines */}
            <motion.line
              x1="50"
              y1="50"
              x2="10"
              y2="10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 0.8, 0] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
            />
            <motion.line
              x1="50"
              y1="50"
              x2="90"
              y2="10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 0.8, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.5,
              }}
            />
            <motion.line
              x1="50"
              y1="50"
              x2="90"
              y2="90"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 0.8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "loop",
                delay: 1,
              }}
            />
            <motion.line
              x1="50"
              y1="50"
              x2="10"
              y2="90"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 0.8, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                repeatType: "loop",
                delay: 1.5,
              }}
            />
            <motion.line
              x1="50"
              y1="50"
              x2="10"
              y2="50"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 0.8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.8,
              }}
            />
            <motion.line
              x1="50"
              y1="50"
              x2="90"
              y2="50"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 0.8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
                delay: 1.2,
              }}
            />
            <motion.line
              x1="50"
              y1="50"
              x2="50"
              y2="10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 0.8, 0] }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.3,
              }}
            />
            <motion.line
              x1="50"
              y1="50"
              x2="50"
              y2="90"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 0.8, 0] }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                repeatType: "loop",
                delay: 1.7,
              }}
            />

            {/* Data pulses */}
            <motion.circle
              cx="50"
              cy="50"
              r="1.5"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                cx: [50, 10, 10],
                cy: [50, 10, 10],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                delay: 1,
              }}
              fill={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="1.5"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                cx: [50, 90, 90],
                cy: [50, 10, 10],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                delay: 2,
              }}
              fill={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="1.5"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                cx: [50, 90, 90],
                cy: [50, 90, 90],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                delay: 0.5,
              }}
              fill={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="1.5"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                cx: [50, 10, 10],
                cy: [50, 90, 90],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                delay: 1.5,
              }}
              fill={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
            />
          </g>
        </svg>
      </motion.div>

      <AnimatePresence>
        {cursorVariant === "clicking" && (
          <motion.div
            initial={{ opacity: 0.9, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2, rotate: 15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              left: cursorX.get(),
              top: cursorY.get(),
              position: "fixed",
              transform: "translate(-50%, -50%)",
              zIndex: 9996,
              pointerEvents: "none",
            }}
            className="overflow-hidden rounded-full"
          >
            <div className="w-32 h-32 flex items-center justify-center rounded-full">
              {" "}
              {/* Larger effect */}
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <defs>
                  <radialGradient
                    id="clickGlow"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="50%"
                    fy="50%"
                  >
                    <stop offset="0%" stopColor="#ffc500" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#ffc500" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <circle cx="50" cy="50" r="40" fill="url(#clickGlow)" />

                <g fill="none" stroke="#ffc500">
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    strokeWidth="0.5"
                    strokeOpacity="0.8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="20"
                    strokeWidth="0.5"
                    strokeOpacity="0.6"
                  />

                  {/* Binary-like data stream animation */}
                  <text
                    x="20"
                    y="25"
                    fontSize="4"
                    className="opacity-70"
                    fill="#ffc500"
                  >
                    10110011
                  </text>
                  <text
                    x="35"
                    y="35"
                    fontSize="4"
                    className="opacity-70"
                    fill="#ffc500"
                  >
                    01001101
                  </text>
                  <text
                    x="50"
                    y="45"
                    fontSize="4"
                    className="opacity-70"
                    fill="#ffc500"
                  >
                    11010100
                  </text>
                  <text
                    x="30"
                    y="55"
                    fontSize="4"
                    className="opacity-70"
                    fill="#ffc500"
                  >
                    00110101
                  </text>
                  <text
                    x="45"
                    y="65"
                    fontSize="4"
                    className="opacity-70"
                    fill="#ffc500"
                  >
                    10011010
                  </text>
                  <text
                    x="60"
                    y="75"
                    fontSize="4"
                    className="opacity-70"
                    fill="#ffc500"
                  >
                    01110110
                  </text>
                </g>
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Technical grid background - subtle */}
      <motion.div
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
        }}
        className="fixed top-0 left-0 w-[200px] h-[200px] pointer-events-none z-[9995] rounded-full overflow-hidden"
        animate={{
          opacity: cursorVariant === "clickable" ? 0.15 : 0.08,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="opacity-70"
        >
          <defs>
            <pattern
              id="smallGrid"
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 5 0 L 0 0 0 5"
                fill="none"
                stroke={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
                strokeWidth="0.2"
              />
            </pattern>
            <pattern
              id="grid"
              width="25"
              height="25"
              patternUnits="userSpaceOnUse"
            >
              <rect width="25" height="25" fill="url(#smallGrid)" />
              <path
                d="M 25 0 L 0 0 0 25"
                fill="none"
                stroke={cursorVariant === "clickable" ? "#ffc500" : "#770002"}
                strokeWidth="0.3"
              />
            </pattern>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#grid)" />
        </svg>
      </motion.div>
    </>
  );
}
