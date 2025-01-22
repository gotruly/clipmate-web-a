"use client";

import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import CollectionsContext from "@/context/CollectionsContext";
import { useCollectionsContext } from "@/lib/hooks";
import ClipmateCreateCollection from "@/components/custom/ClipmateCreateCollection";

export const CollectionAction = () => {
  const { openDialog, setOpenDialog } = useCollectionsContext();

  return (
    <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
      <ClipmateCreateCollection setOpenDialog={(open) => setOpenDialog(open)} />
    </Dialog>
  );
};

const CollectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelectedChange = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      return [...prev, id];
    });
  };

  return (
    <CollectionsContext.Provider
      value={{ openDialog, selected, setOpenDialog, handleSelectedChange }}
    >
      <CollectionAction />
      {children}
    </CollectionsContext.Provider>
  );
};

export default CollectionProvider;
