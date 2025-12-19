"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Users,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Internship {
  id: string;
  title: string;
  track: string;
}

interface Mentor {
  id: string;
  name: string | null;
  email: string;
}

interface BulkResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function BulkEnrollmentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedInternship, setSelectedInternship] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<BulkResult | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);

  useEffect(() => {
    fetch("/api/internships")
      .then((res) => res.json())
      .then(setInternships);

    fetch("/api/admin/users?role=MENTOR")
      .then((res) => res.json())
      .then(setMentors);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());
        const rows = lines
          .slice(0, 6)
          .map((line) =>
            line.split(",").map((cell) => cell.trim().replace(/"/g, ""))
          );
        setPreview(rows);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedInternship) {
      toast.error("Please select a file and internship");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("internshipId", selectedInternship);
      if (selectedMentor) {
        formData.append("mentorId", selectedMentor);
      }

      const res = await fetch("/api/admin/bulk-enroll", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        toast.success(`Successfully enrolled ${data.success} students!`);
      } else {
        toast.error(data.error || "Failed to process file");
      }
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template =
      "email,name\nstudent1@example.com,John Doe\nstudent2@example.com,Jane Smith";
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk_enrollment_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bulk Enrollment</h1>
        <p className="text-gray-500 mt-1">
          Upload CSV to enroll multiple students at once
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Student List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Download Template */}
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download CSV Template
            </Button>

            {/* File Upload */}
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <label className="cursor-pointer">
                <span className="text-[#841a1c] font-medium hover:underline">
                  Click to upload
                </span>
                <span className="text-gray-500"> or drag and drop</span>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-400 mt-2">CSV file only</p>
              {file && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg text-green-700 text-sm">
                  ✓ {file.name} selected
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Internship Program *
                </label>
                <select
                  value={selectedInternship}
                  onChange={(e) => setSelectedInternship(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select Program</option>
                  {internships.map((int) => (
                    <option key={int.id} value={int.id}>
                      {int.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Assign Mentor (Optional)
                </label>
                <select
                  value={selectedMentor}
                  onChange={(e) => setSelectedMentor(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">No Mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name || mentor.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || !selectedInternship || uploading}
              className="w-full bg-[#841a1c] hover:bg-[#681416]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Enroll Students
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview & Results */}
        <div className="space-y-6">
          {/* CSV Preview */}
          {preview.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>CSV Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {preview[0]?.map((header, i) => (
                          <th key={i} className="p-2 text-left font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.slice(1).map((row, i) => (
                        <tr key={i} className="border-t">
                          {row.map((cell, j) => (
                            <td key={j} className="p-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Showing first 5 rows
                </p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {result.success}
                    </p>
                    <p className="text-sm text-green-700">Successful</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">
                      {result.failed}
                    </p>
                    <p className="text-sm text-red-700">Failed</p>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-700 font-medium mb-2">
                      <AlertCircle className="w-4 h-4" />
                      Errors
                    </div>
                    <ul className="text-sm text-yellow-600 space-y-1">
                      {result.errors.slice(0, 5).map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">CSV Format</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  • First row should be headers: <code>email,name</code>
                </li>
                <li>• Email is required, name is optional</li>
                <li>• Existing users will be enrolled directly</li>
                <li>• New users will receive a welcome email</li>
                <li>• Maximum 100 students per upload</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
