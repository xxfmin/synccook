import React from "react";
import Image from "next/image";
import logo from "@/../public/img/logo/logo-white.png";

export default function DashNavbar() {
  return (
    <nav className="w-full bg-transparent py-4 border-b border-green-800">
      <div className="flex w-full items-center justify-between">
        <a href="/" className="flex items-center gap-1 text-xl font-semibold">
          <Image src={logo} alt="SyncCook Logo" width={49} height={49} />
          <span className="text-white text-3xl">SyncCook</span>
        </a>
        <a href="/" className="text-white hover:underline">
          Logout
        </a>
      </div>
    </nav>
  );
}
