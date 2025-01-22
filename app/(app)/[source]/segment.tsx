"use client";

import React, { useMemo } from "react";
import FireAuthHooks from "../../api/hooks/fireauth";
import { limit, orderBy, where } from "firebase/firestore";
import { useValidSlug } from "@/lib/hooks";
import Source from "./components/main";
import { FullPostPopupProvider } from "@/providers/FullPostPopupProvider";
import useSourcesStore from "@/stores/SourcesStore";
import SourcesPaginateProvider from "@/providers/SourcesPaginateProvider";

const SourceSegment = ({ params }: { params: { source: string } }) => {
  // Make sure the user is hitting a slug that exist before
  // they are allowed to do anything;
  useValidSlug(params.source);

  const { user } = FireAuthHooks.useGetUser();
  const { getStorePlaceholderValue } = useSourcesStore();

  const Placeholder = useMemo(
    () => getStorePlaceholderValue(params.source),
    [getStorePlaceholderValue, params.source]
  );

  return (
    <SourcesPaginateProvider
      url={["users", user.uid, "bookmarks"]}
      constriant={[
        where("type", "==", params.source),
        where("inbox", "==", "default"),
        orderBy("date_smart", "desc"),
      ]}
      limit={limit(100)}
      identifier={params.source}
      search_type={[params.source]}
      placeholder={Placeholder}
    >
      <FullPostPopupProvider>
        <Source params={params} />
      </FullPostPopupProvider>
    </SourcesPaginateProvider>
  );
};

export const generateStaticParams = async () => {
  const sources = ["twitter", "reddit", "github", "link", "PDF"];

  return sources.map((source) => ({ source: source }));
};

export default SourceSegment;
