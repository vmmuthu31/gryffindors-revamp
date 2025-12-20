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
  Award,
  CheckCircle,
  Clock,
  ExternalLink,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";

interface Certificate {
  id: string;
  uniqueCode: string;
  issuedAt: string;
  application: {
    id: string;
    user: { id: string; name: string | null; email: string };
    internship: { id: string; title: string; track: string };
  };
}

interface Application {
  id: string;
  status: string;
  user: { name: string | null; email: string };
  internship: { title: string };
}

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteCert, setDeleteCert] = useState<Certificate | null>(null);
  const [selectedAppId, setSelectedAppId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [certsRes, appsRes] = await Promise.all([
        fetch("/api/admin/certificates"),
        fetch("/api/admin/applications?status=ENROLLED"),
      ]);
      const certsData = await certsRes.json();
      const appsData = await appsRes.json();
      setCertificates(certsData);
      setApplications(
        appsData.filter((a: Application) => a.status === "ENROLLED")
      );
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedAppId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: selectedAppId }),
      });
      if (res.ok) {
        await fetchData();
        setShowCreateDialog(false);
        setSelectedAppId("");
      }
    } catch (error) {
      console.error("Failed to create:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCert) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/certificates/${deleteCert.id}`, {
        method: "DELETE",
      });
      await fetchData();
      setDeleteCert(null);
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

  const thisMonth = certificates.filter((c) => {
    const d = new Date(c.issuedAt);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const last7Days = certificates.filter((c) => {
    const d = new Date(c.issuedAt);
    const now = new Date();
    const diffDays = Math.ceil(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 7;
  }).length;

  const availableApps = applications.filter(
    (app) => !certificates.some((c) => c.application.id === app.id)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-500 mt-1">Issue and manage certificates</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-[#841a1c] hover:bg-[#681416]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Issue Certificate
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-[#841a1c]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Issued</p>
                <p className="text-3xl font-bold">{certificates.length}</p>
              </div>
              <Award className="w-8 h-8 text-[#841a1c]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-3xl font-bold">{thisMonth}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Last 7 Days</p>
                <p className="text-3xl font-bold">{last7Days}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Certificates</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">
                  Certificate ID
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Student
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Program
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Issued
                </th>
                <th className="text-left p-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded w-fit">
                      {cert.uniqueCode}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {cert.application.user.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {cert.application.user.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">
                      {cert.application.internship.title}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(cert.issuedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <a
                        href={`/verify-certificate/${cert.uniqueCode}`}
                        target="_blank"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="View"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => setDeleteCert(cert)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {certificates.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No certificates issued yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Certificate</DialogTitle>
            <DialogDescription>
              Select an enrolled student to issue a certificate
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {availableApps.length > 0 ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select Enrollment *
                </label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select student...</option>
                  {availableApps.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.user.name || app.user.email} - {app.internship.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No enrolled students without certificates found.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={saving || !selectedAppId}
              className="bg-[#841a1c] hover:bg-[#681416]"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Issue Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteCert} onOpenChange={() => setDeleteCert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Certificate</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke certificate{" "}
              <strong>{deleteCert?.uniqueCode}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCert(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={saving}
              variant="destructive"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
