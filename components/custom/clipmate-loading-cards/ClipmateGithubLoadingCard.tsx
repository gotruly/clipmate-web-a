"use client";

import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ClipmateGithubLoadingCard = () => {
  return (
    <Card className="rounded-[12px]">
      <CardContent className="flex flex-col gap-1 px-0 pt-0 pb-1 overflow-hidden">
        {/* Domain & Image */}
        <div className="w-full grid grid-cols-[20px_1fr_18px] gap-1.5 justify-between items-center px-3 pt-2">
          <Skeleton className="rounded-full w-[20px] h-[20px]" />

          <div className="flex items-center gap-1 font-normal text-sm truncate">
            <Skeleton className="w-[100px] h-3" />
            <Skeleton className="w-[100px] h-3" />
          </div>

          <Skeleton className="w-[16px] h-[16px] rounded-sm" />
        </div>

        {/* Post Content */}
        <div className="flex flex-col px-3 pt-2 gap-1.5">
          <Skeleton className="w-1/2 h-2.5 rounded-sm" />
          <Skeleton className="w-full h-2.5 rounded-sm" />
          <Skeleton className="w-full h-2.5 rounded-sm" />
          <Skeleton className="w-3/4 h-2.5 rounded-sm" />
        </div>

        {/* Language */}
        <div className="grid grid-cols-[10px_auto] gap-1 items-center text-xs px-3 pb-2">
          <Skeleton className="w-[10px] h-[10px] rounded-full" />
          <p className="w-[100px] h-3 rounded-sm" />
        </div>

        {/* Stats */}
        <div className="flex gap-3 px-3 pb-1 items-center">
          <div className="grid grid-cols-[15px_1fr] items-center gap-1">
            <Skeleton className="w-[15px] h-[15px]" />
            <Skeleton className="w-10 h-3 rounded-sm" />
          </div>

          <div className="grid grid-cols-[15px_1fr] items-center gap-1">
            <Skeleton className="w-[15px] h-[15px]" />
            <Skeleton className="w-10 h-3 rounded-sm" />
          </div>

          <div className="grid grid-cols-[15px_1fr] items-center gap-1">
            <Skeleton className="w-[15px] h-[15px]" />
            <Skeleton className="w-10 h-3 rounded-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClipmateGithubLoadingCard;
