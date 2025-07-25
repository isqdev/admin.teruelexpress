import React from "react";
import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "complementary" | "danger"
}

const variantMap = {
  primary: "bg-red-tx text-white",
  secondary: "bg-gray-50 text-black",
  complementary: "bg-blue-tx text-white",
  danger: "bg-red-50 text-danger-base",
};

export function Button({ className, children, variant="secondary", ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(
        `${variantMap[variant]} w-full h-12 sm:h-14 hover:cursor-pointer hover:scale-101 hover:opacity-90 duration-200 px-3 rounded-2xl flex items-center gap-3`,
        className
      )}
      {...props}
    >
      {children ? children : "--vazio--"}
    </button>
  );
}

interface ButtonTextProps extends ComponentProps<"span"> {}

export function ButtonText({ children, className, ...props }: ButtonTextProps) {
  return (
    <span
      className={twMerge("text-base w-full text-left sm:text-xl font-bold", className)}
      {...props}
    >
      {children}
    </span>
  );
}