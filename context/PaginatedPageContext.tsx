import { PaginatedResult } from "@/app/api/firestore";
import { IClipmateResponse } from "@/types/clipmate";
import { DocumentData, QueryConstraint, QueryDocumentSnapshot } from "firebase/firestore";
import { createContext, Dispatch, SetStateAction } from "react";

type PaginatedPageContextType = {
  url: string[];
  identifier: string;
  constriant: QueryConstraint[];
  limit: QueryConstraint;
  data: IClipmateResponse[] | undefined;
  queryData: IClipmateResponse[] | undefined;
  count: number;
  cursor: QueryDocumentSnapshot<DocumentData> | null;
  search: IClipmateResponse[];
  searchMode: boolean;
  isLoading: boolean;
  isFetching: boolean;
  displayData: PaginatedResult<IClipmateResponse>;
  handleSearch: (value: string) => void;
  setData: Dispatch<SetStateAction<IClipmateResponse[]>>;
  setCount: Dispatch<SetStateAction<number>>;
  setCursor: Dispatch<SetStateAction<QueryDocumentSnapshot<DocumentData> | null>>;
  setSearchMode: Dispatch<SetStateAction<boolean>>;
};

const PaginatedPageContext = createContext<PaginatedPageContextType>(
  {} as PaginatedPageContextType
);

export type { PaginatedPageContextType };
export default PaginatedPageContext;
