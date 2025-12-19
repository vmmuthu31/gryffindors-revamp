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
  Users,
  DollarSign,
  Clock,
  Plus,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Internship {
  id: string;
  title: string;
  description: string | null;
  track: string;
  price: number;
  duration: string;
  isActive: boolean;
  applications: Array<{ id: string; status: string }>;
  courses: Array<{ id: string; title: string }>;
}

const trackColors = {
  FULL_STACK: "bg-blue-100 text-blue-700",
  AI_ML: "bg-purple-100 text-purple-700",
  WEB3: "bg-orange-100 text-orange-700",
};

export default function AdminInternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editInternship, setEditInternship] = useState<Internship | null>(null);
  const [deleteInternship, setDeleteInternship] = useState<Internship | null>(
    null
  );

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    track: "FULL_STACK",
    price: 2499,
    duration: "4 weeks",
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await fetch("/api/admin/internships");
      const data = await res.json();
      setInternships(data);
    } catch (error) {
      console.error("Failed to fetch internships:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (internship: Internship) => {
    setForm({
      title: internship.title,
      description: internship.description || "",
      track: internship.track,
      price: internship.price,
      duration: internship.duration,
    });
    setEditInternship(internship);
  };

  const openAddDialog = () => {
    setForm({
      title: "",
      description: "",
      track: "FULL_STACK",
      price: 2499,
      duration: "4 weeks",
    });
    setShowAddDialog(true);
  };

  const handleCreate = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchInternships();
        setShowAddDialog(false);
      }
    } catch (error) {
      console.error("Failed to create:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editInternship) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/internships/${editInternship.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await fetchInternships();
        setEditInternship(null);
      }
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteInternship) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/internships/${deleteInternship.id}`, {
        method: "DELETE",
      });
      await fetchInternships();
      setDeleteInternship(null);
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

  const totalEnrollments = internships.reduce(
    (acc, i) =>
      acc + i.applications.filter((a) => a.status === "ENROLLED").length,
    0
  );

  const InternshipForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title *</label>
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g., Full Stack Development Internship"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe the internship..."
          className="w-full px-3 py-2 border rounded-lg resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Track *</label>
          <select
            value={form.track}
            onChange={(e) => setForm({ ...form, track: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="FULL_STACK">Full Stack</option>
            <option value="AI_ML">AI / ML</option>
            <option value="WEB3">Web3</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Duration *</label>
          <select
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="2 weeks">2 Weeks</option>
            <option value="4 weeks">4 Weeks</option>
            <option value="6 weeks">6 Weeks</option>
            <option value="8 weeks">8 Weeks</option>
            <option value="12 weeks">12 Weeks</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Price (₹) *</label>
        <Input
          type="number"
          min="0"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: parseInt(e.target.value) || 0 })
          }
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Internships
          </h1>
          <p className="text-gray-500 mt-1">
            Create and manage internship programs
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-[#841a1c] hover:bg-[#681416]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Internship
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#841a1c]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Programs</p>
                <p className="text-3xl font-bold">{internships.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-[#841a1c]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Enrollments</p>
                <p className="text-3xl font-bold">{totalEnrollments}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Applications</p>
                <p className="text-3xl font-bold">
                  {internships.reduce(
                    (acc, i) => acc + i.applications.length,
                    0
                  )}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-3xl font-bold">
                  ₹
                  {internships
                    .reduce(
                      (acc, i) =>
                        acc +
                        i.price *
                          i.applications.filter((a) => a.status === "ENROLLED")
                            .length,
                      0
                    )
                    .toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Internships List */}
      <Card>
        <CardHeader>
          <CardTitle>All Internship Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {internships.map((internship) => (
              <div
                key={internship.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#841a1c] to-[#d79c64] rounded-lg flex items-center justify-center text-white font-bold">
                    {internship.title[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {internship.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <Badge
                        className={
                          trackColors[
                            internship.track as keyof typeof trackColors
                          ]
                        }
                      >
                        {internship.track.replace("_", " ")}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {internship.duration}
                      </span>
                      <span>₹{internship.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <div className="text-gray-500">Enrollments</div>
                    <div className="font-semibold">
                      {
                        internship.applications.filter(
                          (a) => a.status === "ENROLLED"
                        ).length
                      }
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(internship)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => setDeleteInternship(internship)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {internships.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No internship programs yet.</p>
                <button
                  onClick={openAddDialog}
                  className="text-[#841a1c] hover:underline"
                >
                  Create your first internship
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Internship</DialogTitle>
            <DialogDescription>Add a new internship program</DialogDescription>
          </DialogHeader>
          <InternshipForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={saving || !form.title}
              className="bg-[#841a1c] hover:bg-[#681416]"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editInternship}
        onOpenChange={() => setEditInternship(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Internship</DialogTitle>
            <DialogDescription>Update internship details</DialogDescription>
          </DialogHeader>
          <InternshipForm isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditInternship(null)}>
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
      <Dialog
        open={!!deleteInternship}
        onOpenChange={() => setDeleteInternship(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Internship</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteInternship?.title}</strong>? This will also delete
              all associated courses and applications.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteInternship(null)}>
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
