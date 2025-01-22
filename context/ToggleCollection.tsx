import { IClipmateCollections } from "@/types/clipmate";
import { createContext, Dispatch, SetStateAction } from "react";

type ToggleCollectionContextType = {
  isChecked: boolean;
  isAdding: boolean;
  isRemoving: boolean;
  collection: IClipmateCollections;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  handleAddToCollection: () => void;
  handleRemoveFromCollection: () => void;
};

const ToggleCollectionContext = createContext({} as ToggleCollectionContextType);

export type { ToggleCollectionContextType };
export default ToggleCollectionContext;
