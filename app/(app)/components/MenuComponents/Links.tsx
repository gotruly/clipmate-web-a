"use client";

import { Bookmark, Inbox } from "lucide-react";
import LinksItem from "./LinksItem";
import { Trash04 } from "@untitled-ui/icons-react";

const Links = () => {
  const LinkList = [
    { name: "All Items", href: "/", icon: Bookmark },
    { name: "Unsorted", href: "/unsorted", icon: Inbox },
    { name: "Trash", href: "/trash", icon: Trash04 },
  ];

  return (
    <div className="flex flex-col gap-[1px] text-[13px] pb-4 pl-4">
      {LinkList.map((link, index) => (
        <LinksItem key={index} link={link} />
      ))}
    </div>
  );
};

export default Links;
