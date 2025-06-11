"use client";

import React, { useState } from "react";
import { cn } from "@/../lib/utils";
import { Sidebar, SidebarBody } from "@/../components/ui/sidebar";
import {
  IconChefHat,
  IconNotebook,
  IconTextScan2,
  IconUserCircle,
} from "@tabler/icons-react";

// import your actual page components here:
import SessionsPage from "./pages/SessionsPage/page";
import RecipesPage from "./pages/RecipesPage/page";
import ImportScanPage from "./pages/ImportScanPage/page";
import ProfilePage from "./pages/ProfilePage/page";

interface PageConfig {
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const pages: PageConfig[] = [
  {
    label: "Sessions",
    icon: <IconChefHat className="h-5 w-5 text-neutral-700" />,
    component: <SessionsPage />,
  },
  {
    label: "My Recipes",
    icon: <IconNotebook className="h-5 w-5 text-neutral-700" />,
    component: <RecipesPage />,
  },
  {
    label: "Import & Scan",
    icon: <IconTextScan2 className="h-5 w-5 text-neutral-700" />,
    component: <ImportScanPage />,
  },
  {
    label: "Profile",
    icon: <IconUserCircle className="h-5 w-5 text-neutral-700" />,
    component: <ProfilePage />,
  },
];

export function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(pages[0].label);

  const ActiveComponent = pages.find((p) => p.label === selected)!.component;

  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row",
        "h-[80vh]"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className="mt-8 flex flex-col gap-2">
              {pages.map(({ label, icon }) => (
                <button
                  key={label}
                  onClick={() => setSelected(label)}
                  className={cn(
                    "flex items-center gap-2 w-full py-2 text-left cursor-pointer px-3",
                    selected === label ? "bg-gray-200 rounded-lg" : ""
                  )}
                >
                  {icon}
                  <span className="text-neutral-700 text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex flex-1">
        <div className="flex h-full w-full flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10">
          {ActiveComponent}
        </div>
      </div>
    </div>
  );
}
