"use client";

import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateCursorType = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y);
      setIsPointer(
        window.getComputedStyle(hoveredElement || document.body).cursor ===
          "pointer"
      );
    };

    window.addEventListener("mousemove", updateCursor);
    window.addEventListener("mousemove", updateCursorType);

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      window.removeEventListener("mousemove", updateCursorType);
    };
  }, [position.x, position.y]);

  return (
    <div
      className={`fixed pointer-events-none z-50 mix-blend-difference transition-transform duration-300 ${
        isPointer ? "scale-150" : ""
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="w-6 h-6 bg-white rounded-full" />
    </div>
  );
};

export default CustomCursor;
