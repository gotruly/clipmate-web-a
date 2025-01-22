/* eslint-disable @next/next/no-img-element */
"use client";

import { CardContent } from "@/components/ui/card";
import { IClipmateScreenshot } from "@/types/clipmate";
import { ClipmateNextImage } from "../ClipmateImage";
import { cn } from "@/lib/utils";
import CardProvider from "@/providers/CardProvider";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import React from "react";
import IconCompForCard from "./IconComp";

type Props = {
  value: IClipmateScreenshot;
  inPopupView?: boolean;
};

const ClipmateScreenshotCard = React.memo(({ value, inPopupView }: Props) => {
  const { hasSelectedItems } = useMultipleItemActionAtom();
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <CardProvider url={value.data.url} value={value} inPopupView={inPopupView}>
      <CardContent className="p-0 overflow-hidden">
        {/* Icon */}
        <div className="px-2.5 py-2 w-full flex justify-end items-center absolute top-0 left-0 z-10">
          <IconCompForCard
            size={16}
            hasSelectedItems={hasSelectedItems(value)}
            inPopupView={inPopupView}
            icon={value.type}
          />
        </div>

        {/* Image */}
        <div
          className={cn("overflow-hidden rounded-t-md w-full h-full", {
            "h-full min-h-full": inPopupView,
            "min-h-[280px]": isLoading,
          })}
        >
          <ClipmateNextImage
            className="object-cover w-full h-full"
            bgClass="w-full h-full"
            src={value.data.url}
            alt={value.data.hash}
            onLoaded={() => setIsLoading(false)}
          />
        </div>
      </CardContent>
    </CardProvider>
  );
});

ClipmateScreenshotCard.displayName = "ClipmateScreenshotCard";

export default ClipmateScreenshotCard;
