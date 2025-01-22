"use client";

import React, { useMemo } from "react";
import FireAuthHooks from "../../api/hooks/fireauth";
import { limit, where, orderBy } from "firebase/firestore";
import PaginatedPageProvider from "@/providers/PaginatedPageProvider";
import Trash from "./components/main";
import { FullPostPopupProvider } from "@/providers/FullPostPopupProvider";
import useGlobalStore from "@/stores/GlobalStore";

const TrashSegment = () => {
  const { user } = FireAuthHooks.useGetUser();
  const { getStorePlaceholderValue } = useGlobalStore();

  const Placeholder = useMemo(
    () => getStorePlaceholderValue("getAllClipmateTrashItems"),
    [getStorePlaceholderValue]
  );

  return (
    <PaginatedPageProvider
      url={["users", user.uid, "bookmarks"]}
      constriant={[where("inbox", "==", "trash"), orderBy("date_smart", "desc")]}
      limit={limit(100)}
      identifier="getAllClipmateTrashItems"
      search_constraint={[where("inbox", "==", "trash")]}
      placeholder={Placeholder}
    >
      <FullPostPopupProvider>
        <Trash />
      </FullPostPopupProvider>
    </PaginatedPageProvider>
  );
};

export default TrashSegment;
