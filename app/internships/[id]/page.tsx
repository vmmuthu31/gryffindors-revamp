"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import { INTERNSHIP_TRACKS } from "@/lib/mock-data/internships";

const InternshipDetailsPage = () => {
  const params = useParams();
  const internshipId = params.id as string;

  const internship = INTERNSHIP_TRACKS.find((t) => t.id === internshipId);

  if (!internship) {
    // In a real app this would be handled better or let Next.js catch it
    return <div className="p-20 text-center">Internship not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-24 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Breadcrumb / Back */}
        <Link
          href="/internships"
          className="inline-flex items-center text-gray-500 hover:text-[#841a1c] mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Programs
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="flex-1">
            <div className="flex gap-2 mb-4">
              {internship.tags.map((tag) => (
                <Badge key={tag} className="bg-[#841a1c] hover:bg-[#681416]">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-thunder font-bold text-[#841a1c] mb-4">
              {internship.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {internship.description}
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="bg-[#d79c64]/10 text-black px-4 py-2 rounded-lg font-semibold flex items-center">
                <PlayCircle size={18} className="mr-2 text-[#d79c64]" />
                {internship.duration}
              </div>
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold flex items-center">
                <Award size={18} className="mr-2" />
                Certificate Included
              </div>
              <div className="text-2xl font-bold ml-auto text-[#841a1c]">
                ₹{internship.price.toLocaleString()}
              </div>
            </div>
          </div>

          <Card className="w-full md:w-80 border-[#841a1c] border-2 shadow-xl">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Program Overview</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start text-sm">
                  <CheckCircle
                    size={16}
                    className="text-green-600 mr-2 mt-0.5 shrink-0"
                  />
                  <span>Interactive AI Interview</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle
                    size={16}
                    className="text-green-600 mr-2 mt-0.5 shrink-0"
                  />
                  <span>8 Weeks Structured Learning</span>
                </li>
                <li className="flex items-start text-sm">
                  <CheckCircle
                    size={16}
                    className="text-green-600 mr-2 mt-0.5 shrink-0"
                  />
                  <span>Code Reviews on GitHub</span>
                </li>
              </ul>
              <Button className="w-full bg-[#841a1c] hover:bg-[#681416] py-6 text-lg">
                Apply Now
              </Button>
              <p className="text-xs text-center text-gray-400 mt-3">
                Limited seats per batch
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            {/* What you'll learn */}
            <section>
              <h2 className="text-3xl font-thunder font-bold mb-6">
                WHAT YOU&apos;LL <span className="text-[#d79c64]">MASTER</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {internship.skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center p-3 bg-white border rounded-lg"
                  >
                    <Code size={20} className="text-[#841a1c] mr-3" />
                    <span className="font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Application Process */}
            <section>
              <h2 className="text-3xl font-thunder font-bold mb-8">
                APPLICATION <span className="text-[#d79c64]">PROCESS</span>
              </h2>
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-10 pl-8 py-2">
                {[
                  {
                    title: "Eligibility Check",
                    desc: "Quick MCQ to check your basics.",
                    icon: FileText,
                  },
                  {
                    title: "AI Interview",
                    desc: "Chat with our AI CTO to prove your skills.",
                    icon: Users,
                  },
                  {
                    title: "Selection & Payment",
                    desc: "Get selected and secure your spot.",
                    icon: CheckCircle,
                  },
                  {
                    title: "Onboarding",
                    desc: "Access the dashboard and start coding.",
                    icon: PlayCircle,
                  },
                ].map((step, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-[#841a1c] text-white text-xs flex items-center justify-center border-4 border-white">
                      {i + 1}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Roles */}
          <div>
            <h3 className="font-bold text-xl mb-4">Target Roles</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {internship.roles.map((role) => (
                <Badge key={role} variant="outline" className="px-3 py-1">
                  {role}
                </Badge>
              ))}
            </div>

            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2">Refund Policy</h3>
              <p className="text-sm text-blue-600">
                We offer a 7-day no-questions-asked refund policy if you find
                the curriculum doesn&apos;t match your expectations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailsPage;
