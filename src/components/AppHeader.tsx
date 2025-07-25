import React from "react";
import { ArrowLeft, List } from "phosphor-react";
import { Link } from "react-router-dom";
import { useSidebar } from "./ui/sidebar";

export function AppHeader({ screenTitle }: { screenTitle: string }) {
  return (
    <div className="xl:col-span-2 flex items-center">
      <h3 className="text-center flex-auto">{screenTitle}</h3>
      <CustomTrigger/>
    </div>
  );
}

function CustomTrigger() {
  const { toggleSidebar } = useSidebar()
  return <List onClick={toggleSidebar} className="icon md:hidden"/>
}