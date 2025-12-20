import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Download,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Force dynamic rendering to avoid database access during build
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CertificateWithRelations {
  id: string;
  uniqueCode: string;
  grade: string | null;
  issuedAt: Date;
  user: { name: string | null; email: string };
  application: {
    internship: { title: string; track: string };
  };
}

async function getCertificate(
  code: string
): Promise<CertificateWithRelations | null> {
  const certificate = await prisma.certificate.findUnique({
    where: { uniqueCode: code },
    include: {
      user: {
        select: { name: true, email: true },
      },
      application: {
        include: {
          internship: {
            select: { title: true, track: true },
          },
        },
      },
    },
  });

  return certificate;
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const certificate = await getCertificate(code);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#841a1c]/10 text-[#841a1c] rounded-full mb-4">
            <Image
              src="/assets/logo.png"
              alt="Gryffindors Logo"
              width={32}
              height={32}
              className="object-contain"
            />{" "}
            <span className="font-medium">
              Gryffindors Certificate Verification
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Certificate Verification
          </h1>
        </div>

        {certificate ? (
          <Card className="overflow-hidden">
            {/* Valid Badge */}
            <div className="bg-green-500 text-white p-4 flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <span className="font-bold text-lg">VERIFIED & AUTHENTIC</span>
            </div>

            {/* Certificate Preview */}
            <div
              className="p-8 bg-gradient-to-br from-[#841a1c] to-[#a52528] text-white text-center"
              id="certificate-preview"
            >
              <Award className="w-16 h-16 mx-auto mb-4 text-[#d79c64]" />
              <h2 className="text-2xl font-bold mb-2">
                Certificate of Completion
              </h2>
              <p className="text-white/80">This certifies that</p>
              <p className="text-3xl font-bold my-4">
                {certificate.user.name || "Student"}
              </p>
              <p className="text-white/80">has successfully completed</p>
              <p className="text-xl font-semibold mt-2">
                {certificate.application.internship.title}
              </p>
              <p className="text-white/60 mt-4 text-sm">
                Issued on{" "}
                {new Date(certificate.issuedAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <User className="w-4 h-4" />
                    Recipient
                  </div>
                  <div className="font-medium">
                    {certificate.user.name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {certificate.user.email}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Issued On
                  </div>
                  <div className="font-medium">
                    {new Date(certificate.issuedAt).toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Certificate ID</div>
                <code className="text-lg font-mono text-[#841a1c]">
                  {certificate.uniqueCode}
                </code>
              </div>

              {certificate.grade && (
                <div className="p-4 bg-[#d79c64]/10 rounded-lg text-center">
                  <div className="text-sm text-gray-500 mb-1">
                    Grade Achieved
                  </div>
                  <div className="text-2xl font-bold text-[#841a1c]">
                    {certificate.grade}
                  </div>
                </div>
              )}

              {/* Download Button */}
              <Link
                href={`/api/certificate/download/${certificate.uniqueCode}`}
                className="flex items-center justify-center gap-2 w-full bg-[#841a1c] hover:bg-[#681416] text-white py-3 rounded-lg transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                Download Certificate
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="bg-red-500 text-white p-4 flex items-center justify-center gap-2">
              <XCircle className="w-6 h-6" />
              <span className="font-bold text-lg">CERTIFICATE NOT FOUND</span>
            </div>
            <CardContent className="p-8 text-center">
              <XCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Invalid Certificate
              </h2>
              <p className="text-gray-500">
                The certificate code{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">{code}</code>{" "}
                does not exist in our records.
              </p>
              <p className="text-gray-400 text-sm mt-4">
                If you believe this is an error, please contact support.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Verified by Gryffindors LMS</p>
          <p>https://www.gryffindors.in</p>
        </div>
      </div>
    </div>
  );
}
