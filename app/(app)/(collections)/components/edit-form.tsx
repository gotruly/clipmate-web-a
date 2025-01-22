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
import { CollectionCreationType } from "@/schema/collection";
import { FormikProvider, useFormik } from "formik";
import { Textarea } from "@/components/ui/textarea";
import { useMemo } from "react";

type Props = {
  collection: IClipmateCollections;
  setOpen: (value: boolean) => void;
};

const EditDialog = ({ collection, setOpen }: Props) => {
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

  const handleEditCollection = (values: CollectionCreationType) => {
    const { _id, ...rest } = collection;

    mutate(
      { ...rest, ...values },
      {
        onSuccess: () => {
          toast.success("Collection edited successfully");
          queryClient.refetchQueries({
            predicate: (query) =>
              query.queryKey.includes("getAllCollections") ||
              query.queryKey.includes("getAllCollectionsDetails"),
          });
          setOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to edit collection");
          captureException(error);
        },
      }
    );
  };

  const initialValues: CollectionCreationType = useMemo(
    () => ({
      name: collection.name,
      description: collection.description || "",
    }),
    [collection]
  );

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => handleEditCollection(values),
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit this collection</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        Edit your collection&apos;s details like; name, description and collection visibility.
      </DialogDescription>
      <FormikProvider value={formik}>
        <form className="grid gap-5 my-3" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-2">
            <Label>Collection name</Label>
            <ClipmateInput
              autoComplete="off"
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
              placeholder="eg. Website Design Inspiration"
              maxLength={35}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              {formik.values.name.length || 0}/35 characters
            </p>
          </div>
          <div className="grid gap-2">
            <Label>Collection description</Label>
            <Textarea
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
              placeholder="Write a small description about your collection..."
              rows={5}
              maxLength={180}
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              {formik.values.description?.length || 0}/180 characters
            </p>
          </div>
        </form>
      </FormikProvider>

      <div className="mt-5">
        <Label className="w-fit flex items-start gap-2 cursor-pointer">
          <Switch
            disabled={isPending || TogglePublicList.isPending}
            defaultChecked={collection.public}
            onCheckedChange={(c) => handleMakeCollectionPublic(c)}
          />
          <div className="text-sm font-normal grid gap-1">
            <p>Make collection public</p>
            <p className="text-muted-foreground">
              Making this collection public means you&apos;ll be able to share with anyone
            </p>
          </div>
        </Label>
      </div>

      <DialogFooter className="w-full sm:justify-between">
        <Button
          disabled={isPending || TogglePublicList.isPending}
          className="w-full"
          variant="outline"
          size="sm"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button
          disabled={isPending || TogglePublicList.isPending}
          className="w-full"
          size="sm"
          onClick={() => formik.submitForm()}
        >
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditDialog;
