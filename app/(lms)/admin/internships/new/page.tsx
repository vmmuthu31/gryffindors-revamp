"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewInternshipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    track: "FULL_STACK" as "FULL_STACK" | "AI_ML" | "WEB3",
    price: 2499,
    duration: "4 weeks",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/internships");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create internship");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/internships"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Internship
          </h1>
          <p className="text-gray-500 mt-1">Add a new internship program</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Internship Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Full Stack Development Internship"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe the internship program..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Track *
              </label>
              <select
                value={formData.track}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    track: e.target.value as "FULL_STACK" | "AI_ML" | "WEB3",
                  })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none"
              >
                <option value="FULL_STACK">Full Stack Development</option>
                <option value="AI_ML">AI / Machine Learning</option>
                <option value="WEB3">Web3 / Blockchain</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Duration *
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none"
                >
                  <option value="2 weeks">2 Weeks</option>
                  <option value="4 weeks">4 Weeks</option>
                  <option value="6 weeks">6 Weeks</option>
                  <option value="8 weeks">8 Weeks</option>
                  <option value="12 weeks">12 Weeks</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#841a1c] hover:bg-[#681416] px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Internship"
                )}
              </Button>
              <Link
                href="/admin/internships"
                className="px-8 py-2 border rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
