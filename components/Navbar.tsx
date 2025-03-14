"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-background py-4 sticky top-0 z-50">
      <div className="container flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Gryffindors Logo"
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="font-bold text-primary text-xl">Gryffindors</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/about"
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/our-services"
            className="text-foreground hover:text-primary transition-colors"
          >
            Our Services
          </Link>
          <Link
            href="/our-team"
            className="text-foreground hover:text-primary transition-colors"
          >
            Our Team
          </Link>
          <Button
            variant="default"
            asChild
            className="rounded-full text-sm px-6"
          >
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border py-4 px-4 absolute w-full">
          <div className="flex flex-col space-y-4">
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href="/our-services"
              className="text-foreground hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              Our Services
            </Link>
            <Link
              href="/our-team"
              className="text-foreground hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              Our Team
            </Link>
            <Button
              variant="default"
              asChild
              className="rounded-full text-sm w-full"
            >
              <Link href="/contact" onClick={toggleMenu}>
                Contact us
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
