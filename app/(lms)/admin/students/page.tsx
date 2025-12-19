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
import { Users, GraduationCap, UserPlus, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";

interface Student {
  id: string;
  user: { id: string; name: string | null; email: string };
  internship: { id: string; title: string };
  status: string;
  mentor: { id: string; name: string | null } | null;
  createdAt: string;
}

interface Mentor {
  id: string;
  name: string | null;
  email: string;
}

const statusColors: Record<string, string> = {
  ENROLLED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [assignDialog, setAssignDialog] = useState<Student | null>(null);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, mentorsRes] = await Promise.all([
        fetch("/api/admin/students"),
        fetch("/api/admin/users?role=MENTOR"),
      ]);
      const studentsData = await studentsRes.json();
      const mentorsData = await mentorsRes.json();
      setStudents(studentsData);
      setMentors(mentorsData);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignMentor = async () => {
    if (!assignDialog || !selectedMentor) return;
    setAssigning(true);
    try {
      const res = await fetch(
        `/api/admin/applications/${assignDialog.id}/assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mentorId: selectedMentor }),
        }
      );
      if (res.ok) {
        toast.success("Mentor assigned successfully!");
        await fetchData();
        setAssignDialog(null);
        setSelectedMentor("");
      } else {
        toast.error("Failed to assign mentor");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setAssigning(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.user.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.user.email.toLowerCase().includes(search.toLowerCase()) ||
      s.internship.title.toLowerCase().includes(search.toLowerCase())
  );

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
  const withMentor = students.filter((s) => s.mentor);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-500 mt-1">View and manage enrolled students</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Image
                src="/assets/logo.png"
                alt="Gryffindors Logo"
                width={32}
                height={32}
                className="object-contain"
              />{" "}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">With Mentor</p>
                <p className="text-3xl font-bold">{withMentor.length}</p>
              </div>
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Table */}
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
                  Mentor
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {student.user.name || "Unnamed"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {student.user.email}
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
                  <td className="p-4">
                    {student.mentor ? (
                      <span className="text-green-600 font-medium">
                        {student.mentor.name || "Assigned"}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAssignDialog(student);
                        setSelectedMentor(student.mentor?.id || "");
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      {student.mentor ? "Change" : "Assign"} Mentor
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No students found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Mentor Dialog */}
      <Dialog open={!!assignDialog} onOpenChange={() => setAssignDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Mentor</DialogTitle>
            <DialogDescription>
              Select a mentor for{" "}
              <strong>
                {assignDialog?.user.name || assignDialog?.user.email}
              </strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select mentor...</option>
              {mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name || mentor.email}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignMentor}
              disabled={assigning || !selectedMentor}
              className="bg-[#841a1c] hover:bg-[#681416]"
            >
              {assigning && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
