"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  BookOpen,
  Award,
  Eye,
  GraduationCap,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Student {
  id: string;
  user: { id: string; name: string | null; email: string };
  internship: { id: string; title: string; track: string };
  status: string;
  createdAt: string;
  certificate: { id: string; uniqueCode: string } | null;
}

const statusColors: Record<string, string> = {
  ENROLLED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
};

export default function MentorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuingCert, setIssuingCert] = useState<string | null>(null);
  const [certDialog, setCertDialog] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/mentor/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCertificate = async () => {
    if (!certDialog) return;
    setIssuingCert(certDialog.id);
    try {
      const res = await fetch("/api/mentor/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: certDialog.id }),
      });
      if (res.ok) {
        toast.success("Certificate issued successfully!");
        await fetchStudents();
        setCertDialog(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to issue certificate");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIssuingCert(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#841a1c]" />
      </div>
    );
  }

  const enrolled = students.filter(
    (s) => s.status === "ENROLLED" || s.status === "IN_PROGRESS"
  );
  const completed = students.filter((s) => s.status === "COMPLETED");
  const withCerts = students.filter((s) => s.certificate);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
        <p className="text-gray-500 mt-1">Manage your assigned students</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#841a1c]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-3xl font-bold">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-[#841a1c]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-3xl font-bold">{enrolled.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-3xl font-bold">{completed.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Certified</p>
                <p className="text-3xl font-bold">{withCerts.length}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">
                  Student
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Program
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Joined
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#841a1c] to-[#d79c64] text-white flex items-center justify-center font-bold">
                        {(student.user.name ||
                          student.user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.user.name || "Unnamed"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">
                      {student.internship.title}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge
                      className={statusColors[student.status] || "bg-gray-100"}
                    >
                      {student.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={`/mentor/students/${student.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      {!student.certificate &&
                        (student.status === "COMPLETED" ||
                          student.status === "ENROLLED") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-600"
                            onClick={() => setCertDialog(student)}
                          >
                            <Award className="w-4 h-4" />
                          </Button>
                        )}
                      {student.certificate && (
                        <span className="flex items-center gap-1 text-green-600 text-xs">
                          <GraduationCap className="w-4 h-4" />
                          Certified
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {students.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No students assigned yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issue Certificate Dialog */}
      <Dialog open={!!certDialog} onOpenChange={() => setCertDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Certificate</DialogTitle>
            <DialogDescription>
              Issue a completion certificate to{" "}
              <strong>{certDialog?.user.name || certDialog?.user.email}</strong>{" "}
              for <strong>{certDialog?.internship.title}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCertDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleIssueCertificate}
              disabled={issuingCert === certDialog?.id}
              className="bg-[#841a1c] hover:bg-[#681416]"
            >
              {issuingCert === certDialog?.id && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Issue Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
