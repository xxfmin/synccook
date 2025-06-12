"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import headerSvg from "@/../public/img/dashboard/svg-bg.png";
import DashNavbar from "../../../components/DashNavbar";
import { SidebarDemo } from "../../../components/DashSidebar";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading…</p>;
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-emerald-700/20">
      <div className="relative h-80 w-full ">
        <Image
          src={headerSvg}
          alt="Dashboard header"
          fill
          quality={100}
          className="object-cover"
        />

        <div className="absolute top-0 w-full z-10 px-4 ">
          <div className="max-w-7xl mx-auto w-full pb-20 ">
            <DashNavbar />
            <h1 className="text-emerald-200 text-4xl font-semibold py-10 ">
              Dashboard
            </h1>
            <SidebarDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
