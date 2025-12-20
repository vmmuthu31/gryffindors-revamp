import { supabaseAdmin } from "@/lib/supabase/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Linkedin, Globe, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AlumniCert {
  id: string;
  application: {
    internship: {
      title: string;
      track: string;
    };
  };
}

interface Alumni {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  currentJob: string | null;
  company: string | null;
  linkedIn: string | null;
  portfolio: string | null;
  certificates: AlumniCert[];
}

async function getAlumni(): Promise<Alumni[]> {
  try {
    interface UserRow {
      id: string;
      name: string | null;
      email: string;
      bio: string | null;
      currentJob: string | null;
      company: string | null;
      linkedIn: string | null;
      portfolio: string | null;
    }
    interface CertRow {
      id: string;
      applicationId: string;
    }
    interface AppRow {
      internshipId: string;
    }

    const { data, error } = await supabaseAdmin
      .from("User")
      .select(
        "id, name, email, bio, currentJob, company, linkedIn, portfolio"
      )
      .eq("isAlumni", true)
      .order("createdAt", { ascending: false })
      .limit(50);

    if (error) throw error;

    const users = (data || []) as UserRow[];

    const alumni = await Promise.all(
      users.map(async (user) => {
        const { data: certData } = await supabaseAdmin
          .from("Certificate")
          .select("id, applicationId")
          .eq("userId", user.id);

        const certificates = (certData || []) as CertRow[];

        const certsWithRelations = await Promise.all(
          certificates.map(async (cert) => {
            const { data: appData } = await supabaseAdmin
              .from("Application")
              .select("internshipId")
              .eq("id", cert.applicationId)
              .single();

            const application = appData as AppRow | null;

            let internship = { title: "", track: "" };
            if (application) {
              const { data: i } = await supabaseAdmin
                .from("Internship")
                .select("title, track")
                .eq("id", application.internshipId)
                .single();
              internship = (i as { title: string; track: string } | null) || {
                title: "",
                track: "",
              };
            }

            return {
              id: cert.id,
              application: { internship },
            };
          })
        );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          currentJob: user.currentJob,
          company: user.company,
          linkedIn: user.linkedIn,
          portfolio: user.portfolio,
          certificates: certsWithRelations,
        };
      })
    );

    return alumni;
  } catch (error) {
    console.error("Failed to fetch alumni:", error);
    return [];
  }
}

const trackColors: Record<string, string> = {
  FULL_STACK: "bg-blue-100 text-blue-700",
  AI_ML: "bg-purple-100 text-purple-700",
  WEB3: "bg-orange-100 text-orange-700",
};

export default async function AlumniPage() {
  const alumni = await getAlumni();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#841a1c] to-[#a52528] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image src="/assets/logo.png" alt="Logo" width={48} height={48} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Our Alumni Network</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Meet the talented individuals who have completed our internship
            programs and are now building amazing things in tech.
          </p>
          <div className="mt-8 flex items-center justify-center gap-8">
            <div>
              <p className="text-4xl font-bold">{alumni.length}+</p>
              <p className="text-white/60">Graduates</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div>
              <p className="text-4xl font-bold">3</p>
              <p className="text-white/60">Tracks</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div>
              <p className="text-4xl font-bold">100%</p>
              <p className="text-white/60">Certified</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {alumni.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Coming Soon!
            </h3>
            <p className="text-gray-500">
              Our first batch of alumni will be featured here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumni.map((alum) => (
              <Card
                key={alum.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#841a1c] to-[#d79c64] text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {(alum.name || alum.email)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 truncate">
                        {alum.name || "Anonymous"}
                      </h3>
                      {alum.currentJob && (
                        <p className="text-gray-600 flex items-center gap-1 text-sm">
                          <Briefcase className="w-3 h-3" />
                          {alum.currentJob}
                          {alum.company && ` at ${alum.company}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {alum.bio && (
                    <p className="text-gray-500 text-sm mt-4 line-clamp-2">
                      {alum.bio}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {alum.certificates.map((cert) => (
                      <Badge
                        key={cert.id}
                        className={
                          trackColors[cert.application.internship.track] ||
                          "bg-gray-100"
                        }
                      >
                        {cert.application.internship.title}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-3">
                    {alum.linkedIn && (
                      <a
                        href={alum.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {alum.portfolio && (
                      <a
                        href={alum.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#841a1c] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Start your journey with our internship programs and become part of
            our growing alumni network.
          </p>
          <Link
            href="/internships"
            className="inline-block px-8 py-4 bg-white text-[#841a1c] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Explore Programs
          </Link>
        </div>
      </div>
    </div>
  );
}
