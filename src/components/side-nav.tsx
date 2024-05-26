"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOP_SIDENAV_ITEMS, BOTTOM_SIDENAV_ITEMS } from "@/constants";
import { SideNavItem } from "@/types";
import { Icon } from "@iconify/react";
import { useUser, UserButton } from "@clerk/nextjs";

const SideNav = () => {
  const { isLoaded, user } = useUser();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  if (!isLoaded || !user) {
    return null; // Do not render the sidebar if the user is not authenticated
  }

  return (
    <div className="md:w-60 h-[calc(100vh-47px)] mt-[47px] fixed border-r border-custom hidden md:flex flex-col">
      <div className="flex flex-col justify-between w-full h-full pt-4">
        <div className="flex flex-col space-y-2 md:px-6">
          {TOP_SIDENAV_ITEMS.map((item, idx) => (
            <MenuItem
              key={idx}
              item={item}
              isSubMenuOpen={subMenuOpen}
              toggleSubMenu={toggleSubMenu}
              pathname={pathname}
            />
          ))}
        </div>
        <div className="flex flex-col justify-end flex-grow space-y-2 mb-6 md:px-6">
          {BOTTOM_SIDENAV_ITEMS.map((item, idx) => (
            <MenuItem key={idx} item={item} pathname={pathname} />
          ))}

          {isLoaded && user && (
            <div className="mb-6">
              <div className="flex flex-row space-x-3 items-center">
                <UserButton afterSignOutUrl="/" />
                <div>
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {user.primaryEmailAddress?.emailAddress || "No email"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({
  item,
  isSubMenuOpen,
  toggleSubMenu,
  pathname,
}: {
  item: SideNavItem;
  isSubMenuOpen?: boolean;
  toggleSubMenu?: () => void;
  pathname?: string;
}) => {
  if (!pathname) return null;
  const isActive = pathname.includes(item.path);
  const highlightClass = isActive ? "highlighted" : "";

  return (
    <div>
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-100 ${highlightClass}`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-xl flex">{item.title}</span>
            </div>
            <div className={`${isSubMenuOpen ? "rotate-180" : ""} flex`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </button>
          {isSubMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`${subItem.path === pathname ? "font-bold" : ""}`}
                >
                  <span>{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${highlightClass}`}
        >
          {item.icon}
          <span className="font-semibold text-xl flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
