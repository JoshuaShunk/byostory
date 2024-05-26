// components/ClientLayout.tsx
"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import SideNav from "@/components/side-nav";
import Header from "@/components/header";
import HeaderMobile from "@/components/header-mobile";
import Loader from "./loader";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex">
      {user ? (
        <>
          <div className="flex-1">
            <Header />
            <HeaderMobile />
            <main className="p-4">{children}</main>
          </div>
          <SideNav />
        </>
      ) : (
        <div className="flex-1">
          <Header />
          <HeaderMobile />
          <main className="p-4">{children}</main>
        </div>
      )}
    </div>
  );
};

export default ClientLayout;
