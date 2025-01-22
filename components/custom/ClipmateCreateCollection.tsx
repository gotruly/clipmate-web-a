import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import queryClient from "@/lib/queryClient";
import { CollectionCreationSchema, CollectionCreationType } from "@/schema/collection";
import { FormikProvider, useFormik } from "formik";
import { nanoid } from "nanoid";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import ClipmateInput from "./ClipmateInput";
import { isEmpty } from "lodash";
import { IClipmateBase, IClipmateCollections } from "@/types/clipmate";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";
import { TooltipProvider } from "../ui/tooltip";

type Props = {
  setOpenDialog: (open: boolean) => void;
  item?: IClipmateBase;
};

const ClipmateCreateCollection = React.memo(({ setOpenDialog, item }: Props) => {
  const { selectedItems, resetSelectedItems } = useMultipleItemActionAtom();
  const { setStore } = useCollectionDetailsStore();

  const [id, setId] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(false);

  const { user } = FireAuthHooks.useGetUser();
  const { mutate, isPending } = FirestoreHooks.useAddDoc(["collections", id], {
    key: "createCollection",
  });

  const EditCollection = FirestoreHooks.useEditDoc<IClipmateCollections>(["collections"], id, {
    key: `edit_${id}`,
  });

  const AddMany = FirestoreHooks.useAddManyBookmarksToCollection(
    ["users", user.uid, "bookmarks"],
    { key: "addManyItemsToCollection" }
  );

  const handleCollectionCreation = (value: CollectionCreationType, resetForm: () => void) => {
    const data = { ...value, ...{ user_id: user.uid, public: isPublic } };

    const id = nanoid();
    setId(id);

    mutate(data, {
      onSuccess: () => {
        toast.success(`${data.name} - collection created`);
        queryClient.invalidateQueries({ queryKey: ["getAllCollections"] });

        // Reset form
        resetForm();
        setIsPublic(false);

        if (!isEmpty(selectedItems)) {
          AddMany.mutate(
            { params: [...selectedItems], id: id, isPublic: isPublic },
            {
              onSuccess: () => {
                setStore((prev) => ({
                  ...prev,
                  ...{ [id]: { ...prev[id], count: selectedItems.length } },
                }));
                EditCollection.mutate({ ...data, count: selectedItems.length });
                toast.success(`${selectedItems.length} item(s) added successfully`);
                resetSelectedItems();
              },
            }
          );
        } else if (item) {
          AddMany.mutate(
            { params: [item], id: id, isPublic: false },
            {
              onSuccess: () => {
                setStore((prev) => ({
                  ...prev,
                  ...{ [id]: { ...prev[id], count: 1 } },
                }));
                EditCollection.mutate({ ...data, count: 1 });
                toast.success("Item added successfully");
              },
            }
          );
        }

        // Close the dialog
        setOpenDialog(false);
      },
    });
  };

  const initialValue: CollectionCreationType = useMemo(
    () => ({
      name: "",
      description: "",
    }),
    []
  );

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: useMemo(() => CollectionCreationSchema, []),
    onSubmit: (value: CollectionCreationType, { resetForm }) => {
      handleCollectionCreation(value, resetForm);
    },
  });

  return (
    <DialogContent className="border border-border rounded-xl max-w-[450px]">
      <DialogHeader>
        <DialogTitle>Create collection</DialogTitle>
        <p className="text-muted-foreground text-sm">
          Please provide the name, description, and visibility for this collection
        </p>
      </DialogHeader>

      <TooltipProvider>
        <FormikProvider value={formik}>
          <form className="h-full grid gap-5 my-3" onSubmit={formik.handleSubmit}>
            <div className="grid gap-2">
              <Label>Collection name</Label>
              <ClipmateInput
                autoComplete="off"
                autoFocus={false}
                name="name"
                type="text"
                className="h-9 py-2"
                onChange={formik.handleChange}
                placeholder="eg. Website Design"
                disabled={isPending}
                maxLength={35}
                error={formik.errors.name || formik.touched.name ? formik.errors.name : undefined}
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
                disabled={isPending}
                placeholder="Write a small description about your collection..."
                rows={5}
                maxLength={180}
              />
              <p className="text-xs text-muted-foreground">
                {formik.values.description?.length || 0}/180 characters
              </p>
            </div>

            <div className="mt-5">
              <Label className="w-fit flex items-start gap-2 cursor-pointer">
                <Switch
                  name="public"
                  disabled={isPending}
                  onCheckedChange={(c) => setIsPublic(c)}
                  checked={isPublic}
                />
                <div className="text-sm font-normal grid gap-1">
                  <p>Make collection public</p>
                  <p className="text-muted-foreground">
                    Making this collection public means you&apos;ll be able to share with anyone
                  </p>
                </div>
              </Label>
            </div>

            <div className="w-full flex justify-between gap-3">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-sm"
                  disabled={isPending}
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                size="sm"
                className="w-full flex items-center gap-2"
                disabled={isPending || formik.values.name.trim() === ""}
              >
                {isPending && <Loader2 size={13} className="animate-spin" />}
                Create
              </Button>
            </div>
          </form>
        </FormikProvider>
      </TooltipProvider>
    </DialogContent>
  );
});

ClipmateCreateCollection.displayName = "ClipmateCreateCollection";

export default ClipmateCreateCollection;
