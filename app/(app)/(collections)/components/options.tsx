import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontal, Edit02, Share04, Trash04 } from "@untitled-ui/icons-react";
import { IClipmateCollections } from "@/types/clipmate";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import DeleteCollectionConfirm from "./delete-form";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import EditDialog from "./edit-form";

type Props = {
  collection: IClipmateCollections;
};

const CollectionOptions = ({ collection }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={(b) => setDialogOpen(b)}>
      <AlertDialog open={open} onOpenChange={(b) => setOpen(b)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-8 p-0">
              <DotsHorizontal width={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-sm">
            <DropdownMenuItem asChild className="w-full flex items-center gap-2">
              <DialogTrigger>
                <Edit02 width={16} height={16} />
                Edit Collection
              </DialogTrigger>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="flex items-center gap-2 !text-destructive">
              <AlertDialogTrigger>
                <Trash04 width={16} height={16} />
                Delete Collection
              </AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DeleteCollectionConfirm collection={collection} setOpen={(b) => setOpen(b)} />
      </AlertDialog>

      <EditDialog collection={collection} setOpen={(b) => setDialogOpen(b)} />
    </Dialog>
  );
};

export default CollectionOptions;
