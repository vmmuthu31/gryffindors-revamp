import { auth } from "@/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CertificateWithApplication {
  id: string;
  uniqueCode: string;
  issuedAt: string;
  grade: string | null;
  application: {
    internship: {
      title: string;
    };
  };
}

async function getCertificates(
  userId: string
): Promise<CertificateWithApplication[]> {
  interface CertRow {
    id: string;
    unique_code: string;
    issued_at: string;
    grade: string | null;
    application_id: string;
  }
  interface AppRow {
    internship_id: string;
  }

  const { data, error } = await supabaseAdmin
    .from("Certificate")
    .select("id, unique_code, issued_at, grade, application_id")
    .eq("user_id", userId)
    .order("issued_at", { ascending: false });

  if (error) return [];

  const certificates = (data || []) as CertRow[];

  const result = await Promise.all(
    certificates.map(async (cert) => {
      const { data: appData } = await supabaseAdmin
        .from("Application")
        .select("internship_id")
        .eq("id", cert.application_id)
        .single();

      const application = appData as AppRow | null;

      let internship = { title: "" };
      if (application) {
        const { data: i } = await supabaseAdmin
          .from("Internship")
          .select("title")
          .eq("id", application.internship_id)
          .single();
        internship = (i as { title: string } | null) || { title: "" };
      }

      return {
        id: cert.id,
        uniqueCode: cert.unique_code,
        issuedAt: cert.issued_at,
        grade: cert.grade,
        application: { internship },
      };
    })
  );

  return result;
}

export default async function CertificatesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div className="p-8">Please log in to view certificates.</div>;
  }

  const certificates = await getCertificates(session.user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-500 mt-1">Your earned credentials</p>
      </div>

      {certificates.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Certificates Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Complete an internship program to earn your certificate.
            </p>
            <Link
              href="/student/courses"
              className="inline-block px-6 py-3 bg-[#841a1c] text-white rounded-lg hover:bg-[#681416]"
            >
              Continue Learning
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert: CertificateWithApplication) => (
            <Card key={cert.id} className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-[#841a1c] via-[#a52528] to-[#d79c64] flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-20 h-20 border border-white/30 rounded-full" />
                  <div className="absolute bottom-4 right-4 w-32 h-32 border border-white/20 rounded-full" />
                </div>
                <div className="text-center text-white z-10">
                  <Image
                    src="/assets/logo.png"
                    alt="Gryffindors Logo"
                    width={48}
                    height={48}
                    className="mx-auto mb-2"
                  />
                  <div className="text-lg font-bold">
                    Certificate of Completion
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {cert.application.internship.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Issued on {new Date(cert.issuedAt).toLocaleDateString()}
                </p>

                {cert.grade && (
                  <div className="inline-block px-3 py-1 bg-[#d79c64]/20 text-[#841a1c] rounded-full text-sm font-medium mb-4">
                    {cert.grade}
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
                  <span className="text-xs text-gray-500">Certificate ID:</span>
                  <code className="text-xs font-mono text-[#841a1c]">
                    {cert.uniqueCode}
                  </code>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/verify-certificate/${cert.uniqueCode}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Verify
                  </Link>
                  <Link
                    href={`/api/certificate/download/${cert.uniqueCode}`}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#841a1c] text-white rounded-lg hover:bg-[#681416] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
