"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ChevronUp, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Caption {
  start: string;
  dur: string;
  text: string;
}

interface YouTubeTranscriptProps {
  videoUrl: string;
  className?: string;
  currentTime?: number;
  onTimestampClick?: (seconds: number) => void;
}

function extractVideoId(url: string): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/watch")) {
    const match = url.match(/v=([^&\s]+)/);
    return match?.[1] || null;
  }
  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1]?.split(/[?&]/)[0] || null;
  }
  if (
    url.includes("youtube.com/embed/") ||
    url.includes("youtube-nocookie.com/embed/")
  ) {
    return url.split("/embed/")[1]?.split(/[?&]/)[0] || null;
  }
  return null;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function YouTubeTranscript({
  videoUrl,
  className,
  currentTime = 0,
  onTimestampClick,
}: YouTubeTranscriptProps) {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const transcriptRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCaptions() {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        setError("Invalid video URL");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/youtube/captions?videoId=${videoId}&lang=en`
        );
        const data = await res.json();

        if (data.captions && data.captions.length > 0) {
          setCaptions(data.captions);
        } else {
          setError("No captions available");
        }
      } catch (err) {
        console.error("Failed to fetch captions:", err);
        setError("Could not load captions");
      } finally {
        setLoading(false);
      }
    }

    fetchCaptions();
  }, [videoUrl]);

  useEffect(() => {
    if (
      activeRef.current &&
      transcriptRef.current &&
      isExpanded &&
      !searchQuery
    ) {
      const container = transcriptRef.current;
      const activeElement = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();
      const isVisible =
        activeRect.top >= containerRect.top &&
        activeRect.bottom <= containerRect.bottom;

      if (!isVisible) {
        const scrollTop =
          activeElement.offsetTop -
          container.offsetTop -
          container.clientHeight / 2 +
          activeElement.clientHeight / 2;
        container.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    }
  }, [currentTime, isExpanded, searchQuery]);

  const handleTimestampClick = (startTime: string) => {
    const seconds = parseFloat(startTime);
    onTimestampClick?.(seconds);
  };

  const isActive = useCallback(
    (caption: Caption) => {
      const start = parseFloat(caption.start);
      const end = start + parseFloat(caption.dur);
      return currentTime >= start && currentTime < end;
    },
    [currentTime]
  );

  const filteredCaptions = searchQuery
    ? captions.filter((caption) =>
        caption.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : captions;

  if (loading) {
    return (
      <div className={cn("p-4 bg-gray-50 rounded-lg border", className)}>
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading transcript...</span>
        </div>
      </div>
    );
  }

  if (error || captions.length === 0) {
    return null;
  }

  return (
    <div className={cn("bg-gray-50 rounded-lg border", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-900">
          📝 Video Transcript ({captions.length} segments)
          {currentTime > 0 && (
            <span className="ml-2 text-sm text-[#841a1c]">
              • Playing: {formatTime(currentTime)}
            </span>
          )}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t">
          <div className="p-3 border-b bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transcript..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#841a1c]"
              />
            </div>
          </div>

          <div
            ref={transcriptRef}
            className="max-h-96 overflow-y-auto p-4 space-y-1"
          >
            {filteredCaptions.map((caption, index) => {
              const active = isActive(caption);
              return (
                <div
                  key={index}
                  ref={active ? activeRef : null}
                  className={cn(
                    "flex gap-3 p-2 rounded cursor-pointer transition-all",
                    active
                      ? "bg-[#841a1c]/10 border-l-4 border-[#841a1c] pl-3"
                      : "hover:bg-white border-l-4 border-transparent"
                  )}
                  onClick={() => handleTimestampClick(caption.start)}
                >
                  <span
                    className={cn(
                      "font-mono text-sm min-w-[50px]",
                      active ? "text-[#841a1c] font-bold" : "text-[#841a1c]"
                    )}
                  >
                    {formatTime(parseFloat(caption.start))}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      active ? "text-gray-900 font-medium" : "text-gray-700"
                    )}
                  >
                    {caption.text}
                  </span>
                </div>
              );
            })}
            {filteredCaptions.length === 0 && searchQuery && (
              <p className="text-gray-500 text-center py-4">
                No matches found for &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
