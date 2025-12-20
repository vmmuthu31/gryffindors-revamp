import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle,
  PlayCircle,
  FileText,
  Award,
  Users,
  Code,
  Sparkles,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { getInternship } from "@/actions/internship";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InternshipDetailsPage({ params }: Props) {
  const { id } = await params;
  const internship = await getInternship(id);

  if (!internship) {
    notFound();
  }

  const applicationSteps = [
    {
      title: "Eligibility Check",
      desc: "Quick MCQ to assess your current skill level and readiness.",
      icon: FileText,
    },
    {
      title: "AI Interview",
      desc: "Demonstrate your problem-solving skills with our AI interviewer.",
      icon: Users,
    },
    {
      title: "Selection & Payment",
      desc: "Get selected and secure your seat with easy payment options.",
      icon: CheckCircle,
    },
    {
      title: "Onboarding",
      desc: "Access your personalized dashboard and start your journey.",
      icon: PlayCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20 pt-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link
          href="/internships"
          className="inline-flex items-center text-gray-500 hover:text-[#841a1c] mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Programs
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-4">
              {internship.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-gradient-to-r from-[#841a1c] to-[#a52528] text-white border-none px-3 py-1"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {internship.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {internship.description}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl font-semibold">
                <PlayCircle size={18} />
                {internship.duration}
              </div>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-xl font-semibold">
                <Award size={18} />
                Certificate Included
              </div>
              <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2.5 rounded-xl font-semibold">
                <Briefcase size={18} />
                Placement Support
              </div>
            </div>
          </div>

          <Card className="border-2 border-[#841a1c]/20 shadow-xl bg-white sticky top-24">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-[#841a1c] mb-1">
                  ₹{internship.price.toLocaleString()}
                </div>
                <p className="text-gray-500 text-sm">One-time payment</p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  "Interactive AI-powered Interview",
                  "8 Weeks Structured Learning",
                  "Real-world Project Experience",
                  "Code Reviews by Industry Experts",
                  "Career Guidance & Mentorship",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start text-sm">
                    <CheckCircle
                      size={16}
                      className="text-green-600 mr-2.5 mt-0.5 shrink-0"
                    />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={`/internships/${internship.id}/apply`}>
                <Button className="w-full bg-gradient-to-r from-[#841a1c] to-[#a52528] hover:from-[#681416] hover:to-[#841a1c] py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  Apply Now
                </Button>
              </Link>

              <p className="text-xs text-center text-gray-400 mt-4">
                Limited seats available • 7-day refund policy
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#841a1c]/10 flex items-center justify-center">
                  <Code className="w-5 h-5 text-[#841a1c]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Skills You Will Master
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {internship.skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-[#841a1c]/30 hover:shadow-sm transition-all"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#841a1c] to-[#d79c64]" />
                    <span className="font-medium text-gray-800">{skill}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#841a1c]/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#841a1c]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Application Process
                </h2>
              </div>
              <div className="relative">
                <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#841a1c] to-[#d79c64]" />
                <div className="space-y-6">
                  {applicationSteps.map((step, i) => (
                    <div key={i} className="relative flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#841a1c] to-[#a52528] text-white text-sm flex items-center justify-center font-bold shadow-lg z-10">
                        {i + 1}
                      </div>
                      <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 hover:border-[#841a1c]/20 hover:shadow-sm transition-all">
                        <h3 className="font-bold text-gray-900 mb-1">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#841a1c]" />
                  Target Roles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {internship.roles.map((role) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className="px-3 py-1.5 text-sm border-gray-200 hover:border-[#841a1c]/30 transition-colors"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Refund Policy
                </h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  We offer a 7-day no-questions-asked refund policy if the
                  curriculum doesn&apos;t match your expectations. Your
                  satisfaction is our priority.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Community Support
                </h3>
                <p className="text-sm text-green-700 leading-relaxed">
                  Join our exclusive Discord community with 500+ learners.
                  Network, collaborate, and grow together.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
