"use client";

import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ClipmatePDFLoadingCard = () => {
  return (
    <Card className="rounded-[12px]">
      <CardContent className="flex flex-col gap-1 px-0 pt-0 pb-1 overflow-hidden">
        {/* Icon - Loading */}
        <div className="relative">
          <div className="px-2.5 py-2 w-full flex justify-end items-center absolute top-0 right-0 z-10">
            <div className="w-[16px] h-[16px] rounded-sm bg-card/80" />
          </div>
          {/* Image */}
          <Skeleton className="overflow-hidden rounded-t-md rounded-b-none w-full h-[180px] max-h-[180px]" />
        </div>

        {/* Post Content - Loading */}
        <div className="flex flex-col px-3 py-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-full h-2.5 rounded-sm" />
            <Skeleton className="w-2/4 h-2.5 rounded-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-1/2 h-2.5 rounded-sm" />
            <Skeleton className="w-full h-2.5 rounded-sm" />
            <Skeleton className="w-full h-2.5 rounded-sm" />
            <Skeleton className="w-3/4 h-2.5 rounded-sm" />
          </div>
          <div className="grid grid-cols-[15px_auto] items-center gap-1.5 text-muted-foreground">
            <Skeleton className="w-[15px] h-[15px] rounded-sm" />
            <Skeleton className="w-full h-2.5 rounded-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClipmatePDFLoadingCard;
