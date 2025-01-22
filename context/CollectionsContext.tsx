"use client";

import { Dispatch, SetStateAction, createContext } from "react";

type CollectionsContextType = {
  openDialog: boolean;
  selected: string[];
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  handleSelectedChange: (id: string) => void;
};

const CollectionsContext = createContext<CollectionsContextType>({} as CollectionsContextType);

export type { CollectionsContextType };
export default CollectionsContext;
