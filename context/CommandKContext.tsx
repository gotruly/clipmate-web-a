"use client";

import { Dispatch, SetStateAction, createContext } from "react";

type CommandKContextType = {
  openDialog: boolean;
  levelTwo: boolean;
  levelID?: string;
  search: string;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  setLevelTwo: Dispatch<SetStateAction<boolean>>;
  setLevelID: Dispatch<SetStateAction<string | undefined>>;
  setSearch: Dispatch<SetStateAction<string>>;
  handleLevelTwo: (id: string | undefined, open: boolean) => void;
  goToNext: () => void;
};

const CommandKContext = createContext<CommandKContextType>({} as CommandKContextType);

export type { CommandKContextType };
export default CommandKContext;
