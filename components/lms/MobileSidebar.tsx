"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  ClipboardList,
  Users,
  LogOut,
  FolderOpen,
  Menu,
  X,
  Home,
} from "lucide-react";
import Image from "next/image";

const studentLinks = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/courses", label: "My Courses", icon: BookOpen },
  { href: "/student/certificates", label: "Certificates", icon: Award },
];

const mentorLinks = [
  { href: "/mentor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/mentor/students", label: "My Students", icon: Users },
  { href: "/mentor/submissions", label: "Submissions", icon: ClipboardList },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/internships", label: "Internships", icon: BookOpen },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/bulk-enroll", label: "Bulk Enroll", icon: FolderOpen },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
];

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const role = (session?.user as { role?: string } | undefined)?.role;

  const links =
    role === "ADMIN"
      ? adminLinks
      : role === "MENTOR"
      ? mentorLinks
      : role === "STUDENT"
      ? studentLinks
      : [];

  const menuLabel =
    role === "ADMIN"
      ? "Admin Menu"
      : role === "MENTOR"
      ? "Mentor Menu"
      : role === "STUDENT"
      ? "Student Menu"
      : "";

  return (
    <div className="md:hidden">
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#841a1c] rounded-lg flex items-center justify-center">
            <Image
              src="/assets/logo.png"
              alt="Gryffindors"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg text-gray-900">Gryffindors</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="h-16" />

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 flex flex-col shadow-xl"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-lg text-gray-900">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {session?.user && (
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#841a1c] text-white flex items-center justify-center font-bold">
                      {(session.user.name ||
                        session.user.email ||
                        "U")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {session.user.name || "User"}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 mb-4"
                >
                  <Home className="w-5 h-5" />
                  Back to Website
                </Link>

                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                  {menuLabel}
                </div>

                {links.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    pathname.startsWith(link.href + "/");
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-[#841a1c] text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
