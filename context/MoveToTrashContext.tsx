"use client";

import { createContext } from "react";

type MoveToTrashContextType = {
  handleMoveToTrash: () => void;
};

const MoveToTrashContext = createContext<MoveToTrashContextType>({} as MoveToTrashContextType);

export type { MoveToTrashContextType };
export default MoveToTrashContext;
