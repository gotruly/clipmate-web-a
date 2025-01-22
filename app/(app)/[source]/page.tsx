import React from "react";
import dynamic from "next/dynamic";

const SourceSegment = dynamic(() => import("./segment"), { ssr: false });

const SourcePage = ({ params }: { params: { source: string } }) => {
  return <SourceSegment params={params} />;
};

export const generateStaticParams = async () => {
  const sources = ["twitter", "reddit", "github", "link", "PDF", "screenshot"];

  return sources.map((source) => ({ source: source }));
};

export default SourcePage;
