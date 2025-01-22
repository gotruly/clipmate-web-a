/**
 * Resolves the data into it's respective cards
 * @returns { JSX.Element | null }
 */
"use client";

import ClipmateGithubServerCard from "./clipmate-server-cards/ClipmateGithubServer";
import ClipmateLinkServerCard from "./clipmate-server-cards/ClipmateLinkServer";
import ClipmatePDFServerCard from "./clipmate-server-cards/ClipmatePDFServer";
import ClipmateRedditServerCard from "./clipmate-server-cards/ClipmateRedditServer";
import ClipmateTwitterServerCard from "./clipmate-server-cards/ClipmateTwitterServer";

type Props = {
  value: any;
};

const ClipmateResolvedServerCard = ({ value }: Props): JSX.Element | null => {
  if (value.type === "twitter") return <ClipmateTwitterServerCard value={value} />;
  if (value.type === "reddit") return <ClipmateRedditServerCard value={value} />;
  if (value.type === "link") return <ClipmateLinkServerCard value={value} />;
  if (value.type === "PDF") return <ClipmatePDFServerCard value={value} />;
  if (value.type === "github") return <ClipmateGithubServerCard value={value} />;
  else return null;
};

export default ClipmateResolvedServerCard;
