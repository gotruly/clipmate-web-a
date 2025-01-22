"use client";

import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ClipmateLinkLoadingCard = () => {
  return (
    <Card className="rounded-[12px]">
      <CardContent className="flex flex-col gap-1 px-0 pt-0 pb-1 overflow-hidden h-full">
        {/* Domain & Image */}
        <div className="relative">
          <div className="px-2.5 py-2 w-full flex justify-between items-center absolute top-0 left-0 z-10">
            <div className="h-[16px] w-[100px] bg-card/80 rounded-sm" />

            <div className="w-[16px] h-[16px] rounded-sm bg-card/80" />
          </div>
          {/* Image */}
          <Skeleton className="overflow-hidden rounded-t-md rounded-b-none w-full h-[180px] max-h-[180px]" />
        </div>

        {/* Post Content */}
        <div className="flex flex-col px-3 py-2 gap-1.5">
          <div>
            <Skeleton className="w-full h-2.5 rounded-sm" />
          </div>
          <div className="flex flex-col pt-2 gap-1.5">
            <Skeleton className="w-1/2 h-2.5 rounded-sm" />
            <Skeleton className="w-full h-2.5 rounded-sm" />
            <Skeleton className="w-full h-2.5 rounded-sm" />
            <Skeleton className="w-3/4 h-2.5 rounded-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClipmateLinkLoadingCard;
