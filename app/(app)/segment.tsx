"use client";

import PaginatedPageProvider from "@/providers/PaginatedPageProvider";
import MainView from "./components/MainView";
import { limit, orderBy, where } from "firebase/firestore";
import FireAuthHooks from "../api/hooks/fireauth";
import { FullPostPopupProvider } from "@/providers/FullPostPopupProvider";
import useGlobalStore from "@/stores/GlobalStore";
import { useMemo } from "react";

const AllItemsSegment = () => {
  const { user } = FireAuthHooks.useGetUser();
  const { getStorePlaceholderValue } = useGlobalStore();

  const Placeholder = useMemo(
    () => getStorePlaceholderValue("getAllClipmateItems"),
    [getStorePlaceholderValue]
  );

  return (
    <PaginatedPageProvider
      url={["users", user.uid, "bookmarks"]}
      constriant={[where("inbox", "==", "default"), orderBy("date_added", "desc")]}
      limit={limit(100)}
      identifier="getAllClipmateItems"
      placeholder={Placeholder}
    >
      <FullPostPopupProvider>
        <div className="w-full h-full">
          <MainView />
        </div>
      </FullPostPopupProvider>
    </PaginatedPageProvider>
  );
};

export default AllItemsSegment;
