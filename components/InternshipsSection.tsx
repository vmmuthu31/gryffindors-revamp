"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Users, Sparkles, ArrowRight } from "lucide-react";

interface Internship {
  id: string;
  title: string;
  track: string;
  price: number;
  duration: string;
  description: string;
}

const trackColors: Record<string, { bg: string; text: string; badge: string }> =
  {
    FULL_STACK: {
      bg: "from-blue-500 to-indigo-600",
      text: "text-blue-600",
      badge: "Best Seller",
    },
    AI_ML: {
      bg: "from-purple-500 to-pink-600",
      text: "text-purple-600",
      badge: "Trending",
    },
    WEB3: {
      bg: "from-amber-500 to-orange-600",
      text: "text-amber-600",
      badge: "High Pay Niche",
    },
  };

export default function InternshipsSection() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInternships() {
      try {
        const res = await fetch("/api/internships");
        if (res.ok) {
          const data = await res.json();
          setInternships(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch internships:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInternships();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-[#fbf2f1]">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4" />
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#fbf2f1]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-[#841a1c]/10 text-[#841a1c] rounded-full text-sm font-medium mb-4">
            Launch Your Tech Career
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Industry-Ready{" "}
            <span className="text-[#841a1c]">Internship Programs</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn from industry experts, build real projects, and get certified.
            100% refundable within 7 days.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {internships.map((internship, index) => {
            const colors =
              trackColors[internship.track] || trackColors.FULL_STACK;

            return (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                  <div
                    className={`h-32 bg-gradient-to-r ${colors.bg} p-6 flex items-end`}
                  >
                    <div>
                      <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full mb-2">
                        {colors.badge}
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        {internship.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {internship.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {internship.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        1:1 Mentorship
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        Certificate
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-gray-900">
                          ₹{internship.price.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          one-time
                        </span>
                      </div>
                      <Link
                        href={`/internships/${internship.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-[#841a1c] text-white rounded-lg hover:bg-[#681416] transition-colors group-hover:gap-3"
                      >
                        View Program
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/internships"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#841a1c] text-[#841a1c] rounded-full font-semibold hover:bg-[#841a1c] hover:text-white transition-colors"
          >
            View All Programs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
