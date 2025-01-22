/* eslint-disable @next/next/no-img-element */
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Skeleton } from "@/components/ui/skeleton";
import { User as FirebaseUser } from "firebase/auth";
import { ChevronDown, Moon, SettingsIcon, Sun } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppConnections from "./Settings/AppConnections";
import {
  Atom01,
  Home05,
  Link04,
  LogOut04,
  MessageChatSquare,
  Monitor03,
  Receipt,
  Settings02,
} from "@untitled-ui/icons-react";
import Account from "./Settings/Account";
import { ClipmateNextImage } from "@/components/custom/ClipmateImage";
import Billing from "./Settings/Billing";
import { ClipmateUpgradeBadge } from "@/components/custom/ClipmateSyncedBadge";
import useSettingsModalAtom from "@/stores/SettingsModalStore";
import AppleIcon from "@/components/icons/apple";
import { CHROME_EXTENSION_URL, IOS_APP_STORE_URL } from "@/constants";
import ChromeIcon from "@/components/icons/chrome";
import Link from "next/link";

type Props = {
  user: FirebaseUser | null;
  isLoading: boolean;
  isPending: boolean;
  isPro?: boolean;
  handleLogout: () => void;
  handleThemeChange: (theme: string) => void;
};

const ProfileDropdown = ({
  user,
  isLoading,
  isPending,
  isPro,
  handleLogout,
  handleThemeChange,
}: Props) => {
  const { open, setOpen, tab, setTab } = useSettingsModalAtom();

  const SettingsItems = [
    { id: "account", label: "Account", icon: Home05, component: <Account />, badge: null },
    {
      id: "connection",
      label: "App Connections",
      icon: Link04,
      component: <AppConnections />,
      badge: null,
    },
    // {
    //   id: "billing",
    //   label: "Plan & Billing",
    //   icon: Receipt,
    //   component: <Billing />,
    //   badge: <ClipmateUpgradeBadge />,
    // },
  ];

  const Links = [
    { id: "ios", label: "Get iOS App", icon: AppleIcon, url: IOS_APP_STORE_URL },
    {
      id: "chrome-ext",
      label: "Get Chrome Extension",
      icon: ChromeIcon,
      url: CHROME_EXTENSION_URL,
    },
  ];

  const ContactLinks = [
    {
      id: "request-feat",
      label: "Request a Feature",
      icon: Atom01,
      url: "mailto:hello@clipmate.ai?subject=Feature Request",
    },
    {
      id: "contact-us",
      label: "Contact Us",
      icon: MessageChatSquare,
      url: "mailto:hello@clipmate.ai",
    },
  ];

  const FallbackProfileImage = (name: string | null | undefined) => {
    const [firstName, lastName] = name?.split(" ") || [];
    if (!name) return `https://ui-avatars.com/api/?background=random&name=C`;
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;
  };

  return (
    <Dialog open={open} onOpenChange={(b) => setOpen(b)}>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none ring-0" disabled={isLoading || isPending}>
          <div className="flex items-center gap-1">
            {(isLoading || isPending) && (
              <div className="flex items-center gap-2">
                <Skeleton className="w-6 h-6 rounded-md border border-border" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-32 h-3" />
                </div>
              </div>
            )}

            {!isLoading && (
              <div className="grid grid-cols-[18px_auto] items-center gap-1.5">
                <ClipmateNextImage
                  src={user?.photoURL || FallbackProfileImage(user?.displayName)}
                  alt={user?.displayName || "User Profile"}
                  className="w-[18px] h-[18px] rounded-md border border-border"
                />

                <p className="text-sm text-left font-medium truncate">
                  {user?.displayName?.split(" ")[0] + "'s"} Clipmate
                </p>
              </div>
            )}

            <ChevronDown size={15} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[255px] bg-card"
          sideOffset={10}
          align="start"
          side="top"
        >
          <DropdownMenuItem asChild>
            <DialogTrigger className="w-full">
              <div className="flex items-center gap-2 w-full">
                <SettingsIcon size={16} />
                Settings
              </div>
            </DialogTrigger>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div className="flex items-center gap-2">
                <Monitor03 width={17} /> Theme
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-card" sideOffset={7}>
              <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                <div className="flex items-center gap-2">
                  <Moon size={17} />
                  Dark
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                <div className="flex items-center gap-2">
                  <Sun size={17} />
                  Light
                </div>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          {ContactLinks.map((item, _) => (
            <DropdownMenuItem key={item.id} className="flex items-center gap-2" asChild>
              <Link href={item.url} target="_blank" rel="noopener noreferrer">
                <item.icon width={17} /> {item.label}
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {Links.map((item, _) => (
            <DropdownMenuItem key={item.id} className="flex items-center gap-2" asChild>
              <Link href={item.url} target="_blank" rel="noopener noreferrer">
                <item.icon width={17} /> {item.label}
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleLogout()}>
            <LogOut04 width={17} color="#F04438" />
            <span className="!text-[#FF6038]">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="h-[650px] md:max-w-[870px] block max-h-full p-0 overflow-hidden rounded-md">
        <DialogHeader className="p-3 border-border border-b">
          <p className="text-sm font-medium flex items-center gap-2">
            <Settings02 width={16} height={16} />
            <span>Settings</span>
          </p>
        </DialogHeader>

        <Tabs
          orientation="vertical"
          className="flex h-full"
          value={tab}
          defaultValue={tab}
          onValueChange={(v) => setTab(v)}
        >
          <TabsList className="flex flex-col gap-1 justify-start h-full !w-[270px] border-r border-border rounded-none px-3 py-3">
            {SettingsItems.map(({ id, label, icon, badge }) => {
              const Icon = icon;
              return (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="flex items-center justify-between h-[26px] px-2 py-1 gap-2 text-sm text-left text-primary w-full text-black dark:text-white focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0"
                >
                  <div className="flex items-center gap-2 font-medium rounded-[6px]">
                    <Icon width={15} height={15} /> {label}
                  </div>
                  {badge && !isPro && badge}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {SettingsItems.map(({ id, component }) => (
            <TabsContent className="w-full flex-1" key={id} value={id}>
              {component}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDropdown;
