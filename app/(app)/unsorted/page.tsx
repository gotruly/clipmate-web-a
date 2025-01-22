import React from "react";
import dynamic from "next/dynamic";

const UnsortedSegment = dynamic(() => import("./segment"), { ssr: false });

const UnsortedPage = () => {
  return <UnsortedSegment />;
};

export default UnsortedPage;
