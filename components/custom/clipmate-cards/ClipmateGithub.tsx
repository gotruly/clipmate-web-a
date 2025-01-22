/* eslint-disable @next/next/no-img-element */
"use client";

import { CardContent } from "@/components/ui/card";
import { IClipmateGithub } from "@/types/clipmate";
import { ClipmateNextImage } from "../ClipmateImage";
import CardProvider from "@/providers/CardProvider";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import React from "react";
import { Star01 } from "@untitled-ui/icons-react";
import IssuesOpenedIcon from "@/components/icons/issues-opened";
import RepoForkedIcon from "@/components/icons/repo-forked";
import numabbr from "numabbr";
import GITHUB_LANG_COLORS from "@/lib/github-lang-colors";
import { cn } from "@/lib/utils";
import IconCompForCard from "./IconComp";

type Props = {
  value: IClipmateGithub;
  inPopupView?: boolean;
};

const ClipmateGithubCard = React.memo(({ value, inPopupView }: Props) => {
  const { hasSelectedItems } = useMultipleItemActionAtom();
  const [username, repo_name] = value.data.repo.full_name.split("/");

  return (
    <CardProvider url={value.data.url} value={value} inPopupView={inPopupView}>
      <CardContent className="flex flex-col gap-1 px-0 pt-0 pb-1 overflow-hidden">
        {/* Domain & Image */}
        <div
          className={cn(
            "px-2.5 pt-2 w-full grid grid-cols-[20px_1fr_16px] gap-1.5 justify-between items-center",
            { "grid-cols-[40px_1fr_16px]": inPopupView }
          )}
        >
          <ClipmateNextImage
            src={value.data.repo.owner.avatar_url}
            alt="avatar"
            className={cn("rounded-full w-[20px] h-[20px]", { "w-[40px] h-[40px]": inPopupView })}
            bgClass={cn("rounded-full w-[20px] h-[20px]", { "w-[40px] h-[40px]": inPopupView })}
          />

          <div
            className={cn("font-normal text-sm truncate text-[#141414] dark:text-[#FAFAFA]", {
              "text-xs": !inPopupView,
            })}
          >
            <span>{username}</span>/<span className="font-bold">{repo_name}</span>
          </div>

          <IconCompForCard
            size={16}
            hasSelectedItems={hasSelectedItems(value)}
            inPopupView={inPopupView}
            icon={value.type}
          />
        </div>

        {/* Post Content */}
        <div className="flex flex-col px-3 py-2 gap-1">
          {value.data.repo.description && (
            <p
              className={cn(
                "text-sm text-wrap text-ellipsis overflow-hidden whitespace-nowrap w-full content break-words text-[#424242] dark:text-[#D6D6D6]",
                { "text-xs": !inPopupView }
              )}
            >
              {inPopupView
                ? value.data.repo.description
                : value.data.repo.description.slice(0, 125)}
              {value.data.repo.description.length > 125 && !inPopupView && "..."}
            </p>
          )}
        </div>

        {/* Language */}
        {value.data.repo.language && (
          <div className="grid grid-cols-[10px_auto] gap-1 items-center text-xs px-3 pb-1">
            <div
              className={cn("w-[10px] h-[10px] rounded-full")}
              style={{
                backgroundColor:
                  GITHUB_LANG_COLORS[value.data.repo.language]?.color || "var(--color-primary)",
              }}
            />
            <p className="truncate font-semibold opacity-70">{value.data.repo.language}</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-3 px-3 items-center text-xs font-semibold opacity-70">
          <div className="grid grid-cols-[15px_1fr] items-center gap-1">
            <Star01 width={15} />
            <p className="truncate mt-0.5">{numabbr(value.data.repo.stargazers_count)}</p>
          </div>

          <div className="grid grid-cols-[15px_1fr] items-center gap-1">
            <IssuesOpenedIcon width={15} height={15} />
            <p className="truncate mt-0.5">{numabbr(value.data.repo.open_issues_count)}</p>
          </div>

          <div className="grid grid-cols-[15px_1fr] items-center gap-1">
            <RepoForkedIcon width={15} height={15} />
            <p className="truncate mt-0.5">{numabbr(value.data.repo.forks_count)}</p>
          </div>
        </div>
      </CardContent>
    </CardProvider>
  );
});

ClipmateGithubCard.displayName = "ClipmateGithubCard";

export default ClipmateGithubCard;
