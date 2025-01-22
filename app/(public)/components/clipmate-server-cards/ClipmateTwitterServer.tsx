/* eslint-disable @next/next/no-img-element */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IClipmateTwitter } from "@/types/clipmate";
import markdownit from "markdown-it";
import truncate from "truncate-html";
import IconPicker from "../../../../components/custom/IconPicker";
import { cn } from "@/lib/utils";
import { ClipmateNextImage } from "../../../../components/custom/ClipmateImage";
import Link from "next/link";

type Props = {
  value: IClipmateTwitter;
};

const ClipmateTwitterServerCard = ({ value }: Props) => {
  const md = markdownit();
  const html = truncate(md.render(value.data.post.text), value.data.media.length > 0 ? 150 : 200);

  return (
    <Link href={value.data.url} target="_blank" referrerPolicy="no-referrer">
      <Card
        id={value._id}
        className={cn(
          "px-0 w-full h-fit cursor-default hover:bg-secondary hover:border-input transition-colors duration-300"
        )}
      >
        <CardContent className="flex flex-col gap-1 px-0 pt-0 pb-2">
          {/* Card Header */}
          <div className="p-2 w-full grid grid-cols-[auto_22px] justify-between items-start">
            {/* Author */}
            <div className="flex items-center gap-1">
              <div
                className="w-8 h-8 rounded-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${value.data.author.profile_image_url})` }}
              />
              <div className="grid px-1 font-normal">
                <p className="text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                  {value.data.author.name}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs text-ellipsis overflow-hidden whitespace-nowrap">
                  @{value.data.author.username}
                </p>
              </div>
            </div>

            {/* Icon Type */}
            <div className="p-1">
              <IconPicker size={18} type={value.type} />
            </div>
          </div>

          <div className="flex flex-col gap-3 px-3 py-2">
            <div
              className="text-sm truncate text-wrap group:truncate content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>

          {/* Image Grid */}
          <div className="overflow-hidden rounded-md mx-2">
            <div
              className={cn(
                "w-full h-[200px] min-h-[150px] max-h-[300px] grid grid-cols-12 gap-1",
                {
                  hidden: value.data.media.length === 0,
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
                  key={media.media_key}
                >
                  <ClipmateNextImage
                    className="object-cover w-full h-full"
                    src={media.preview_image_url ? media.preview_image_url : media.url}
                    alt={media.media_key}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ClipmateTwitterServerCard;
