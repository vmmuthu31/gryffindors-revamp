"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrolltoTop";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

const LMS_ROUTES = ["/student", "/mentor", "/admin", "/auth", "/internships"];

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLMSRoute = LMS_ROUTES.some((route) => pathname.startsWith(route));

  useEffect(() => {
    document.body.className = "antialiased";
  }, []);

  return (
    <body className="antialiased" suppressHydrationWarning>
      <SessionProvider>
        {!isLMSRoute && <Navbar />}
        {children}
        <Toaster />
        {!isLMSRoute && <Footer />}
        {!isLMSRoute && <ScrollToTop />}
        {!isLMSRoute && <CustomCursor />}
      </SessionProvider>
    </body>
  );
}
