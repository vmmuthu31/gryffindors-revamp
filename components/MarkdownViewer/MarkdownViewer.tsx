"use client";

import "./MarkdownViewer.scss";
import { useState, useRef, ReactNode, useLayoutEffect } from "react";
import ReactMarkdownLib from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";
import { cn } from "@/lib/utils";
import type { Components } from "react-markdown";
import { isUrl, isValidEmail, isValidNumber } from "@/lib/security";
import Image from "next/image";
import Link from "next/link";

const extractUrlsAndEmails = (text: string): string[] => {
  const words = text.split(/\s+/);

  return words.filter((word) => {
    const cleanWord = word.replace(/[.,;:!?]$/, "");
    return isUrl(cleanWord) || isValidEmail(cleanWord);
  });
};

const isVideoUrl = (url: string): boolean => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".wmv"];
  const videoHostingPatterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtu\.be\/([^&\s]+)/,
    /vimeo\.com\/([^&\s]+)/,
    /dailymotion\.com\/video\/([^&\s]+)/,
    /facebook\.com\/watch\/\?v=([^&\s]+)/,
    /tiktok\.com\/@[^/]+\/video\/([^&\s]+)/,
  ];

  return (
    videoExtensions.some((ext) => url.toLowerCase().endsWith(ext)) ||
    videoHostingPatterns.some((pattern) => pattern.test(url))
  );
};

const getEmbedUrl = (url: string): string | null => {
  if (url.includes("youtube.com/watch")) {
    const videoId = url.match(/v=([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
  if (url.includes("youtu.be")) {
    const videoId = url.split("/").pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
  if (url.includes("vimeo.com")) {
    const videoId = url.split("/").pop();
    return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
  }
  if (url.includes("dailymotion.com/video")) {
    const videoId = url.split("/").pop();
    return videoId
      ? `https://www.dailymotion.com/embed/video/${videoId}`
      : null;
  }
  return null;
};

function SafeImage({
  src,
  alt,
  height,
  width,
}: {
  src: string;
  alt?: string;
  height?: string | number;
  width?: string | number;
}) {
  const imageHeight = isValidNumber(height) ? Number(height) : undefined;
  const imageWidth = isValidNumber(width) ? Number(width) : undefined;

  return (
    <span className="mr-2 inline-block align-top">
      <Link href={src} target="_blank" rel="noopener noreferrer">
        <Image
          src={src}
          alt={alt || "Image"}
          height={imageHeight || 800}
          width={imageWidth || 800}
          sizes="100vw"
          unoptimized
        />
      </Link>
    </span>
  );
}

const markdownComponents: Components = {
  div: "div",
  table: ({ children, ...props }) => (
    <div className="w-full overflow-x-auto">
      <table {...props}>{children}</table>
    </div>
  ),
  thead: "thead",
  tbody: "tbody",
  tr: "tr",
  td: "td",
  th: "th",
  ul: "ul",
  ol: "ol",
  li: "li",
  code: "code",
  pre: "pre",
  img: ({ src, alt, height, width }) => {
    if (!src || typeof src !== "string") {
      return null;
    }

    const embedUrl = getEmbedUrl(src);
    if (embedUrl) {
      return (
        <div className="video-container">
          <iframe
            src={embedUrl}
            className="aspect-video h-auto w-full max-w-[90%]"
            style={{ width: "90%", height: "auto" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={alt || "Embedded video"}
          />
        </div>
      );
    }

    if (isVideoUrl(src)) {
      return (
        <div className="video-container">
          <video
            controls
            className="h-auto w-full max-w-[90%]"
            style={{ width: "90%", height: "auto" }}
            aria-label={alt || "Video content"}
          >
            <source src={src} type={`video/${src.split(".").pop()}`} />
            <track kind="captions" src="" srcLang="en" label="English" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return <SafeImage src={src} alt={alt} height={height} width={width} />;
  },
  a: ({ href, children, ...props }) => {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#841a1c] hover:underline"
        {...props}
      >
        {children}
      </a>
    );
  },
  p: ({ children, ...props }) => {
    if (typeof children === "string") {
      const textContent = children;
      const matches = extractUrlsAndEmails(textContent);

      if (matches.length === 0) {
        return <p {...props}>{children}</p>;
      }

      let remaining = textContent;
      const elements: ReactNode[] = [];
      let index = 0;

      matches.forEach((match) => {
        const position = remaining.indexOf(match);
        if (position !== -1) {
          if (position > 0) {
            elements.push(
              <span key={`text-${index}`}>
                {remaining.substring(0, position)}
              </span>
            );
            index += 1;
          }

          if (isUrl(match)) {
            elements.push(
              <a
                key={`link-${index}`}
                href={match}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#841a1c] hover:underline"
              >
                {match}
              </a>
            );
          } else if (isValidEmail(match)) {
            elements.push(
              <a
                key={`email-${index}`}
                href={`mailto:${match}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#841a1c] hover:underline"
              >
                {match}
              </a>
            );
          } else {
            elements.push(<span key={`text-${index}`}>{match}</span>);
          }

          index += 1;
          remaining = remaining.substring(position + match.length);
        }
      });

      if (remaining) {
        elements.push(<span key={`text-${index}`}>{remaining}</span>);
      }

      return <p {...props}>{elements}</p>;
    }

    return <p {...props}>{children}</p>;
  },
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  blockquote: "blockquote",
  hr: "hr",
  strong: "strong",
  em: "em",
  del: "del",
  s: "s",
  sup: "sup",
  sub: "sub",
  mark: "mark",
  br: "br",
  span: "span",
};

interface ReactMarkdownProps {
  markdown: string;
  variant?: "inline" | "default";
  className?: string;
  truncate?: boolean;
  lineClampClassName?: string;
  onShowMore?: () => void;
}

export function MarkdownViewer(props: ReactMarkdownProps) {
  const {
    markdown,
    className,
    truncate = false,
    lineClampClassName,
    onShowMore,
    variant = "default",
  } = props;
  const [showMore, setShowMore] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = editorRef.current;

    const handleResize = () => {
      if (!truncate || !element) return;
      const { scrollHeight, offsetHeight } = element;

      if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
        setIsTruncated(true);
      } else {
        setIsTruncated(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (editorRef.current) {
      resizeObserver.observe(editorRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (element) {
        resizeObserver.unobserve(element);
      }
    };
  }, [truncate]);

  const handleShowMore = () => {
    if (onShowMore) {
      onShowMore();
      return;
    }
    setShowMore(true);
  };

  const handleShowLess = () => {
    setShowMore(false);
  };

  return (
    <div className="w-full">
      <div
        ref={editorRef}
        className={cn(
          "markdown-body",
          truncate && !showMore
            ? lineClampClassName || "line-clamp-4"
            : "line-clamp-none",
          "w-full",
          className
        )}
      >
        <ReactMarkdownLib
          components={markdownComponents}
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
        >
          {markdown || ""}
        </ReactMarkdownLib>
      </div>
      {truncate &&
        (showMore ? (
          <div className="flex justify-center pt-2">
            <span
              onClick={handleShowLess}
              className="flex cursor-pointer items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700"
              aria-hidden="true"
            >
              Show Less <FiArrowUpCircle className="text-lg" />
            </span>
          </div>
        ) : isTruncated ? (
          variant === "inline" ? (
            <div className="flex justify-start pt-2">
              <span
                onClick={handleShowMore}
                className="cursor-pointer text-xs font-medium text-[#841a1c]"
                aria-hidden="true"
              >
                Show More
              </span>
            </div>
          ) : (
            <div className="flex justify-center pt-2">
              <span
                onClick={handleShowMore}
                className="flex cursor-pointer items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700"
                aria-hidden="true"
              >
                Show More <FiArrowDownCircle className="text-lg" />
              </span>
            </div>
          )
        ) : null)}
    </div>
  );
}
