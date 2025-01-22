"use client";

import { UploadTask } from "firebase/storage";
import { Dispatch, SetStateAction, createContext } from "react";

type FileType = {
  file: File;
  task: UploadTask;
};

type DragNDropFromOSContextType = {
  files: (FileType | null)[];
  openDialog: boolean;
  setFiles: Dispatch<SetStateAction<(FileType | null)[]>>;
  setFilesFromForm: (files: FileList) => void;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

const DragNDropFromOSContext = createContext<DragNDropFromOSContextType>(
  {} as DragNDropFromOSContextType
);

export type { FileType, DragNDropFromOSContextType };
export default DragNDropFromOSContext;
