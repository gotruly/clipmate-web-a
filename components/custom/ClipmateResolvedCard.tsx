/**
 * Resolves the data into it's respective cards
 * @returns { JSX.Element | null }
 */
"use client";

import ClipmateTwitterCard from "./clipmate-cards/ClipmateTwitter";
import ClipmateRedditCard from "./clipmate-cards/ClipmateReddit";
import ClipmateLinkCard from "./clipmate-cards/ClipmateLink";
import ClipmatePDFCard from "./clipmate-cards/ClipmatePDF";
import React from "react";
import ClipmateGithubCard from "./clipmate-cards/ClipmateGithub";
import ClipmateScreenshotCard from "./clipmate-cards/ClipmateScreenshot";

type Props = {
  value: any;
  inPopupView?: boolean;
};

const ClipmateResolvedCard = React.memo(({ value, inPopupView }: Props): JSX.Element | null => {
  const { type } = value;

  if (type === "twitter") return <ClipmateTwitterCard value={value} inPopupView={inPopupView} />;
  if (type === "reddit") return <ClipmateRedditCard value={value} inPopupView={inPopupView} />;
  if (type === "link") return <ClipmateLinkCard value={value} inPopupView={inPopupView} />;
  if (type === "PDF") return <ClipmatePDFCard value={value} inPopupView={inPopupView} />;
  if (type === "github") return <ClipmateGithubCard value={value} inPopupView={inPopupView} />;
  if (type === "screenshot")
    return <ClipmateScreenshotCard value={value} inPopupView={inPopupView} />;
  else return null;
});

ClipmateResolvedCard.displayName = "ClipmateResolvedCard";

export default ClipmateResolvedCard;
