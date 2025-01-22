"use client";

import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  hideImage?: boolean;
};

const ClipmateRedditLoadingCard = ({ hideImage = false }: Props) => {
  return (
    <Card className="rounded-[12px]">
      <CardContent className="flex flex-col gap-1 px-0 pt-0 pb-2">
        {/* Card Header - Loading */}
        <div className="p-2 w-full grid grid-cols-[auto_16px] justify-between items-center">
          {/* Author - Loading */}
          <div className="flex items-center gap-1">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-[100px] h-2.5 rounded-sm" />
          </div>

          {/* Icon Type - Loading */}
          <Skeleton className="p-1 w-[16px] h-[16px] rounded-sm" />
        </div>

        <div className="flex flex-col gap-1.5 px-2 py-2">
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

export default ClipmateRedditLoadingCard;
