"use client";

import { createContext } from "react";

type RestoreFromTrashContextType = {
  handleRestoreFromTrash: () => void;
};

const RestoreFromTrashContext = createContext<RestoreFromTrashContextType>(
  {} as RestoreFromTrashContextType
);

export type { RestoreFromTrashContextType };
export default RestoreFromTrashContext;
