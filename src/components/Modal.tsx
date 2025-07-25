import { CheckCircle, Warning } from "phosphor-react";
import type { ComponentProps, ReactNode } from "react";
import React from "react";
import { twMerge } from "tailwind-merge";
import { Button, ButtonText } from "./Button";

// interface ModalProps extends ComponentProps<"div"> {
//   children?: ReactNode;
//   data?: any;
//   open?: boolean;
//   onClose?: () => void;
// }

interface ModalProps extends ComponentProps<"div"> {
  open: boolean;
  onClose: () => void;
  width?: "md" | "lg" ;
}

const widthMap = {
  md: "max-w-xl",
  lg: "max-w-5xl",
};

export function Modal({
  className,
  children,
  open = false,
  onClose,
  width = "lg",
  ...props
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex sm:items-center sm:justify-center bg-black/30 overflow-y-auto`}
      onClick={onClose}
    >
      <div
        className={twMerge(
          `p-4 sm:p-6 m-2 sm:m-5 w-full rounded-2xl bg-white ${widthMap[width]} my-auto`,
          className
        )}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        {...props}
      >
        {children || "vazio"}
      </div>
    </div>
  );
}

export function ModalSm({
  className,
  children,
  open = false,
  onClose,
  ...props
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30`}
      onClick={onClose}
    >
      <div
        className={twMerge(
          "p-4 sm:p-6 m-5 w-full rounded-2xl bg-white max-w-md",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children || "vazio"}
      </div>
    </div>
  );
}


interface ModalConfirmProps extends ComponentProps<"div"> {
  children?: ReactNode;
  data?: any;
  open?: boolean;
  message?: string;
  textLeft?: string;
  textRight?: string;
  options?: string[];
  good?: boolean;
  onClose?: () => void;
  action?: () => void;
}

export function ModalConfirm({
  className,
  children,
  open = false,
  good = false,
  onClose,
  message,
  options,
  action,
  ...props
}: ModalConfirmProps) {
  if (!open) return null;

  const handleAction = () => {
    if (action) action();
    if (onClose) onClose();
  }

  return (
      <ModalSm open={open} onClose={onClose || (() => {})}>
        <div className="flex flex-col justify-between gap-4">
          <div className="flex items-center justify-around gap-4">
            {good ? <CheckCircle className="icon text-gray-600" size={32} /> : <Warning className="icon text-gray-600" size={32} /> }
            <p className="flex-1">{message}</p>
          </div>
          <div className="flex justify-end gap-4">
            <Button className="h-10 sm:h-12" variant="secondary" onClick={onClose}>
              <ButtonText className="text-center">{options && options[0] || ""}</ButtonText>
            </Button>
            <Button className={"h-10 sm:h-12"} variant={good ? "primary" : "danger"} onClick={handleAction}>
              <ButtonText className="text-center">{options && options[1] || ""}</ButtonText>
            </Button>            
          </div>
          </div>
       </ModalSm>
  );
}
