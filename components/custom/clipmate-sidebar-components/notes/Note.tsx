"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import ClipmateTextEditor from "../../ClipmateTextEditor";
import { NoteCreationType } from "@/schema/notes";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Edit03, Trash04 } from "@untitled-ui/icons-react";
import markdownit from "markdown-it";
import { formatDate } from "@/lib/utils";
import { useMemo, useState } from "react";
import { captureException } from "@sentry/nextjs";

type Props = {
  note: NoteCreationType & { _id: string };
  onComplete?: () => void;
};

const Note = ({ note, onComplete }: Props) => {
  const [editState, setEditState] = useState<boolean>(false);

  const { user } = FireAuthHooks.useGetUser();
  const { mutate, isPending } = FirestoreHooks.useEditDoc<NoteCreationType>(
    ["users", user.uid, "notes"],
    note._id,
    {
      key: "viewAndEditNote",
    }
  );

  const Delete = FirestoreHooks.useDeleteDoc(["users", user.uid, "notes"], {
    key: "viewAndEditNote",
  });

  const handleSubmit = (v: string) => {
    mutate(
      {
        ...note,
        ...{ text: v, date_modified: Timestamp.fromDate(new Date()) },
      },
      {
        onSuccess: () => {
          onComplete && onComplete();
          setEditState(false);
          queryClient.refetchQueries({ queryKey: ["getNotes"] });
          toast.success("Note updated");
        },
        onError: (error) => {
          toast.error("Error in updating note");
          captureException(error);
        },
      }
    );
  };

  const handleDelete = () => {
    Delete.mutate(note._id, {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["getNotes"] });
        toast.success("Note deleted");
      },
      onError: (error) => {
        toast.error("Error in deleting note");
        captureException(error);
      },
    });
  };

  const md = useMemo(() => markdownit({ html: true, linkify: true }), []);
  const html = useMemo(() => md.render(note.text), [note.text, md]);

  return (
    <div className="w-[calc(320px-16px)]">
      {!editState && (
        <div className="flex flex-col gap-3 border border-border rounded-md p-2 group">
          <div
            className="w-full px-0.5 h-full text-wrap prose dark:prose-invert prose-sm max-w-none prose-p:m-0 p-2 prose-ul:my-1 prose-ol:my-1 prose-a:text-blue-500 prose-h1:text-base prose-p:!break-words prose-a:!break-words prose-hr:m-1.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-0.5 text-center">
                <span>{formatDate(new Date(note.date_modified.seconds * 1000))},</span>
                <span>{new Date(note.date_modified.seconds * 1000).toLocaleTimeString()}</span>
              </p>
            </div>

            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="ghost"
                className="w-[30px] h-[30px]"
                onClick={() => setEditState(true)}
              >
                <Edit03 width={16} />
              </Button>
              <Button
                disabled={Delete.isPending}
                variant="ghost"
                size="icon"
                className="w-[30px] h-[30px]"
                onClick={() => handleDelete()}
              >
                <Trash04 color="#ef4444" width={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {editState && (
        <ClipmateTextEditor
          value={note.text}
          isSubmitting={isPending}
          onSubmit={(v) => handleSubmit(v)}
          onCancel={() => setEditState(false)}
        />
      )}
    </div>
  );
};

export default Note;
