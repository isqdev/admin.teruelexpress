import type { ComponentProps, ReactNode } from "react";
import React from "react";
import { twMerge } from "tailwind-merge";

interface ModalProps extends ComponentProps<'div'> {
    children?: ReactNode;
    data?: any;
    open?: boolean; 
    onClose?: () => void; 
}

export function Modal({ className, children, data, open = true, onClose, ...props }: ModalProps) {
    if (!open) return null; 

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
            <div className={twMerge("p-6 min-h-screen sm:min-h-0 sm:max-w-3xl w-full sm:aspect-[4/3]  mx-auto rounded-2xl bg-gray-50", className)} {...props}>
                <div>
                    {children ? children : "--vazio--"}
                </div>
            </div>
        </div>
    );
}