/* eslint-disable @next/next/no-img-element */
"use client";

import { CardContent } from "@/components/ui/card";
import { HighlightValue, IClipmateReaderMode, IClipmateReddit } from "@/types/clipmate";
import markdownit from "markdown-it";
import truncate from "truncate-html";
import { ClipmateNextImage } from "../ClipmateImage";
import React, { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import CardProvider from "@/providers/CardProvider";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import IconCompForCard from "./IconComp";
import DOMPurify from "dompurify";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { arrayUnion } from "firebase/firestore";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import ClipmateReaderMode from "../ClipmateReaderMode";

type Props = {
  value: IClipmateReddit;
  inPopupView?: boolean;
};

const MemoizedClipmateNextImage = React.memo(ClipmateNextImage);

const ClipmateRedditCard = React.memo(({ value, inPopupView }: Props) => {
  const { hasSelectedItems } = useMultipleItemActionAtom();

  const md = useMemo(() => markdownit({ linkify: false }), []);
  const Purified = useMemo(
    () => DOMPurify.sanitize(value.data.post?.selftext || value.data.post?.body || ""),
    [value.data.post]
  );
  const html = useMemo(() => truncate(md.render(Purified), 150), [md, Purified]);
  const full_html = useMemo(() => md.render(Purified), [md, Purified]);

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
        {/* Author / Post Header */}
        <div className="px-2.5 py-2 pb-0 w-full grid grid-cols-[auto_16px] justify-between items-center">
          <p className="px-1 font-semibold text-xs text-ellipsis overflow-hidden whitespace-nowrap text-[#141414] dark:text-[#FAFAFA]">
            {value.data.post.subreddit_name_prefixed}
          </p>

          <IconCompForCard
            size={16}
            hasSelectedItems={hasSelectedItems(value)}
            inPopupView={inPopupView}
            icon={value.type}
          />
        </div>

        {/* Post Content */}
        <div className="grid px-3 gap-1 w-full">
          <div>
            <p
              className={cn(
                "text-sm font-semibold text-ellipsis text-wrap whitespace-wrap break-words text-[#141414] dark:text-[#FAFAFA]",
                { "text-xs": !inPopupView }
              )}
            >
              {value.data.post.title}
            </p>
          </div>
          {!inPopupView && (
            <div
              className={cn(
                "text-sm text-wrap text-ellipsis overflow-hidden content-reddit grid gap-1 pointer-events-none text-[#424242] dark:text-[#D6D6D6]",
                { "text-xs": !inPopupView }
              )}
              dangerouslySetInnerHTML={createMarkup()}
            />
          )}

          {inPopupView && full_html && (
            <div className="max-for-popupview">
              <ClipmateReaderMode
                markdown={full_html}
                highlights={data?.highlights || []}
                onChange={(v) => handleHighlighting(v)}
                disableQuote={true}
              />
            </div>
          )}
        </div>

        {/* Image Grid */}
        <div
          className={cn("overflow-hidden rounded-md mx-2 h-[200px] min-h-[200px] max-h-[200px]", {
            hidden: value.data.post.thumbnail === "self" || !value.data.post.thumbnail,
            "h-full min-h-full max-h-[400px]": inPopupView,
          })}
        >
          <MemoizedClipmateNextImage
            className="object-cover w-full h-full"
            src={value.data.post.thumbnail}
            alt={value.data.post.name}
            bgClass=" w-full h-full"
          />
        </div>

        {/* Embeds  */}
        {/* <div className="px-2">
          {value.data.post.media?.oembed && (
            <Card className="w-fit h-full p-0">
              <CardContent className="p-0 flex flex-col gap-2 pb-2">
                <ClipmateNextImage
                  className="w-full h-full object-cover rounded-md rounded-b-none"
                  src={value.data.post.media?.oembed.thumbnail_url}
                  alt={value.data.post.media.type}
                />
                <p className="text-xs px-2 text-gray-400 dark:text-gray-600">
                  {value.data.post.media.type}
                </p>
                <p className="text-sm px-2 font-semibold">{value.data.post.media.oembed.title}</p>
              </CardContent>
            </Card>
          )}
        </div> */}
      </CardContent>
    </CardProvider>
  );
});

ClipmateRedditCard.displayName = "ClipmateRedditCard";

export default ClipmateRedditCard;
