import FireFunctionHooks from "@/app/api/hooks/firefunction";
import FirestoreHooks from "@/app/api/hooks/firestore";
import PaginatedPageContext from "@/context/PaginatedPageContext";
import queryClient from "@/lib/queryClient";
import { scrollToTop } from "@/lib/utils";
import useGlobalStore from "@/stores/GlobalStore";
import { IClipmateResponse } from "@/types/clipmate";
import { DocumentData, QueryConstraint, QueryDocumentSnapshot } from "firebase/firestore";
import { isEmpty } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
  url: string[];
  constriant: QueryConstraint[];
  limit: QueryConstraint;
  children: React.ReactNode;
  identifier: string;
  search_type?: string[];
  search_constraint?: QueryConstraint[];
  placeholder?: any;
};

const PaginatedPageProvider = React.memo(
  ({
    url,
    constriant,
    limit,
    children,
    identifier,
    search_type = [],
    search_constraint = [],
    placeholder,
  }: Props) => {
    const { store, setStore, handleAddItemToPair, handleAddNewPair } = useGlobalStore();

    const [data, setData] = useState<IClipmateResponse[]>([]);
    const [search, setSearch] = useState<IClipmateResponse[]>([]);
    const [searchMode, setSearchMode] = useState<boolean>(false);
    const [count, setCount] = useState<number>(0);
    const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

    const { mutate, isPending } = FireFunctionHooks.useSearch();

    const All = FirestoreHooks.useGetManyPaginatedDocs<IClipmateResponse>(
      url,
      {
        key: identifier,
        constraints: [...constriant, limit],
        placeholder,
      },
      cursor,
      [...constriant]
    );

    const Searched = FirestoreHooks.useGetManySearchDocs<IClipmateResponse>(url, {
      key: "getAllSearchItems",
      constraints: [...search_constraint],
    });

    const handleSearch = (value: string) => {
      if (value) {
        queryClient.setQueryData(["getAllSearchItems"], []);
        queryClient.invalidateQueries({ queryKey: ["getAllSearchItems"] });
        setSearchMode(true);

        mutate(
          { query: value, type_filter: search_type },
          {
            onSuccess: (res) => {
              Searched.mutate(
                res.bookmarks.map((value) => value.id),
                {
                  onSuccess: (res) => {
                    setSearch(res);
                    scrollToTop(".clipmate-grid > div");
                  },
                }
              );
            },
          }
        );
      } else {
        setSearchMode(false);
      }
    };

    const isLoading =
      (All.isPlaceholderData && isEmpty(store[identifier]?.data)) ||
      ((Searched.isPending || isPending) && !cursor);

    const displayData = useMemo(() => {
      if (searchMode && search) {
        return {
          data: search,
          lastVisible: null,
          count: 0,
        };
      } else {
        return {
          data: store[identifier]?.data || [],
          lastVisible: All.data?.lastVisible || null,
          count: store[identifier]?.count || 0,
        };
      }
    }, [searchMode, search, store, identifier, All.data?.lastVisible]);

    useEffect(() => {
      if (cursor) {
        handleAddItemToPair(identifier, All.data?.data || [], All.data?.count);
      } else {
        handleAddNewPair(identifier, All.data?.data || [], All.data?.count || 0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [All.data?.data, All.data?.count, cursor, identifier]);

    // Memoize the value object
    const contextValue = useMemo(
      () => ({
        url,
        identifier,
        constriant,
        limit,
        data: store[identifier]?.data,
        queryData: All.data?.data,
        search,
        searchMode,
        cursor,
        count: store[identifier]?.count,
        isLoading,
        isFetching: All.isFetching,
        displayData,
        setData,
        setCount,
        setCursor,
        setSearchMode,
        handleSearch,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        url,
        identifier,
        constriant,
        limit,
        store,
        All.data?.data,
        search,
        searchMode,
        cursor,
        isLoading,
        All.isFetching,
        displayData,
      ]
    );

    return (
      <PaginatedPageContext.Provider value={contextValue}>
        {children}
      </PaginatedPageContext.Provider>
    );
  }
);

PaginatedPageProvider.displayName = "PaginatedPageProvider";

export default PaginatedPageProvider;
