"use client";

import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import ClipmateComparePlanDialog from "@/components/custom/ClipmateComparePlanDialog";

type Props = {
  isLoading?: boolean;
};

const ComparePlansDialog = ({ isLoading = false }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild className="w-full focus-visible:ring-0 focus-visible:outline-none">
        <Button className="w-full" size="sm" variant="outline" disabled={isLoading}>
          Compare Plans
        </Button>
      </DialogTrigger>

      <ClipmateComparePlanDialog />
    </Dialog>
  );
};

export default ComparePlansDialog;
