import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const teamMembers = [
  {
    id: 1,
    name: "Vairamuthu M",
    role: "Full Stack Developer",
    bio: "A Web3 full-stack developer and open-source contributor with a passion for blockchain innovation. GSoC '22 alum, hackathon winner, and mentor, currently building at Polkassembly.",
    image: "/assets/team/vm.png",
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 2,
    name: "D Prashant",
    role: "Product Designer",
    bio: "A product designer shaping Web3 experiences. Contributor at Starknet Foundation and part of The Phoenix Guild Chennai, previously at SecureDApp, bringing intuitive design to blockchain products.",
    image: "/assets/team/prashant.png",
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 3,
    name: "Thirumurugan S",
    role: "Blockchain Developer",
    bio: "Web3 hackathon champion with 20+ wins, Tech Lead at The Phoenix Guild Chennai, and Starknet contributor. Currently building StarkShoot and developing at Winks.fun, pushing the boundaries of blockchain gaming.",
    image: "/assets/team/thiru.png",
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    id: 4,
    name: "Nagipragalathan T",
    role: "Blockchain Developer",
    bio: "Web3 hackathon champion with 20+ wins, Tech Lead at The Phoenix Guild Chennai, and Starknet contributor. Currently building StarkShoot and developing at Winks.fun, pushing the boundaries of blockchain gaming.",
    image: "/assets/team/nagipragalathan.png",
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
];

const TeamSection = () => {
  return (
    <section className="py-16 bg-muted/30" id="team">
      <div className="container">
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-primary text-center">
            THE TEAM
          </h2>
          <p className="text-center text-lg text-foreground/80 max-w-3xl mx-auto mt-4">
            What started with a group of passionate Web3 builders has grown into
            a powerhouse team helping the most ambitious projects in blockchain
            succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="overflow-hidden border-none bg-muted/30"
            >
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xl font-thunder lg:text-3xl font-bold text-primary">
                    {member.name}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm h-32 text-foreground/80 mb-4">
                    {member.bio}
                  </p>
                  <div className="flex space-x-3">
                    <Link
                      href={member.twitter}
                      className="text-foreground/60 hover:text-primary"
                    >
                      <Image
                        src="/assets/x.svg"
                        alt="Twitter"
                        width={20}
                        height={20}
                      />
                    </Link>
                    <Link
                      href={member.linkedin}
                      className="text-foreground/60 hover:text-primary"
                    >
                      <Image
                        src="/assets/linkedin.svg"
                        alt="LinkedIn"
                        width={20}
                        height={20}
                      />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
