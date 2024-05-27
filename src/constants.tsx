import { Icon } from "@iconify/react";
import { SideNavItem } from "./types";
import { PREDEFINED_TAGS } from "./tags";

export const TOP_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Explore",
    path: "/explore",
    icon: <Icon icon="lucide:radar" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: "All", path: "/explore" },
      ...PREDEFINED_TAGS.map((tag) => ({
        title: tag,
        path: `/explore/${tag}`,
      })),
    ],
  },
  {
    title: "New Story",
    path: "/create",
    icon: <Icon icon="lucide:square-plus" width="24" height="24" />,
  },
  {
    title: "My Stories",
    path: "/mystories",
    icon: <Icon icon="lucide:book-open-text" width="24" height="24" />,
  },
  {
    title: "Messages",
    path: "/messages",
    icon: <Icon icon="lucide:mail" width="24" height="24" />,
  },
];

export const BOTTOM_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Help",
    path: "/help",
    icon: <Icon icon="lucide:help-circle" width="24" height="24" />,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Icon icon="lucide:settings" width="24" height="24" />,
  },
];
