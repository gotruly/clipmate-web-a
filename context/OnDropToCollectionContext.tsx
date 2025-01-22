import { IClipmateCollections } from "@/types/clipmate";
import { createContext, Dispatch, SetStateAction } from "react";

type OnDropToCollectionContextType = {
  collection: IClipmateCollections;
  handleAddToCollection: () => void;
};

const OnDropToCollectionContext = createContext({} as OnDropToCollectionContextType);

export type { OnDropToCollectionContextType };
export default OnDropToCollectionContext;
