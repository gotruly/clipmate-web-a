"use client";

import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  hideImage?: boolean;
};

const ClipmateTwitterLoadingCard = ({ hideImage = false }: Props) => {
  return (
    <Card className="rounded-[12px]">
      <CardContent className="flex flex-col gap-1 px-0 pt-0 pb-2">
        {/* Card Header - Loading */}
        <div className="p-2 w-full grid grid-cols-[auto_16px] justify-between items-start">
          {/* Author - Loading */}
          <div className="grid grid-cols-[32px_120px] items-center gap-1">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="grid gap-1 px-1 w-full font-normal">
              <Skeleton className="w-full h-2.5 rounded-sm" />
              <Skeleton className="w-1/2 h-2.5 rounded-sm" />
            </div>
          </div>

          {/* Icon Type - Loading */}
          <Skeleton className="w-[16px] h-[16px] rounded-sm" />
        </div>

        <div className="flex flex-col gap-1.5 px-3 py-2">
          <Skeleton className="w-1/2 h-2.5 rounded-sm" />
          <Skeleton className="w-full h-2.5 rounded-sm" />
          <Skeleton className="w-full h-2.5 rounded-sm" />
          <Skeleton className="w-3/4 h-2.5 rounded-sm" />
        </div>

        {/* Image Grid - Loading */}
        <div className={cn("overflow-hidden rounded-md mx-2", { hidden: hideImage })}>
          <Skeleton className="w-full h-[200px] min-h-[150px] max-h-[300px]" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClipmateTwitterLoadingCard;
