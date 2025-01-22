"use client";

import { IClipmateCollections, IClipmateResponse } from "@/types/clipmate";
import TryNowCTA from "./TryNowCTA";
import Banner from "./Banner";
import Grid from "./Grid";

import { useEffect, useState } from "react";
import { throttle } from "lodash";

type Props = {
  params: { id: string; uid: string };
  info: IClipmateCollections;
  bookmarks: IClipmateResponse[];
};

const Main = ({ params, info, bookmarks }: Props) => {
  const [goingDown, setGoingDown] = useState<boolean>(false);

  useEffect(() => {
    const prevScrollPosition = 0;

    const isScrollingDown = () => {
      let goingDown = false;
      const scrollPosition = window.scrollY;
      if (scrollPosition > prevScrollPosition) goingDown = true;
      return goingDown;
    };

    const handleScroll = () => {
      if (isScrollingDown()) setGoingDown(true);
      else setGoingDown(false);
    };

    const throttledHandleScroll = throttle(handleScroll, 100);

    window.addEventListener("scroll", throttledHandleScroll);

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, []);

  return (
    <div className="w-full h-full pb-12 lg:pb-10">
      <TryNowCTA />

      <Banner params={params} info={info} goingDown={goingDown} />

      <Grid info={info} bookmarks={bookmarks} />
    </div>
  );
};

export default Main;
