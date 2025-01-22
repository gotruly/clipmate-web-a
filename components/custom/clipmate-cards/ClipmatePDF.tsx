/* eslint-disable @next/next/no-img-element */
"use client";

import { CardContent } from "@/components/ui/card";
import { IClipmatePDF } from "@/types/clipmate";
import { ClipmateNextImage } from "../ClipmateImage";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { Skeleton } from "@/components/ui/skeleton";
import { BsFeather } from "react-icons/bs";
import { cn } from "@/lib/utils";
import FirestorageHooks from "@/app/api/hooks/firestorage";
import CardProvider from "@/providers/CardProvider";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import React from "react";
import IconCompForCard from "./IconComp";

type Props = {
  value: IClipmatePDF;
  inPopupView?: boolean;
};

const ClipmatePDFCard = React.memo(({ value, inPopupView }: Props) => {
  const { user } = FireAuthHooks.useGetUser();
  const { hasSelectedItems } = useMultipleItemActionAtom();

  const Image = FirestorageHooks.useGetDownloadLink(
    ["user_images", user.uid, value.data.preview_image],
    { key: value.data.preview_image }
  );

  const File = FirestorageHooks.useGetDownloadLink(
    ["user_files", user.uid, value.data.storage_file_name],
    { key: value.data.storage_file_path }
  );

  return (
    <CardProvider
      url={File.data}
      value={value}
      isLoading={File.isLoading}
      inPopupView={inPopupView}
    >
      <CardContent className="flex flex-col gap-1 px-0 pt-0 pb-1 overflow-hidden">
        {/* Domain & Image */}
        <div className="relative w-full">
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
            className={cn("overflow-hidden rounded-t-md w-full h-[250px] max-h-[250px]", {
              "h-[400px] min-h-[450px] max-h-[500px]": inPopupView,
            })}
          >
            {Image.isLoading && !Image.data && <Skeleton className="h-full w-full" />}
            {!Image.isLoading && Image.data !== "" && (
              <ClipmateNextImage
                draggable={false}
                className="object-cover object-top w-full h-full"
                src={Image.data ? Image.data : ""}
                alt={value.data.short_summary}
              />
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="flex flex-col px-3 py-2 gap-2">
          <p
            className={cn(
              "text-sm font-semibold text-ellipsis text-wrap whitespace-wrap break-words",
              { "text-xs": !inPopupView }
            )}
          >
            {value.data.title}
          </p>

          {value.data.summary !== "No description" && (
            <p
              className={cn(
                "text-sm text-wrap text-ellipsis overflow-hidden whitespace-nowrap break-words text-[#424242] dark:text-[#D6D6D6]",
                { "text-xs": !inPopupView }
              )}
            >
              {inPopupView ? value.data.summary : value.data.summary.slice(0, 150)}
              {value.data.summary.length > 150 && !inPopupView && "..."}
            </p>
          )}

          {value.data.authors && (
            <div className="grid grid-cols-[0.1fr_auto] items-center gap-1.5 text-[#424242] dark:text-[#D6D6D6]">
              <BsFeather className="p-0" size={15} />
              <p className="w-full pr-2 pt-1 text-xs text-ellipsis overflow-hidden whitespace-nowrap">
                {value.data.authors.join(", ")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </CardProvider>
  );
});

ClipmatePDFCard.displayName = "ClipmatePDFCard";

export default ClipmatePDFCard;
