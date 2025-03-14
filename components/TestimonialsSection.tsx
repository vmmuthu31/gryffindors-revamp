import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    text: "Gryffindors brought our Web3 vision to life! Their deep expertise in smart contracts and dApp development made the entire process seamless. Recommend for any blockchain project!",
    author: "Jane Doe",
    position: "CEO of XYZ Protocol",
    category: "DEFI SOLUTIONS",
  },
  {
    id: 2,
    text: "Partnering with Gryffindors for Web3 hackathons has been a game-changer. Their ability to execute, innovate, and deliver is unmatched. Their community engagement is top-notch!",
    author: "Alice Nguyen",
    position: "Head of Ecosystem at ABC",
    category: "NFT Ecosystems",
  },
  {
    id: 3,
    text: "As a startup in the blockchain space, we needed expert guidance. Gryffindors helped us refine our tokenomics and smart contract strategy, setting us up for long-term success.",
    author: "Sophia Patel",
    position: "Founder of DeFiConnect",
    category: "DAO Infrastructure",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="lg:py-16 bg-background" id="testimonials">
      <div className="lg:px-20 px-4">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-4">
            TRUST
          </h2>
          <p className="text-center text-lg font-medium lowercase text-foreground/80 max-w-3xl mx-auto">
            Over the past three years, we&apos;ve had the privilege of working
            with incredible teams, founders, and developers in the Web3 space.
            Here&apos;s what they have to say!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-[#770002] border-none  shadow-[0px_0px_35px_0px_#FFFFFFCC_inset]"
            >
              <CardContent className="p-8">
                <p className="text-white font-dmsans font-medium text-2xl mb-6">
                  &quot;{testimonial.text}&quot;
                </p>
                <div>
                  <p className="font-bold font-thunder text-4xl text-white">
                    - {testimonial.author}
                  </p>
                  <p className="text-sm font-dmsans lg:text-2xl font-medium text-white">
                    {testimonial.position}
                  </p>
                  <div className="flex">
                    <div className="bg-white px-2 py-1 mt-2">
                      <p className="text-xs lg:text-base text-[#770002] uppercase">
                        {testimonial.category}
                      </p>
                    </div>
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

export default TestimonialsSection;
