import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandInput, CommandList } from "@/components/ui/command";
import { IClipmateCollections, IClipmateResponse } from "@/types/clipmate";
import { FolderPlus } from "@untitled-ui/icons-react";
import { useCallback, useState } from "react";
import { matchSorter } from "match-sorter";
import { isEmpty } from "lodash";
import ClipmateCreateCollection from "../ClipmateCreateCollection";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { where } from "firebase/firestore";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToggleCollectionProvider from "@/providers/ToggleCollectionProvider";
import DropdownAddToCollectionItem from "../clipmate-multiselect-components/DropdownAddToCollectionItem";
import ClipmateKeyboardShortcut from "../ClipmateKeyboardShortcut";
import useSidebarAtom from "@/stores/SidebarStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  disabled?: boolean;
  handleNext?: () => void;
};

const FullViewClipmateCollectionsDropdown = ({ disabled, handleNext }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { item, setCollectionsOpen, collectionsOpen, setHoverOnTrigger } = useSidebarAtom();

  const { user } = FireAuthHooks.useGetUser();
  const { data } = FirestoreHooks.useGetManyDocs<IClipmateCollections>(["collections"], {
    key: "getAllCollections",
    constraints: [where("user_id", "==", user.uid)],
  });

  const handleDialogClose = (open: boolean) => {
    setOpenDialog(open);
    setSearchValue("");
  };

  const handleDropdownChange = useCallback(
    (open: boolean) => {
      setCollectionsOpen(open);
      setSearchValue("");
    },
    [setCollectionsOpen]
  );

  const handleEscapeOnInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") handleDropdownChange(false);
  };

  const sorted = data && data.sort((a, b) => a.name.localeCompare(b.name));
  const match = data && matchSorter(data, searchValue, { keys: ["name"] });

  return (
    <Dialog open={openDialog} onOpenChange={(b) => handleDialogClose(b)}>
      <Popover open={collectionsOpen} onOpenChange={(open) => setCollectionsOpen(open)}>
        <PopoverTrigger
          disabled={disabled}
          onMouseOver={() => setHoverOnTrigger(true)}
          onMouseLeave={() => setHoverOnTrigger(false)}
        >
          <ClipmateKeyboardShortcut keys={["⌘", "I"]} text="Add to Collection" />
        </PopoverTrigger>

        <PopoverContent
          align="center"
          sideOffset={15}
          className="dark:bg-background p-0 w-[250px] !z-[100]"
        >
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
                    className="flex items-center rounded-md justify-start gap-2 text-sm w-full my-1 px-2"
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
                        value={item as IClipmateResponse}
                        checked={[item as IClipmateResponse].every(
                          (i) => i.collections && i.collections[collection._id]
                        )}
                      >
                        <DropdownAddToCollectionItem
                          cid={collection.name}
                          hide={match && match?.length > 0 && !match?.includes(collection)}
                          onSelect={() => {
                            handleNext && handleNext();
                            handleDropdownChange(false);
                          }}
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

export default FullViewClipmateCollectionsDropdown;
