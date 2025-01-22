/* eslint-disable @next/next/no-img-element */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IClipmateReddit } from "@/types/clipmate";
import IconPicker from "../../../../components/custom/IconPicker";
import markdownit from "markdown-it";
import truncate from "truncate-html";
import { ClipmateNextImage } from "../../../../components/custom/ClipmateImage";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  value: IClipmateReddit;
};

const ClipmateRedditServerCard = ({ value }: Props) => {
  const md = markdownit();
  const html = truncate(
    md.render(value.data.post?.selftext || ""),
    value.data.post.preview?.images.length > 0 ? 100 : 200
  );

  return (
    <Link href={value.data.url} target="_blank" referrerPolicy="no-referrer">
      <Card
        className={cn(
          "px-0 w-full h-fit cursor-default hover:bg-secondary hover:border-input transition-colors duration-300"
        )}
      >
        <CardContent className="flex flex-col gap-1 px-0 pt-0 pb-2">
          {/* Author / Post Header */}
          <div className="px-2.5 py-2 w-full grid grid-cols-[auto_22px] justify-between items-center">
            <p className="px-1 font-normal text-xs text-ellipsis overflow-hidden whitespace-nowrap">
              {value.data.post.subreddit_name_prefixed}
            </p>
            <div className="p-1">
              <IconPicker size={18} type={value.type} />
            </div>
          </div>

          {/* Post Content */}
          <div className="flex flex-col px-3 py-2 gap-1">
            <div>
              <p className="text-sm font-semibold text-ellipsis text-wrap whitespace-wrap">
                {value.data.post.title}
              </p>
            </div>
            <div
              className="text-sm text-wrap text-ellipsis overflow-hidden whitespace-nowrap w-full content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>

          {/* Image Grid */}
          <div
            className={cn(
              "overflow-hidden rounded-md mx-2 h-[200px] min-h-[200px] max-h-[200px]",
              { hidden: !value.data.post.thumbnail || value.data.post.thumbnail === "self" }
            )}
          >
            <ClipmateNextImage
              className="object-cover w-full h-full"
              src={value.data.post.thumbnail}
              alt={value.data.post.name}
            />
          </div>

          {/* Embeds  */}
          <div className="px-2">
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
                  <p className="text-sm px-2 font-semibold">
                    {value.data.post.media.oembed.title}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ClipmateRedditServerCard;
