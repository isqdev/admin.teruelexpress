import type { ComponentProps, ReactNode } from "react";
import React from "react";
import { twMerge } from "tailwind-merge";

interface SectionProps extends ComponentProps<"section"> {
  children?: ReactNode;
}

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section
      className={twMerge("p-6 sm:px-8 md:px-20 lg:px-32 lg:py-10 2xl:px-60 mx-auto max-w-495 scroll-m-30", className)}
      {...props}
    >
      {children ? children : "--vazio--"}
    </section>
  );
}

interface SectionBoxProps extends ComponentProps<'div'> {
    children?: ReactNode;
}

function Background({ className, children, ...props }: SectionBoxProps) {
    return (
        <div className={twMerge("bg-gray-50 min-h-screen w-full flex mx-auto", className,)} {...props}>
            {children ? children : "--vazio--"}
        </div>
    );
}

export function SectionBox({ className, children, ...props }: SectionBoxProps) {
    return (
      <Background>
        <div className={twMerge("w-full min-h-screen sm:min-h-0 sm:max-w-lg sm:mx-auto sm:my-4 bg-white sm:rounded-2xl sm:h-fit overflow-hidden p-6 sm:p-8", className,)}{...props}>
            {children ? children : "--vazio--"}
        </div>
      </Background>
    );
}

export function SectionApp({ className, children, ...props }: SectionProps) {
  return (
    <section
      className={twMerge("p-4 xs:p-6 sm:px-8 lg:py-5 mx-auto max-w-350 scroll-m-30", className)}
      {...props}
    >
      {children ? children : "--vazio--"}
    </section>
  );
}