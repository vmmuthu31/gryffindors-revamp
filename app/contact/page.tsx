"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import RunningHeading from "@/components/RunningHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    project: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          message: "",
          project: "",
        });

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-[#fbf2f1] min-h-screen">
      <div className="container py-16">
        <RunningHeading
          words={[
            { text: "GET", isOutline: false },
            { text: "IN", isOutline: false },
            { text: "TOUCH", isOutline: true },
          ]}
          speed={40}
          direction="left"
        />

        <div className="max-w-7xl mx-auto mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-white/50 backdrop-blur-sm border-none shadow-sm">
                <CardContent className="p-8">
                  <p className="text-3xl font-bold text-[#841a1c] mb-6">
                    Send Us a Message
                  </p>

                  {submitted ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
                      <p className="font-medium">Thank you for your message!</p>
                      <p className="text-sm mt-1">
                        We&apos;ll get back to you as soon as possible.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700 block mb-1"
                        >
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-white/70"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700 block mb-1"
                        >
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-white/70"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="project"
                          className="text-sm font-medium text-gray-700 block mb-1"
                        >
                          Project Type
                        </label>
                        <Input
                          id="project"
                          name="project"
                          value={formData.project}
                          onChange={handleChange}
                          placeholder="e.g., Smart Contract, dApp, DeFi Solution"
                          className="bg-white/70"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="text-sm font-medium text-gray-700 block mb-1"
                        >
                          Your Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className="bg-white/70"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="bg-[#841a1c] hover:bg-[#4d1616] text-white w-full py-6"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-10"
            >
              <div>
                <p className="text-3xl font-bold text-[#841a1c] mb-4">
                  Contact Information
                </p>
                <p className="text-gray-600 mb-6">
                  Have a project in mind or want to learn more about our Web3
                  solutions? Reach out to us through any of the channels below.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#841a1c]/10 p-3 rounded-full mr-4">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20p0C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                          fill="#841a1c"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#841a1c]">Email</p>
                      <p className="text-gray-600 mt-1">
                        support@gryffindors.in
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#841a1c]/10 p-3 rounded-full mr-4">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 11.5C11.337 11.5 10.7011 11.2366 10.2322 10.7678C9.76339 10.2989 9.5 9.66304 9.5 9C9.5 8.33696 9.76339 7.70107 10.2322 7.23223C10.7011 6.76339 11.337 6.5 12 6.5C12.663 6.5 13.2989 6.76339 13.7678 7.23223C14.2366 7.70107 14.5 8.33696 14.5 9C14.5 9.3283 14.4353 9.65339 14.3097 9.95671C14.1841 10.26 14.0004 10.5356 13.7678 10.7678C13.5356 11.0004 13.26 11.1841 12.9567 11.3097C12.6534 11.4353 12.3283 11.5 12 11.5ZM12 2C10.1435 2 8.36301 2.7375 7.05025 4.05025C5.7375 5.36301 5 7.14348 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 7.14348 18.2625 5.36301 16.9497 4.05025C15.637 2.7375 13.8565 2 12 2Z"
                          fill="#841a1c"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#841a1c]">Location</p>
                      <p className="text-gray-600 mt-1">Chennai, India</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="text-xl font-bold text-[#841a1c] mb-4">
                  Connect With Us
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="https://x.com/Gryffindor_W3"
                    className="bg-[#841a1c]/10 hover:bg-[#841a1c]/20 p-3 rounded-full transition-colors"
                  >
                    <Image
                      src="/assets/x.svg"
                      alt="Twitter"
                      width={24}
                      height={24}
                    />
                  </Link>
                  <Link
                    href="http://linkedin.com/company/gryffindors"
                    className="bg-[#841a1c]/10 hover:bg-[#841a1c]/20 p-3 rounded-full transition-colors"
                  >
                    <Image
                      src="/assets/linkedin.svg"
                      alt="LinkedIn"
                      width={24}
                      height={24}
                    />
                  </Link>
                  <Link
                    href="https://wa.me/918072105077"
                    className="bg-[#841a1c]/10 hover:bg-[#841a1c]/20 p-3 rounded-full transition-colors"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM7.07 18.28C7.5 17.38 10.12 16.5 12 16.5C13.88 16.5 16.51 17.38 16.93 18.28C15.57 19.36 13.86 20 12 20C10.14 20 8.43 19.36 7.07 18.28ZM18.36 16.83C16.93 15.09 13.46 14.5 12 14.5C10.54 14.5 7.07 15.09 5.64 16.83C4.62 15.49 4 13.82 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 13.82 19.38 15.49 18.36 16.83ZM12 6C10.06 6 8.5 7.56 8.5 9.5C8.5 11.44 10.06 13 12 13C13.94 13 15.5 11.44 15.5 9.5C15.5 7.56 13.94 6 12 6ZM12 11C11.17 11 10.5 10.33 10.5 9.5C10.5 8.67 11.17 8 12 8C12.83 8 13.5 8.67 13.5 9.5C13.5 10.33 12.83 11 12 11Z"
                        fill="#841a1c"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Contact Card */}
              <Card className="bg-[#841a1c] text-white border-none shadow-sm overflow-hidden">
                <CardContent className="p-8 relative">
                  <div className="absolute right-0 top-0 opacity-10">
                    <svg
                      width="150"
                      height="150"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20p0C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold mb-3">Start a New Project</p>
                  <p className="mb-6 text-white/80">
                    Ready to bring your Web3 vision to life? We&apos;re here to
                    help you every step of the way.
                  </p>
                  <Button
                    asChild
                    className="bg-white text-[#841a1c] hover:bg-white/90"
                  >
                    <Link href="https://cal.com/vairamuthu-m-sb6rz6/30min">
                      Schedule a Call
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
