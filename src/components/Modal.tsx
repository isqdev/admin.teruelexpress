import { Warning } from "phosphor-react";
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
  lg: "max-w-4xl",
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
      className={`fixed inset-0 z-50 flex sm:items-center sm:justify-center bg-black/30`}
      onClick={onClose}
    >
      <div
        className={twMerge(
          `p-4 sm:p-6 m-5 w-full rounded-2xl bg-white ${widthMap[width]}`,
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
  actionWord?: string;
  onClose?: () => void;
  action?: () => void;
}

export function ModalConfirm({
  className,
  children,
  open = false,
  onClose,
  message,
  actionWord,
  action,
  ...props
}: ModalConfirmProps) {
  if (!open) return null;

  const handleAction = () => {
    if (action) action();
    if (onClose) onClose();
  }

  return (
      <ModalSm open={open} onClose={onClose}>
        <div className="flex flex-col justify-between gap-4">
          <div className="flex items-center justify-around gap-4">
            <Warning className="icon text-gray-600" size={32} />
            <p className="flex-1">{message}</p>
          </div>
          <div className="flex justify-end gap-4">
            <Button className="bg-white-tx text-black border-gray-600 border-1 h-10 sm:h-12" onClick={onClose}>
              <ButtonText className="text-center">Voltar</ButtonText>
            </Button>
            <Button className="bg-red-50 text-danger-base h-10 sm:h-12" onClick={handleAction}>
              <ButtonText className="text-center">{actionWord}</ButtonText>
            </Button>            
          </div>
          </div>
       </ModalSm>
  );
}
