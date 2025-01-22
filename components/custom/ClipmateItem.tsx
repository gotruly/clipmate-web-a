/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react"; // Import useCallback
import ClipmateResolvedCard from "./ClipmateResolvedCard";

type Props = {
  value: any;
};

const ClipmateItem = React.memo(({ value }: Props) => {
  return (
    <>
      {/* The Actual Clipmate Card = Resolved - serves as the trigger */}
      <ClipmateResolvedCard value={value} />
    </>
  );
});

ClipmateItem.displayName = "ClipmateItem";

export default ClipmateItem;
