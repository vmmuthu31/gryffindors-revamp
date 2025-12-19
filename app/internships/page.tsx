import Link from "next/link";
import {
  ArrowRight,
  Code,
  Cpu,
  Database,
  GraduationCap,
  Clock,
  Users,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInternships } from "@/actions/internship";
import Image from "next/image";

const trackIcons = {
  FULL_STACK: Code,
  AI_ML: Cpu,
  WEB3: Database,
};

const trackColors = {
  FULL_STACK: "from-blue-500 to-indigo-600",
  AI_ML: "from-purple-500 to-pink-600",
  WEB3: "from-orange-500 to-red-600",
};

export default async function InternshipsPage() {
  const internships = await getInternships();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/logo.png"
              alt="Gryffindors Logo"
              width={32}
              height={32}
              className="object-contain"
            />{" "}
            <span className="font-bold text-xl text-gray-900">Gryffindors</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link href="/internships" className="text-[#841a1c] font-medium">
              Internships
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-[#841a1c] text-white rounded-lg hover:bg-[#681416] transition-colors"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-[#841a1c] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#841a1c] to-[#5a1213]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full border border-white/30" />
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full border border-white/20" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="bg-white/10 hover:bg-white/20 text-white mb-6 px-4 py-2 text-sm backdrop-blur-sm border-none">
            🚀 2026 Batch Now Open
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Internship <span className="text-white/80">Programs</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Build real-world projects, master industry-ready skills, and get
            career-ready with mentorship from Gryffindors experts.
          </p>
          <div className="flex items-center justify-center gap-8 text-white/60">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>500+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span>95% Placement</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>4-8 Weeks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-20 -mt-16 relative z-10">
        <div className="container mx-auto px-4">
          {internships.length === 0 ? (
            <Card className="text-center p-12 max-w-lg mx-auto">
              <Image
                src="/assets/logo.png"
                alt="Gryffindors Logo"
                width={32}
                height={32}
                className="object-contain"
              />{" "}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Programs Available
              </h3>
              <p className="text-gray-500 mb-6">
                New internship batches will be announced soon. Stay tuned!
              </p>
              <Link
                href="/"
                className="text-[#841a1c] hover:underline font-medium"
              >
                ← Back to Home
              </Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {internships.map((internship) => {
                const Icon =
                  trackIcons[internship.track as keyof typeof trackIcons] ||
                  Code;
                const gradient =
                  trackColors[internship.track as keyof typeof trackColors] ||
                  "from-gray-500 to-gray-600";

                return (
                  <Card
                    key={internship.id}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white"
                  >
                    <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                    <CardHeader className="pb-4">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4`}
                      >
                        <Icon size={28} />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {internship.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 text-base mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {internship.duration}
                        </span>
                        <span className="font-semibold text-[#841a1c]">
                          ₹{internship.price.toLocaleString()}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Live project-based learning
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          1:1 Mentorship sessions
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Industry-recognized certificate
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Placement assistance
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t">
                      <Link
                        href={`/internships/${internship.id}/apply`}
                        className="w-full"
                      >
                        <Button className="w-full bg-[#841a1c] hover:bg-[#681416] group">
                          Apply Now
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/logo.png"
                alt="Gryffindors Logo"
                width={32}
                height={32}
                className="object-contain"
              />{" "}
              <span className="font-bold text-xl">Gryffindors</span>
            </div>
            <div className="flex items-center gap-6 text-gray-400">
              <Link
                href="/terms-and-conditions"
                className="hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="text-center text-gray-500 mt-8 pt-8 border-t border-gray-800">
            © 2024 Gryffindors. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
