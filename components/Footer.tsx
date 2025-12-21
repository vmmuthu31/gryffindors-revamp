import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#FCE0E1] font-dmsans text-[#770002] rounded-t-3xl pt-10 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-between w-full gap-7 items-start md:items-center mb-8">
          <div className="mb-6 md:mb-0 max-w-sm">
            <p className="text-sm hidden lg:block lg:text-lg  mb-4">
              Learn industry-ready skills with our <br /> expert-led internship
              programs. <br /> Build real projects and launch <br /> your tech
              career.
            </p>
            <p className="text-sm block lg:hidden mb-4">
              Learn industry-ready skills with our expert-led internship
              programs. Build real projects and launch your tech career.
            </p>
          </div>

          <div className="flex lg:gap-16 gap-4">
            <div>
              <p className="lg:text-lg text-sm font-semibold font-dmsans mb-3">
                PROGRAMS
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/internships"
                    className="whitespace-nowrap hover:text-primary transition-colors"
                  >
                    All Internships
                  </Link>
                </li>
                <li>
                  <Link
                    href="/internships"
                    className="hover:text-primary transition-colors"
                  >
                    Full Stack Development
                  </Link>
                </li>
                <li>
                  <Link
                    href="/internships"
                    className="hover:text-primary transition-colors"
                  >
                    AI/ML Engineering
                  </Link>
                </li>
                <li>
                  <Link
                    href="/internships"
                    className="hover:text-primary transition-colors"
                  >
                    Web3/Blockchain
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="lg:text-lg text-sm font-semibold font-dmsans mb-3">
                LEGAL
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/terms-and-conditions"
                    className="whitespace-nowrap hover:text-primary transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className=" hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refund-policy"
                    className=" hover:text-primary transition-colors"
                  >
                    Cancellation & Refunds
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className=" hover:text-primary transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="lg:text-lg text-sm font-semibold font-dmsans mb-3">
                SOCIAL
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="https://x.com/Gryffindor_W3"
                    className=" hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="http://linkedin.com/company/gryffindors"
                    className=" hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="/portfolio"
                    className=" hover:text-primary transition-colors"
                  >
                    Portfolio
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
