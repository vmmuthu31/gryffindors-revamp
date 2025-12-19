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
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Layers,
  FileText,
  Loader2,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  order: number;
  internship: {
    id: string;
    title: string;
    track: string;
  };
  modules: Array<{
    id: string;
    lessons: Array<{ id: string }>;
  }>;
}

interface Internship {
  id: string;
  title: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);

  const [form, setForm] = useState({
    internshipId: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, internshipsRes] = await Promise.all([
        fetch("/api/admin/courses"),
        fetch("/api/admin/internships"),
      ]);
      const coursesData = await coursesRes.json();
      const internshipsData = await internshipsRes.json();
      setCourses(coursesData);
      setInternships(internshipsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    setForm({ internshipId: "", title: "", description: "" });
    setShowAddDialog(true);
  };

  const openEditDialog = (course: Course) => {
    setForm({
      internshipId: course.internship.id,
      title: course.title,
      description: course.description || "",
    });
    setEditCourse(course);
  };

  const handleCreate = async () => {
    if (!form.internshipId || !form.title) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchData();
        setShowAddDialog(false);
      }
    } catch (error) {
      console.error("Failed to create:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editCourse) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/courses/${editCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
        }),
      });
      if (res.ok) {
        await fetchData();
        setEditCourse(null);
      }
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCourse) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/courses/${deleteCourse.id}`, {
        method: "DELETE",
      });
      await fetchData();
      setDeleteCourse(null);
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#841a1c]" />
      </div>
    );
  }

  const totalModules = courses.reduce((acc, c) => acc + c.modules.length, 0);
  const totalLessons = courses.reduce(
    (acc, c) => acc + c.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0),
    0
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <p className="text-gray-500 mt-1">Create and manage course content</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-[#841a1c] hover:bg-[#681416]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-[#841a1c]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Courses</p>
                <p className="text-3xl font-bold">{courses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-[#841a1c]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Modules</p>
                <p className="text-3xl font-bold">{totalModules}</p>
              </div>
              <Layers className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Lessons</p>
                <p className="text-3xl font-bold">{totalLessons}</p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#841a1c] to-[#d79c64] rounded-lg flex items-center justify-center text-white font-bold">
                    {course.order}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {course.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="secondary">
                        {course.internship.title}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {course.modules.length} modules •{" "}
                        {course.modules.reduce(
                          (acc, m) => acc + m.lessons.length,
                          0
                        )}{" "}
                        lessons
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(course)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => setDeleteCourse(course)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {courses.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No courses yet.</p>
                <button
                  onClick={openAddDialog}
                  className="text-[#841a1c] hover:underline"
                >
                  Create your first course
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Course</DialogTitle>
            <DialogDescription>
              Add a new course to an internship
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Internship *</label>
              <select
                value={form.internshipId}
                onChange={(e) =>
                  setForm({ ...form, internshipId: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select internship...</option>
                {internships.map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Course Title *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., React Fundamentals"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Course description..."
                className="w-full px-3 py-2 border rounded-lg resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={saving || !form.internshipId || !form.title}
              className="bg-[#841a1c] hover:bg-[#681416]"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editCourse} onOpenChange={() => setEditCourse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update course details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course Title *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCourse(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={saving}
              className="bg-[#841a1c] hover:bg-[#681416]"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteCourse} onOpenChange={() => setDeleteCourse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteCourse?.title}</strong>? This will also delete all
              modules and lessons.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCourse(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={saving}
              variant="destructive"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
