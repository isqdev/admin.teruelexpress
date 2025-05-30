import React from "react";
import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, InputMessage, Modal, SectionApp, AppHeader, Shape } from "@/components";

export function ServicedRoutes() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <SectionApp>
            <AppHeader screenTitle="Rotas atendidas"/>
            <p onClick={() => setOpen(setOpen(!open))}>Opá</p>
            <Modal classname="bg-gray-600" open={open} onClose={() => setOpen(false)}>Teste</Modal>
      </SectionApp>
    </>
  );
}