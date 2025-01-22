import queryClient from "@/lib/queryClient";
import { IClipmateCollections } from "@/types/clipmate";
import { toast } from "sonner";
import { captureException } from "@sentry/nextjs";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FirestoreHooks from "@/app/api/hooks/firestore";
import ClipmateInput from "@/components/custom/ClipmateInput";
import { Copy, Link } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { orderBy } from "firebase/firestore";
import { CopyToClipboard } from "@/lib/utils";
import FireAuthHooks from "@/app/api/hooks/fireauth";

type Props = {
  collection: IClipmateCollections;
  setOpen: (value: boolean) => void;
};

const ShareDialog = ({ collection, setOpen }: Props) => {
  const { user } = FireAuthHooks.useGetUser();
  const { mutate, isPending } = FirestoreHooks.useEditDoc(["collections"], collection._id, {
    key: "editCollection",
  });

  const TogglePublicList = FirestoreHooks.useTogglePublicCollectionList(
    ["users", collection.user_id, "bookmarks"],
    {
      key: "togglePublicCollectionList",
      constraints: [orderBy(`collections.${collection._id}.date_added`, "desc")],
    }
  );

  const PublicURL = [window.origin, "public", user.uid, collection._id].join("/");

  const handleMakeCollectionPublic = (toggle: boolean) => {
    const { _id, ...rest } = collection;
    const visibility = toggle ? "public" : "private";

    mutate(
      { ...rest, ...{ public: toggle } },
      {
        onSuccess: () => {
          TogglePublicList.mutate(_id, {
            onSuccess: () => {
              toast.success(`${collection.name} - is now ${visibility}`);
              queryClient.refetchQueries({
                predicate: (query) =>
                  query.queryKey.includes("getAllCollections") ||
                  query.queryKey.includes("getAllCollectionsDetails"),
              });
            },
          });
        },
        onError: (error) => {
          toast.error("Failed to make collection public");
          captureException(error);
        },
      }
    );
  };

  const handleCopyLink = () => {
    CopyToClipboard(PublicURL, {
      onSucess: () => {
        toast.success("Link copied to clipboard");
      },
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Share &quot;{collection.name}&quot;</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        You can share this collection with others by making it a public collection. This means
        anyone with this link will see all the items within your collection.
      </DialogDescription>
      <div>
        <ClipmateInput
          className="pointer-events-none"
          readOnly={true}
          value={PublicURL}
          LeftIcon={Link}
          Component={
            <Button
              variant="outline"
              size="icon"
              className="w-6 h-6 pointer-events-auto"
              onClick={() => handleCopyLink()}
            >
              <Copy size={13} />
            </Button>
          }
        />
      </div>
      <DialogFooter className="w-full sm:justify-between">
        <Label className="w-fit flex items-center gap-2 cursor-pointer">
          <Switch
            disabled={isPending || TogglePublicList.isPending}
            defaultChecked={collection.public}
            onCheckedChange={(c) => handleMakeCollectionPublic(c)}
          />
          Make collection public
        </Label>
        <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ShareDialog;
