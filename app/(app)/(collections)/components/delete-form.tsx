import queryClient from "@/lib/queryClient";
import { IClipmateCollections } from "@/types/clipmate";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { captureException } from "@sentry/nextjs";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { orderBy } from "firebase/firestore";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";

type Props = {
  collection: IClipmateCollections;
  setOpen: (value: boolean) => void;
};

const DeleteCollectionConfirm = ({ collection, setOpen }: Props) => {
  const router = useRouter();
  const path = usePathname();

  const { setStore } = useCollectionDetailsStore();
  const { mutate, isPending } = FirestoreHooks.useDeleteDoc(["collections"], {
    key: "deleteCollection",
  });

  const RemoveAllBookmark = FirestoreHooks.useDeleteAllBookmarksFromCollection(
    ["users", collection.user_id, "bookmarks"],
    {
      key: "deleteAllBookmarksFromCollection",
      constraints: [orderBy(`collections.${collection._id}.date_added`, "desc")],
    }
  );

  const handleDeleteCollection = () => {
    RemoveAllBookmark.mutate(collection._id, {
      onSuccess: () => {
        mutate(collection._id, {
          onSuccess: () => {
            setOpen(false);
            toast.success(`${collection.name} - collection deleted`);

            setStore((prev) => {
              const temp = { ...prev };
              delete temp[collection._id];
              return temp;
            });

            queryClient.refetchQueries({ queryKey: ["getAllCollections"] });

            if (path.includes("collections") && path.includes(collection._id)) {
              router.push("/");
            }
          },
          onError: (error) => {
            setOpen(false);
            toast.error("Failed to delete collection");
            console.log(error);
            captureException(error);
          },
        });
      },
    });
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        Are you sure you want to delete{" "}
        <span className="text-destructive font-semibold">&quot;{collection.name}&quot;</span>{" "}
        collection. This will permanently delete your collection and all items in the collection.
      </AlertDialogDescription>
      <AlertDialogFooter>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending || RemoveAllBookmark.isPending}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteCollection()}
          disabled={isPending || RemoveAllBookmark.isPending}
        >
          Delete
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteCollectionConfirm;
