"use client";

import { CommandGroup } from "@/components/ui/command";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import useSidebarAtom from "@/stores/SidebarStore";
import { isEmpty } from "lodash";
import CommandKAddToCollectionItem from "./CommandKAddToCollectionItem";
import ToggleCollectionProvider from "../ToggleCollectionProvider";

export const CommandKAddToCollectionGroup = () => {
  const { item } = useSidebarAtom();
  const { selectedItems } = useMultipleItemActionAtom();
  const { store } = useCollectionDetailsStore();

  const sorted = Object.values(store).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      {(!isEmpty(selectedItems) || item !== null) && (
        <CommandGroup heading="Add to Collection" className="!px-2">
          {sorted.map((collection, index) => (
            <ToggleCollectionProvider
              key={index}
              collection={collection}
              value={item || undefined}
              checked={false}
            >
              <CommandKAddToCollectionItem />
            </ToggleCollectionProvider>
          ))}
        </CommandGroup>
      )}
    </>
  );
};

export default CommandKAddToCollectionGroup;
