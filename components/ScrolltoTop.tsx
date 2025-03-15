"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "lucide-react";

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  const handleScroll = () => {
    setShow(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    show && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-10 right-10 p-3 rounded-full border bg-black border-[#770002] text-white shadow-lg"
      >
        <ArrowUpIcon className="w-10 h-10" />
      </button>
    )
  );
};

export default ScrollToTop;
