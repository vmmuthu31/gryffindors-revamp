"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-white text-gray-900 border border-gray-200 shadow-lg",
          description: "text-gray-500",
          actionButton: "bg-[#841a1c] text-white",
          cancelButton: "bg-gray-100 text-gray-600",
          success: "bg-green-50 border-green-200 text-green-800",
          error: "bg-red-50 border-red-200 text-red-800",
          warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
