"use client";

import { IClipmateCollections } from "@/types/clipmate";
import { Folder } from "@untitled-ui/icons-react";
import RedirectToCollection from "./RedirectToCollection";
import { cn } from "@/lib/utils";

type Props = {
  params: { id: string; uid: string };
  info: IClipmateCollections;
  goingDown: boolean;
};

const Banner = ({ params, info, goingDown }: Props) => {
  return (
    <div
      className={cn(
        "container mx-auto w-full h-full flex items-center gap-3 px-3 py-5 justify-between lg:justify-normal sticky top-0 left-0 z-20 bg-background",
        { "flex-col pt-20 pb-10": !goingDown }
      )}
    >
      <div
        className={cn("grid grid-cols-[48px_auto] lg:grid-cols-[64px_auto] items-center gap-3", {
          "flex flex-col gap-3": !goingDown,
        })}
      >
        <div className="flex items-center justify-center h-12 w-12 lg:h-16 lg:w-16 bg-accent/90 border border-border rounded-md">
          <Folder width={24} />
        </div>
        <h1 className="text-2xl font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
          {info.name}
        </h1>
      </div>

      <p
        className={cn(
          "text-sm text-center text-wrap font-normal max-w-[55ch] text-muted-foreground",
          {
            hidden: goingDown,
          }
        )}
      >
        {info.description}
      </p>

      <RedirectToCollection id={params.id} uid={params.uid} />
    </div>
  );
};

export default Banner;
