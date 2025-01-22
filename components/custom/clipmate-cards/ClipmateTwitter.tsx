/* eslint-disable @next/next/no-img-element */
"use client";

import { CardContent } from "@/components/ui/card";
import { HighlightValue, IClipmateReaderMode, IClipmateTwitter } from "@/types/clipmate";
import markdownit from "markdown-it";
import truncate from "truncate-html";
import { cn } from "@/lib/utils";
import { ClipmateNextImage } from "../ClipmateImage";
import { useCallback, useMemo } from "react";
import CardProvider from "@/providers/CardProvider";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import React from "react";
import IconCompForCard from "./IconComp";
import DOMPurify from "dompurify";
import ClipmateReaderMode from "../ClipmateReaderMode";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { arrayUnion } from "firebase/firestore";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";

type Props = {
  value: IClipmateTwitter;
  inPopupView?: boolean;
};

const MemoizedClipmateNextImage = React.memo(ClipmateNextImage);

const ClipmateTwitterCard = React.memo(({ value, inPopupView }: Props) => {
  const { hasSelectedItems } = useMultipleItemActionAtom();
  const md = useMemo(
    () => markdownit({ linkify: true, breaks: true }).disable(["list", "heading", "lheading"]),
    []
  );
  const Purified = useMemo(
    () => DOMPurify.sanitize(value.data.post.note_tweet?.text || value.data.post.text),
    [value.data.post]
  );
  const full_html = useMemo(() => md.render(Purified), [Purified, md]);
  const html = useMemo(() => truncate(Purified, 150), [Purified]);

  const createMarkup = useCallback(() => {
    return { __html: inPopupView ? full_html : html };
  }, [inPopupView, full_html, html]);

  const { user } = FireAuthHooks.useGetUser();
  const { data } = FirestoreHooks.useGetDoc<IClipmateReaderMode>(
    ["users", user.uid, "reader"],
    value._id,
    { key: value._id }
  );

  const { mutate } = FirestoreHooks.useUpsertDoc<IClipmateReaderMode>(
    ["users", user.uid, "reader"],
    value._id,
    { key: value._id }
  );

  const handleHighlighting = (highlight: HighlightValue) => {
    const { _id, ...rest } = data as IClipmateReaderMode;

    mutate(
      { ...rest, highlights: arrayUnion(highlight) },
      {
        onSuccess: () => {
          toast.success("Highlight added");
          queryClient.refetchQueries({ queryKey: [value._id] });
        },
        onError: () => toast.error("Error adding highlight"),
      }
    );
  };

  return (
    <CardProvider url={value.data.url} value={value} inPopupView={inPopupView}>
      <CardContent className="flex flex-col gap-2 px-0 pt-0 pb-2">
        {/* Card Header */}
        <div
          className={cn(
            "p-2 pb-0 w-full grid grid-cols-[auto_16px] justify-between items-start",
            { "items-center": !inPopupView }
          )}
        >
          {/* Author */}
          <div className="flex items-center gap-1">
            <MemoizedClipmateNextImage
              className={cn("w-8 h-8 rounded-full", { "w-4 h-4": !inPopupView })}
              src={value.data.author.profile_image_url}
              alt={value.data.author.username}
              bgClass="rounded-full bg-cover bg-center bg-no-repeat"
            />
            <div className="grid px-1 font-normal">
              <p
                className={cn(
                  "text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap text-[#141414] dark:text-[#FAFAFA]",
                  { "text-xs": !inPopupView }
                )}
              >
                {value.data.author.name}
              </p>
              <p
                className={cn(
                  "text-muted-foreground text-xs text-ellipsis overflow-hidden whitespace-nowrap text-[#424242] dark:text-[#D6D6D6]",
                  { hidden: !inPopupView }
                )}
              >
                @{value.data.author.username}
              </p>
            </div>
          </div>

          {/* Icon Type */}
          <IconCompForCard
            size={16}
            hasSelectedItems={hasSelectedItems(value)}
            inPopupView={inPopupView}
            icon={value.type}
          />
        </div>

        <div className="flex flex-col gap-3 px-3 pl-2">
          {!inPopupView && (
            <div
              className={cn(
                "w-full text-sm truncate text-wrap text-[#424242] dark:text-[#D6D6D6]",
                { "text-xs": !inPopupView }
              )}
              dangerouslySetInnerHTML={createMarkup()}
            />
          )}

          {inPopupView && full_html && (
            <ClipmateReaderMode
              markdown={full_html}
              highlights={data?.highlights || []}
              onChange={(v) => handleHighlighting(v)}
              disableList={true}
              disableQuote={true}
            />
          )}
        </div>

        {/* Image Grid */}
        <div className="overflow-hidden rounded-md mx-2">
          <div
            className={cn(
              "w-full h-[200px] min-h-[200px] max-h-[300px] grid grid-cols-12 gap-1",
              {
                hidden: value.data.media.length === 0,
                "h-full min-h-full max-h-[500px]": inPopupView,
                "grid-cols-1 grid-rows-1": value.data.media.length === 1,
                "grid-flow-col grid-rows-4": value.data.media.length === 3,
                "grid-cols-12 grid-rows-4": value.data.media.length === 4,
              }
            )}
          >
            {value.data.media.map((media, index) => (
              <div
                className={cn("w-full h-full object-cover col-span-6 row-span-2", {
                  "row-span-auto": value.data.media.length !== 3,
                  "row-span-4": value.data.media.length === 3 && index === 2,
                })}
                key={`${media.media_key}-${index}`}
              >
                <MemoizedClipmateNextImage
                  className="object-cover w-full h-full"
                  src={media.preview_image_url ? media.preview_image_url : media.url}
                  alt={media.media_key}
                  bgClass="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </CardProvider>
  );
});

ClipmateTwitterCard.displayName = "ClipmateTwitterCard";

export default ClipmateTwitterCard;
