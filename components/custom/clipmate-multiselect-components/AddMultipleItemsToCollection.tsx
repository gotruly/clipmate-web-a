import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IClipmateCollections } from "@/types/clipmate";
import { FolderPlus } from "@untitled-ui/icons-react";
import { useCallback, useState } from "react";
import { matchSorter } from "match-sorter";
import { isEmpty } from "lodash";
import ClipmateCreateCollection from "../ClipmateCreateCollection";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { where } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToggleCollectionProvider from "@/providers/ToggleCollectionProvider";
import DropdownAddToCollectionItem from "./DropdownAddToCollectionItem";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import { Command, CommandGroup, CommandInput, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
  disabled?: boolean;
};

const AddMultipleItemsToCollection = ({ disabled }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { selectedItems } = useMultipleItemActionAtom();

  const { user } = FireAuthHooks.useGetUser();
  const { data } = FirestoreHooks.useGetManyDocs<IClipmateCollections>(["collections"], {
    key: "getAllCollections",
    constraints: [where("user_id", "==", user.uid)],
  });

  const handleDialogClose = (open: boolean) => {
    setOpenDialog(open);
    setSearchValue("");
  };

  const handleDropdownChange = useCallback((open: boolean) => {
    setDropdownOpen(open);
    setSearchValue("");
  }, []);

  const handleEscapeOnInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") handleDropdownChange(false);
  };

  const sorted = data && data.sort((a, b) => a.name.localeCompare(b.name));
  const match = data && matchSorter(data, searchValue, { keys: ["name"] });

  return (
    <Dialog open={openDialog} onOpenChange={(b) => handleDialogClose(b)}>
      <Popover open={dropdownOpen} onOpenChange={(open) => handleDropdownChange(open)}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-[13px]"
          >
            <FolderPlus width={16} />
            <span>Add to Collection</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="center" sideOffset={15} className="p-0 w-[250px]">
          <Command className="overflow-auto">
            <CommandInput
              placeholder="Search"
              value={searchValue}
              onKeyUp={(e) => handleEscapeOnInput(e)}
              onValueChange={(value) => setSearchValue(value)}
              className="dark:bg-background h-10"
            />

            <CommandList className="max-h-full dark:bg-background overflow-clip">
              <div className={cn("px-1", { "border-b-[0.5px] border-border": !isEmpty(match) })}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    autoFocus={false}
                    className="flex items-center rounded-md justify-start gap-2 text-sm w-full my-1 px-2 hover:dark:bg-[#292929]"
                  >
                    <FolderPlus width={16} />
                    Create New Collection
                  </Button>
                </DialogTrigger>
              </div>

              <CommandGroup className="max-h-full dark:bg-background overflow-auto">
                <ScrollArea className="h-full max-h-[280px]">
                  {sorted &&
                    !isEmpty(sorted) &&
                    sorted.map((collection) => (
                      <ToggleCollectionProvider
                        key={collection._id}
                        collection={collection}
                        checked={selectedItems.every(
                          (i) => i.collections && i.collections[collection._id]
                        )}
                      >
                        <DropdownAddToCollectionItem
                          cid={collection.name}
                          hide={match && match?.length > 0 && !match?.includes(collection)}
                          onSelect={() => setDropdownOpen(false)}
                        />
                      </ToggleCollectionProvider>
                    ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <ClipmateCreateCollection setOpenDialog={(open) => setOpenDialog(open)} />
    </Dialog>
  );
};

export default AddMultipleItemsToCollection;
