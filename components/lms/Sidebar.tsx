"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  ClipboardList,
  Users,
  LogOut,
  FolderOpen,
  Home,
  Loader2,
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

export default function LMSSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const role =
    (session?.user as { role?: string } | undefined)?.role || "STUDENT";

  const links =
    role === "ADMIN"
      ? adminLinks
      : role === "MENTOR"
      ? mentorLinks
      : studentLinks;

  const menuLabel =
    role === "ADMIN"
      ? "Admin Menu"
      : role === "MENTOR"
      ? "Mentor Menu"
      : "Student Menu";

  if (status === "loading") {
    return (
      <aside className="w-64 h-screen bg-white border-r border-gray-200 flex items-center justify-center fixed left-0 top-0 z-50">
        <Loader2 className="w-6 h-6 animate-spin text-[#841a1c]" />
      </aside>
    );
  }

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#841a1c] rounded-lg flex items-center justify-center">
            <Image
              src="/assets/logo.png"
              alt="Gryffindors Logo"
              width={32}
              height={32}
              className="object-contain"
            />{" "}
          </div>
          <div>
            <span className="font-bold text-lg text-gray-900">Gryffindors</span>
            <span className="text-xs block text-gray-500">LMS Portal</span>
          </div>
        </Link>
      </div>

      {session?.user && (
        <div className="px-6 py-4 border-b border-gray-100">
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
            pathname === link.href || pathname.startsWith(link.href + "/");
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

      <div className="p-4 border-t border-gray-100 space-y-1">
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
