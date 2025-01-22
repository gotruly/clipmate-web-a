"use client";

import React, { useMemo } from "react";
import FireAuthHooks from "../../api/hooks/fireauth";
import { limit, where, orderBy } from "firebase/firestore";
import PaginatedPageProvider from "@/providers/PaginatedPageProvider";
import Unsorted from "./components/main";
import { FullPostPopupProvider } from "@/providers/FullPostPopupProvider";
import useGlobalStore from "@/stores/GlobalStore";

const UnsortedSegment = () => {
  const { user } = FireAuthHooks.useGetUser();
  const { getStorePlaceholderValue } = useGlobalStore();

  const Placeholder = useMemo(
    () => getStorePlaceholderValue("getAllClipmateUnsortedItems"),
    [getStorePlaceholderValue]
  );

  return (
    <PaginatedPageProvider
      url={["users", user.uid, "bookmarks"]}
      constriant={[
        where("collections", "==", {}),
        where("inbox", "==", "default"),
        orderBy("date_smart", "desc"),
      ]}
      limit={limit(100)}
      identifier="getAllClipmateUnsortedItems"
      search_constraint={[where("collections", "==", {})]}
      placeholder={Placeholder}
    >
      <FullPostPopupProvider>
        <Unsorted />
      </FullPostPopupProvider>
    </PaginatedPageProvider>
  );
};

export default UnsortedSegment;
