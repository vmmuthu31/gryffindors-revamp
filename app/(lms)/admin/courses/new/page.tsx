"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Internship {
  id: string;
  title: string;
}

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [formData, setFormData] = useState({
    internshipId: "",
    title: "",
    description: "",
    order: 1,
  });

  useEffect(() => {
    fetch("/api/internships")
      .then((res) => res.json())
      .then((data) => setInternships(data || []))
      .catch(() => setInternships([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/courses");
      } else {
        alert("Failed to create course");
        setLoading(false);
      }
    } catch {
      alert("Failed to create course");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Course</h1>
          <p className="text-gray-500 mt-1">
            Add a new course to an internship
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Internship
              </label>
              <select
                required
                value={formData.internshipId}
                onChange={(e) =>
                  setFormData({ ...formData, internshipId: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none"
              >
                <option value="">Select an internship...</option>
                {internships.map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Course Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g., React Fundamentals"
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
                placeholder="Course description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Order</label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#841a1c] focus:border-transparent outline-none"
              />
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
                  "Create Course"
                )}
              </Button>
              <Link
                href="/admin/courses"
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
