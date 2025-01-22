import FireAuthHooks from "@/app/api/hooks/fireauth";
import FireFunctionHooks from "@/app/api/hooks/firefunction";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { captureException } from "@sentry/nextjs";

const Account = () => {
  const { user } = FireAuthHooks.useGetUser();
  const { mutate, isPending } = FireFunctionHooks.useDeleteAccount();
  const Logout = FireAuthHooks.useLogOut();

  const [alertOpen, setAlertOpen] = useState(false);

  const handleDeleteAccount = () => {
    toast.loading("Deleting your account", { id: "deleteAccount" });

    mutate(undefined, {
      onSuccess: () => {
        toast.dismiss("deleteAccount");
        toast.success("Successful");
        Logout.mutate();
      },
      onError: (error) => {
        toast.dismiss("deleteAccount");
        toast.error("Failed to delete account");
        captureException(error);
      },
    });
  };

  return (
    <div className="h-full py-2 px-3">
      <div className="flex flex-col mb-6 gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">Email</p>
          <p className="text-xs text-muted-foreground dark:text-[#94969C]">
            The email address associated with this account
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground dark:text-[#D6D6D6]">Current Email</p>
          <p className="text-base font-semibold">{user.email}</p>
        </div>
      </div>

      <hr />

      <div className="flex flex-col mt-6 gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Delete my account</p>
          <p className="text-xs text-muted-foreground dark:text-[#94969C] max-w-[70ch]">
            This action is irreversible, this action will delete all your data, including
            bookmarks, collections, connections, and personal data.
          </p>
        </div>

        <AlertDialog open={alertOpen} onOpenChange={(b) => setAlertOpen(b)}>
          <Button variant="destructive" size="sm" className="w-fit" asChild>
            <AlertDialogTrigger>Delete my accout</AlertDialogTrigger>
          </Button>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Again, this action is irreversible, this action will delete all your data, including
              bookmarks, collections, connections, and personal data.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => setAlertOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteAccount()}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Account;
