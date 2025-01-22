import React from "react";
import ClipmateIcon from "../icons/clipmate";
import TimeoutWrapper from "./TimeoutWrapper";

const Loading = React.memo(() => {
  return (
    <TimeoutWrapper>
      <div className="w-fit h-fit relative">
        <div className="absolute block top-0 left-0 w-full h-full rounded-xl border border-border bg-transparent motion-safe:animate-ping z-5" />
        <ClipmateIcon width={40} height={40} className="rounded-xl z-10" />
      </div>
    </TimeoutWrapper>
  );
});

Loading.displayName = "Loading";

export default Loading;
