import Link from "next/link";
import {
  ArrowRight,
  Code,
  Cpu,
  Database,
  Clock,
  Users,
  Trophy,
  Star,
  Sparkles,
  CheckCircle,
  GraduationCap,
  Briefcase,
  Award,
} from "lucide-react";

export const dynamic = "force-dynamic";
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
  FULL_STACK: {
    gradient: "from-blue-600 to-indigo-700",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  AI_ML: {
    gradient: "from-purple-600 to-pink-600",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  WEB3: {
    gradient: "from-orange-500 to-red-600",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
};

const features = [
  {
    icon: GraduationCap,
    title: "Industry-Ready Curriculum",
    description: "Learn the exact skills employers are hiring for in 2025",
  },
  {
    icon: Briefcase,
    title: "Real Project Experience",
    description: "Build production-grade projects for your portfolio",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "1-on-1 guidance from industry professionals",
  },
  {
    icon: Award,
    title: "Verified Certificate",
    description: "Get recognized credentials to boost your career",
  },
];

export default async function InternshipsPage() {
  const internships = await getInternships();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/assets/logo.png"
              alt="Gryffindors Logo"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="font-bold text-xl text-gray-900">Gryffindors</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Home
            </Link>
            <Link href="/internships" className="text-[#841a1c] font-semibold">
              Internships
            </Link>
            <Link
              href="/auth/login"
              className="px-5 py-2.5 bg-gradient-to-r from-[#841a1c] to-[#a52528] text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#841a1c] via-[#6d1517] to-[#4a0e10]" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#d79c64]/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/10 hover:bg-white/20 text-white mb-8 px-5 py-2.5 text-sm backdrop-blur-sm border-none inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              2026 Batch Registrations Open
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              Launch Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#d79c64] to-[#e8b98a]">
                Tech Career
              </span>
            </h1>

            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
              Master in-demand skills, build real projects, and get placed at
              top companies with our intensive internship programs.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 text-white/70">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                <Users className="w-5 h-5 text-[#d79c64]" />
                <span className="font-semibold">500+ Alumni</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                <Trophy className="w-5 h-5 text-[#d79c64]" />
                <span className="font-semibold">95% Placement</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                <Star className="w-5 h-5 text-[#d79c64]" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 -mt-20 relative z-10">
        <div className="container mx-auto px-4">
          {internships.length === 0 ? (
            <Card className="text-center p-16 max-w-lg mx-auto shadow-xl border-0">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Coming Soon
              </h3>
              <p className="text-gray-500 mb-8">
                New internship batches will be announced soon. Join our waitlist
                to get notified!
              </p>
              <Link
                href="/"
                className="text-[#841a1c] hover:underline font-semibold"
              >
                ← Back to Home
              </Link>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {internships.map((internship) => {
                const Icon =
                  trackIcons[internship.track as keyof typeof trackIcons] ||
                  Code;
                const colors =
                  trackColors[internship.track as keyof typeof trackColors] ||
                  trackColors.FULL_STACK;

                return (
                  <Card
                    key={internship.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white border-0 shadow-lg"
                  >
                    <div
                      className={`h-3 bg-gradient-to-r ${colors.gradient}`}
                    />

                    <CardHeader className="pb-4 pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon size={28} />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-3xl font-bold text-gray-900">
                            ₹{internship.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            one-time
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-3">
                        {internship.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            className={`${colors.bg} ${colors.text} border-none text-xs font-medium`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-[#841a1c] transition-colors">
                        {internship.title}
                      </CardTitle>

                      <CardDescription className="flex items-center gap-4 text-base mt-3">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <Clock className="w-4 h-4" />
                          {internship.duration}
                        </span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {internship.description}
                      </p>

                      <div className="space-y-2.5">
                        {[
                          "Live project-based learning",
                          "1:1 Expert mentorship",
                          "Industry certificate",
                          "Placement assistance",
                        ].map((feature, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 text-gray-600"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0 pb-6 px-6">
                      <Link
                        href={`/internships/${internship.id}`}
                        className="w-full"
                      >
                        <Button
                          className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 group/btn py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all`}
                        >
                          View Program
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
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

      <section className="py-20 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-[#841a1c]/10 text-[#841a1c] border-none mb-4 px-4 py-1.5">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Path to Success
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to transform from a beginner to a
              job-ready professional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const FeatureIcon = feature.icon;
              return (
                <Card
                  key={i}
                  className="text-center p-6 border-0 shadow-sm hover:shadow-lg transition-all bg-white"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#841a1c]/10 to-[#d79c64]/10 flex items-center justify-center mx-auto mb-4">
                    <FeatureIcon className="w-7 h-7 text-[#841a1c]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-[#841a1c] to-[#5a1213] border-0 overflow-hidden relative">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
            </div>
            <CardContent className="p-12 md:p-16 text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
                Join thousands of students who have transformed their careers
                with Gryffindors. Limited seats available for the upcoming
                batch.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="#programs">
                  <Button
                    size="lg"
                    className="bg-white text-[#841a1c] hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl"
                  >
                    Explore Programs
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
                  >
                    Talk to Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/logo.png"
                alt="Gryffindors Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="font-bold text-2xl">Gryffindors</span>
            </div>
            <div className="flex items-center gap-8 text-gray-400">
              <Link
                href="/terms-and-conditions"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="text-center text-gray-500 pt-8 border-t border-gray-800">
            © 2024 Gryffindors. Empowering the next generation of tech leaders.
          </div>
        </div>
      </footer>
    </div>
  );
}
