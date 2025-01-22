import React from "react";
import dynamic from "next/dynamic";

const TrashSegment = dynamic(() => import("./segment"), { ssr: false });

const TrashPage = () => {
  return <TrashSegment />;
};

export default TrashPage;
