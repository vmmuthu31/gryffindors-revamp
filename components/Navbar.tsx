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
    <nav className="bg-background font-dmsans py-4 md:py-14  top-0 z-50">
      <div className="container flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="Gryffindors Logo"
            width={55}
            height={55}
            className="object-contain"
          />
          <span className="font-bold text-primary text-3xl">Gryffindors</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-lg">
          <Link
            href="/#about"
            className="hover:text-foreground text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/#services"
            className="hover:text-foreground text-primary transition-colors"
          >
            Our Services
          </Link>
          <Link
            href="/#team"
            className="hover:text-foreground text-primary transition-colors"
          >
            Our Team
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Image src="/assets/star.svg" alt="Star" width={45} height={45} />
          <Button asChild size="xl" className="rounded-full text-lg ">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#fff8f9] border-t border-border py-4 px-4 absolute w-full z-50">
          <div className="flex flex-col space-y-4">
            <Link
              href="/#about"
              className="text-foreground hover:text-primary font-medium transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href="/#services"
              className="text-foreground hover:text-primary font-medium transition-colors"
              onClick={toggleMenu}
            >
              Our Services
            </Link>
            <Link
              href="/#team"
              className="text-foreground hover:text-primary font-medium transition-colors"
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
