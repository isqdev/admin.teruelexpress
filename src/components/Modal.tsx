import { Warning } from "phosphor-react";
import type { ComponentProps, ReactNode } from "react";
import React from "react";
import { twMerge } from "tailwind-merge";
import { Button, ButtonText } from "./Button";

interface ModalProps extends ComponentProps<"div"> {
  children?: ReactNode;
  data?: any;
  open?: boolean;
  onClose?: () => void;
}

export function Modal({
  className,
  children,
  open = false,
  onClose,
  ...props
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-10 flex sm:items-center sm:justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className={twMerge(
          "p-6 min-h-screen sm:min-h-0 sm:max-w-3xl w-full sm:aspect-[4/3] rounded-2xl bg-white",
          className
        )}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        {...props}
      >
        <div>{children ? children : "--vazio--"}</div>
      </div>
    </div>
  );
}

interface ModalConfirmationProps extends ComponentProps<"div"> {
  children?: ReactNode;
  data?: any;
  open?: boolean;
  message?: string;
  textLeft?: string;
  textRight?: string;
  onClose?: () => void;
  action?: () => void;
}

export function ModalConfirmation({
  className,
  children,
  open = false,
  onClose,
  message,
  action,
  ...props
}: ModalConfirmationProps) {
  if (!open) return null;

  const handleAction = () => {
    if (onClose) onClose();
    if (action) action();
  }

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center p-5 bg-black/30"
      onClick={onClose}
    >
      <div
        className={twMerge(
          "p-4 sm:p-6 max-w-md w-full aspect-[4/1] rounded-2xl bg-white",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
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
              <ButtonText className="text-center">Excluir</ButtonText>
            </Button>            
          </div>
        </div>
      </div>
    </div>
  );
}
