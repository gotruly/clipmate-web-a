"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import ClipmateTextEditor from "../../ClipmateTextEditor";
import { NoteCreationType } from "@/schema/notes";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { Timestamp } from "firebase/firestore";
import { nanoid } from "nanoid";
import { captureException } from "@sentry/nextjs";

type Props = {
  itemId: string;
  onComplete?: () => void;
  onCancel?: () => void;
};

const AddNote = ({ itemId, onComplete, onCancel }: Props) => {
  const { user } = FireAuthHooks.useGetUser();
  const { mutate, isPending } = FirestoreHooks.useAddDoc<NoteCreationType>(
    ["users", user.uid, "notes", nanoid()],
    {
      key: "createNote",
    }
  );

  const handleSubmit = (v: string) => {
    mutate(
      {
        text: v,
        item_id: itemId,
        date_added: Timestamp.fromDate(new Date()),
        date_modified: Timestamp.fromDate(new Date()),
      },
      {
        onSuccess: () => {
          onComplete && onComplete();
          queryClient.refetchQueries({ queryKey: ["getNotes"] });
          toast.success("Note created");
        },
        onError: (err) => {
          console.log(err);
          captureException(err);
        },
      }
    );
  };

  return (
    <ClipmateTextEditor
      isSubmitting={isPending}
      onSubmit={(v) => handleSubmit(v)}
      onCancel={() => onCancel && onCancel()}
    />
  );
};

export default AddNote;
