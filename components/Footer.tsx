import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#FCE0E1] font-dmsans rounded-t-3xl pt-10 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-6 md:mb-0 max-w-sm">
            <p className="text-sm lg:text-lg text-[#770002] mb-4">
              Fueling innovation. Building the <br /> future of Web3. Join us in{" "}
              <br /> redefining the decentralized <br /> world.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-foreground">
                COMMUNITY
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/team"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Team
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-foreground">
                SOCIAL MEDIA
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Telegram
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center lg:px-14 px-3 gap-5 w-full justify-between">
        <h2 className="text-6xl font-thunder md:text-7xl lg:text-[285.63px] font-bold text-[#7B1113]">
          GRYFFINDORS
        </h2>
        <p className="lg:text-lg text-sm lg:mt-20 text-[#770002] text-center md:text-left">
          &copy; 2025 Gryffindors. all rights <br className="lg:block hidden" />{" "}
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
