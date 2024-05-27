// components/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import useScroll from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import ThemeSwitch from "./ThemeSwitch";
import useIsMobile from "@/hooks/use-is-mobile";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const isMobile = useIsMobile();
  const { user, isLoaded } = useUser();

  return (
    <div
      className={cn("sticky top-0 z-30 w-full transition-all border-b", {
        "bg-background-color": scrolled,
      })}
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: scrolled ? "var(--background-color)" : "transparent",
      }}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex flex-row space-x-3 items-center">
            <Image
              src="/BYOStoryLogo.png" // Replace with the path to your image
              alt="Logo"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="font-bold text-xl flex">byoStory</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          {!isMobile && <ThemeSwitch />}
          {isLoaded && !user && (
            <SignInButton>
              <button className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
