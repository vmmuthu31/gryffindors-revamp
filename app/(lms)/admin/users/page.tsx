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
  Users,
  UserCheck,
  Shield,
  GraduationCap,
  Trash2,
  Edit,
  Loader2,
  Plus,
} from "lucide-react";
import Image from "next/image";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "STUDENT" | "MENTOR" | "ADMIN";
  createdAt: string;
  applications: Array<{
    id: string;
    status: string;
    internship: { title: string };
  }>;
}

const roleColors = {
  STUDENT: "bg-blue-100 text-blue-700",
  MENTOR: "bg-purple-100 text-purple-700",
  ADMIN: "bg-red-100 text-red-700",
};

const roleIcons = {
  STUDENT: GraduationCap,
  MENTOR: UserCheck,
  ADMIN: Shield,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "STUDENT",
  });
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (user: User) => {
    setEditForm({ name: user.name || "", email: user.email, role: user.role });
    setEditUser(user);
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        await fetchUsers();
        setEditUser(null);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/users/${deleteUser.id}`, { method: "DELETE" });
      await fetchUsers();
      setDeleteUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!addForm.email || !addForm.password) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        await fetchUsers();
        setShowAddDialog(false);
        setAddForm({ name: "", email: "", password: "", role: "STUDENT" });
      }
    } catch (error) {
      console.error("Failed to add user:", error);
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    total: users.length,
    students: users.filter((u) => u.role === "STUDENT").length,
    mentors: users.filter((u) => u.role === "MENTOR").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#841a1c]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 mt-1">
            View and manage all platform users
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-[#841a1c] hover:bg-[#681416]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#841a1c]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-[#841a1c]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Students</p>
                <p className="text-3xl font-bold">{stats.students}</p>
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
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Mentors</p>
                <p className="text-3xl font-bold">{stats.mentors}</p>
              </div>
              <UserCheck className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Admins</p>
                <p className="text-3xl font-bold">{stats.admins}</p>
              </div>
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">
                  User
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Role
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Enrollments
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
              {users.map((user) => {
                const RoleIcon = roleIcons[user.role] || GraduationCap;
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#841a1c] to-[#d79c64] text-white flex items-center justify-center font-bold">
                          {(user.name || user.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name || "Unnamed"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={`${
                          roleColors[user.role]
                        } flex items-center gap-1 w-fit`}
                      >
                        <RoleIcon className="w-3 h-3" />
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {user.applications.length || "None"}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => setDeleteUser(user)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                placeholder="Email address"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="STUDENT">Student</option>
                <option value="MENTOR">Mentor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteUser?.name || deleteUser?.email}</strong>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>
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

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={addForm.name}
                onChange={(e) =>
                  setAddForm({ ...addForm, name: e.target.value })
                }
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                type="email"
                required
                value={addForm.email}
                onChange={(e) =>
                  setAddForm({ ...addForm, email: e.target.value })
                }
                placeholder="Email address"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password *</label>
              <Input
                type="password"
                required
                value={addForm.password}
                onChange={(e) =>
                  setAddForm({ ...addForm, password: e.target.value })
                }
                placeholder="Password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                value={addForm.role}
                onChange={(e) =>
                  setAddForm({ ...addForm, role: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="STUDENT">Student</option>
                <option value="MENTOR">Mentor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={saving || !addForm.email || !addForm.password}
              className="bg-[#841a1c] hover:bg-[#681416]"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
