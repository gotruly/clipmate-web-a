"use client";

import TwitterEmptyState from "./SourcesEmptyStates/TwitterEmpty";
import RedditEmptyState from "./SourcesEmptyStates/RedditEmpty";
import LinkEmptyState from "./SourcesEmptyStates/LinkEmpty";
import PDFEmptyState from "./SourcesEmptyStates/PDFEmpty";
import GithubEmptyState from "./SourcesEmptyStates/GithubEmpty";
import ScreenshotEmptyState from "./SourcesEmptyStates/ScreenshotEmpty";

type Props = {
  type: string;
};

const SourcesEmptyState = ({ type }: Props) => {
  const States: Record<string, () => JSX.Element> = {
    twitter: TwitterEmptyState,
    reddit: RedditEmptyState,
    github: GithubEmptyState,
    link: LinkEmptyState,
    PDF: PDFEmptyState,
    screenshot: ScreenshotEmptyState,
  };

  const Resolved = States[type];

  return <Resolved />;
};

export default SourcesEmptyState;
