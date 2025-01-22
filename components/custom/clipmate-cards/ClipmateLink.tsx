/* eslint-disable @next/next/no-img-element */
"use client";

import { CardContent } from "@/components/ui/card";
import { IClipmateLink } from "@/types/clipmate";
import extractDomain from "extract-domain";
import ClipmateImage from "../ClipmateImage";
import { cn } from "@/lib/utils";
import CardProvider from "@/providers/CardProvider";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import React from "react";
import IconCompForCard from "./IconComp";

type Props = {
  value: IClipmateLink;
  inPopupView?: boolean;
};

const ClipmateLinkCard = React.memo(({ value, inPopupView }: Props) => {
  const { hasSelectedItems } = useMultipleItemActionAtom();

  return (
    <CardProvider url={value.data.url} value={value} inPopupView={inPopupView}>
      <CardContent className="flex flex-col gap-1 px-0 pt-0 pb-1 overflow-hidden">
        {/* Domain & Image */}
        <div className="relative">
          <div className="px-2.5 py-2 w-full flex justify-between items-center absolute top-0 left-0 z-10">
            <div className="px-1 py-0.5 font-normal text-xs bg-black/70 text-white rounded-sm">
              {extractDomain(value.data.url)}
            </div>

            <IconCompForCard
              size={16}
              hasSelectedItems={hasSelectedItems(value)}
              inPopupView={inPopupView}
              icon={value.type}
            />
          </div>
          {/* Image */}
          <div
            className={cn("overflow-hidden rounded-t-md w-full h-[180px] max-h-[180px]", {
              "h-[280px] max-h-[280px]": inPopupView,
            })}
          >
            {value.data.image && (
              <ClipmateImage src={value.data.image} alt={value.data.description} />
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="flex flex-col px-3 py-2 gap-1">
          <div>
            <p
              className={cn(
                "text-sm font-semibold text-ellipsis text-wrap whitespace-wrap break-words text-[#141414] dark:text-[#FAFAFA]",
                { "text-xs": !inPopupView }
              )}
            >
              {value.data.title}
            </p>
          </div>
          {value.data.description !== "No description" && (
            <p
              className={cn(
                "text-sm text-wrap text-ellipsis overflow-hidden whitespace-nowrap w-full content break-words text-[#424242] dark:text-[#D6D6D6]",
                { "text-xs": !inPopupView }
              )}
            >
              {inPopupView ? value.data.description : value.data.description.slice(0, 125)}
              {value.data.description.length > 125 && !inPopupView && "..."}
            </p>
          )}
        </div>
      </CardContent>
    </CardProvider>
  );
});

ClipmateLinkCard.displayName = "ClipmateLinkCard";

export default ClipmateLinkCard;
