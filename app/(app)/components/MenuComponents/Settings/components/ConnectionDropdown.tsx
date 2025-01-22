import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DotsHorizontal } from "@untitled-ui/icons-react";
import { useState } from "react";

type Action = {
  label: string;
  onClick: () => void;
  isDestructive?: boolean;
};

type DropdownProps = {
  actions: Action[];
  isPending?: boolean;
  disabled?: boolean;
};

const ConnectionDropdown = ({ actions, isPending, disabled }: DropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  const handleActionClick = (action: Action) => {
    if (action.isDestructive) {
      setSelectedAction(action);
      setOpen(true);
    } else {
      action.onClick();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(b) => setOpen(b)}>
      <DropdownMenu open={dialogOpen} onOpenChange={(b) => setDialogOpen(b)}>
        <Button variant="ghost" size="icon" className="w-8 h-8" asChild disabled={disabled}>
          <DropdownMenuTrigger disabled={disabled}>
            <DotsHorizontal width={16} />
          </DropdownMenuTrigger>
        </Button>

        <DropdownMenuContent
          className="bg-card min-w-[198px] drop-shadow-lg border-[0.5px]"
          align="end"
          onMouseLeave={() => setDialogOpen(false)}
        >
          {actions.map((action, index) => (
            <>
              {action.isDestructive && <DropdownMenuSeparator />}
              <DropdownMenuItem
                key={index}
                className={cn("hover:bg-accent", {
                  "text-[#FF6038]": action.isDestructive,
                })}
                onClick={() => handleActionClick(action)}
              >
                {action.label}
              </DropdownMenuItem>
            </>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedAction && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to {selectedAction.label.toLowerCase()}?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={selectedAction.onClick}
              disabled={isPending}
            >
              {selectedAction.label}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default ConnectionDropdown;
