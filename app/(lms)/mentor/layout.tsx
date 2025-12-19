"use client";

import { SessionProvider } from "next-auth/react";
import LMSSidebar from "@/components/lms/Sidebar";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LMSSidebar />
      <main className="ml-64 p-8 min-h-screen">{children}</main>
    </SessionProvider>
  );
}
