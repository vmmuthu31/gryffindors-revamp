"use client";

import { SessionProvider } from "next-auth/react";
import LMSSidebar from "@/components/lms/Sidebar";
import MobileSidebar from "@/components/lms/MobileSidebar";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LMSSidebar />
      <MobileSidebar />
      <main className="ml-0 md:ml-64 p-4 md:p-8 min-h-screen pt-20 md:pt-8">
        {children}
      </main>
    </SessionProvider>
  );
}
