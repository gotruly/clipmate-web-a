"use client";

import { cn } from "@/lib/utils";
import { memo, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  showAfter?: number;
};

const TimeoutWrapper = memo(({ children, showAfter = 750 }: Props) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);

    const timer = setTimeout(() => {
      setShow(true);
    }, showAfter);

    return () => {
      clearTimeout(timer);
    };
  }, [showAfter]);

  return (
    <div
      className={cn("w-full h-full flex items-center justify-center gap-2", { hidden: !show })}
    >
      {children}
    </div>
  );
});

TimeoutWrapper.displayName = "TimeoutWrapper";

export default TimeoutWrapper;
