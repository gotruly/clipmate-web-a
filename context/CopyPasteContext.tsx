"use client";

import { Dispatch, SetStateAction, createContext } from "react";

type CopyPasteContextType = {
  text: string;
  openDialog: boolean;
  setText: Dispatch<SetStateAction<string>>;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

const CopyPasteContext = createContext<CopyPasteContextType>({} as CopyPasteContextType);

export type { CopyPasteContextType };
export default CopyPasteContext;
