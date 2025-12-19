import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Users, BookOpen, Award, TrendingUp } from "lucide-react";

// Force dynamic rendering to avoid database access during build
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getStats() {
  const totalStudents = await prisma.user.count({
    where: { role: "STUDENT" },
  });

  const enrolledStudents = await prisma.application.count({
    where: { status: { in: ["ENROLLED", "IN_PROGRESS", "COMPLETED"] } },
  });

  const internships = await prisma.internship.findMany({
    include: {
      applications: {
        where: { paymentStatus: "SUCCESS" },
      },
    },
  });

  const revenue = internships.reduce(
    (acc: any, int: any) => acc + int.price * int.applications.length,
    0
  );

  const certificates = await prisma.certificate.count();

  const revenueByProgram = internships.map((int: any) => ({
    title: int.title,
    price: int.price,
    students: int.applications.length,
    revenue: int.price * int.applications.length,
  }));

  return {
    totalStudents,
    enrolledStudents,
    revenue,
    certificates,
    revenueByProgram,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[#841a1c] to-[#a52528] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Revenue</p>
                <p className="text-3xl font-bold">
                  ₹{stats.revenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalStudents}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Enrolled</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.enrolledStudents}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Certificates</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.certificates}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#841a1c]" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.revenueByProgram.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No programs yet
                </p>
              ) : (
                stats.revenueByProgram.map((program: any) => (
                  <div
                    key={program.title}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{program.title}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        ({program.students} students)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#841a1c] font-bold">
                        ₹{program.price.toLocaleString()}/student
                      </span>
                      <div className="text-sm text-gray-500">
                        Total: ₹{program.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/admin/courses"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Manage Courses</div>
              <div className="text-sm text-gray-500">
                Add, edit, or remove courses and lessons
              </div>
            </a>
            <a
              href="/admin/students"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">View Students</div>
              <div className="text-sm text-gray-500">
                See all enrolled students and their progress
              </div>
            </a>
            <a
              href="/admin/certificates"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Issue Certificates</div>
              <div className="text-sm text-gray-500">
                Generate certificates for completed students
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
