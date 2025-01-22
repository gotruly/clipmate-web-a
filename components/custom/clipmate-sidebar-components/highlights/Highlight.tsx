"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import ClipmateTextEditor from "../../ClipmateTextEditor";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { arrayRemove } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Edit03, Trash04, X } from "@untitled-ui/icons-react";
import markdownit from "markdown-it";
import { useMemo, useState } from "react";
import { captureException } from "@sentry/nextjs";
import { HighlightValue, IClipmateReaderMode, IClipmateResponse } from "@/types/clipmate";
import useClipmateReaderMode from "@/lib/hooks/reader";

type Props = {
  highlight: HighlightValue;
  value: IClipmateReaderMode;
  item: IClipmateResponse;
};

const Highlight = ({ highlight, value, item }: Props) => {
  const [noteState, setNoteState] = useState<boolean>(false);

  const { editor } = useClipmateReaderMode({
    markdown:
      value.md_clean ||
      item.data.post.note_tweet?.text ||
      item.data.post.selftext ||
      item.data.post.body,
  });

  const { user } = FireAuthHooks.useGetUser();
  const { mutate, isPending } = FirestoreHooks.useUpsertDoc<IClipmateReaderMode>(
    ["users", user.uid, "reader"],
    value._id,
    { key: value._id }
  );

  const handleRemoveHighlighting = () => {
    const { _id, ...rest } = value as IClipmateReaderMode;

    mutate(
      { ...rest, highlights: arrayRemove(highlight) },
      {
        onSuccess: () => {
          toast.success("Highlight removed");
          queryClient.refetchQueries({ queryKey: [value._id] });
        },
        onError: (e) => {
          toast.error("Error removing highlight");
          captureException(e);
        },
      }
    );
  };

  const handleAddingNotes = (note: string) => {
    const { _id, ...rest } = value as IClipmateReaderMode;
    const NewHighlights = value.highlights.map((hl) =>
      hl.value === highlight.value ? { ...hl, note } : hl
    );

    mutate(
      { ...rest, highlights: NewHighlights },
      {
        onSuccess: () => {
          setNoteState(false);
          toast.success("Highlight note added");
          queryClient.refetchQueries({ queryKey: [value._id] });
        },
        onError: (e) => {
          toast.error("Error adding highlight note");
          captureException(e);
        },
      }
    );
  };

  const handleRemovingNotes = () => {
    const { _id, ...rest } = value as IClipmateReaderMode;
    const NewHighlights = value.highlights.map((hl) =>
      hl.value === highlight.value ? { ...hl, note: null } : hl
    );

    mutate(
      { ...rest, highlights: NewHighlights },
      {
        onSuccess: () => {
          setNoteState(false);
          toast.success("Highlight note removed");
          queryClient.refetchQueries({ queryKey: [value._id] });
        },
        onError: (e) => {
          toast.error("Error removing highlight note");
          captureException(e);
        },
      }
    );
  };

  const md = useMemo(() => markdownit({ html: true, linkify: true }), []);
  const note = useMemo(() => md.render(highlight.note || ""), [highlight.note, md]);

  const content =
    highlight.value.length > 150 ? `${highlight.value.slice(0, 125)}...` : highlight.value;

  const ScrollToHighlight = () => {
    const Ref = document.querySelector(".reader > div");
    const TipTap = document.querySelector(".reader-mode");

    const START = highlight.start;
    const TOTAL_SIZE = editor.state.doc.content.size;

    const ScrollHeight = (START / TOTAL_SIZE) * (TipTap?.scrollHeight || 0);

    Ref?.scrollTo({
      top: ScrollHeight - 75,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-[calc(320px-16px)]">
      {!noteState && (
        <div className="relative flex flex-col gap-0.5 border border-border rounded-md overflow-hidden p-3 pb-0 group">
          <div className="grid gap-2">
            <div
              className="grid grid-cols-[2px_auto] gap-2 cursor-pointer"
              onClick={() => ScrollToHighlight()}
            >
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: highlight.color }}
              />
              <p className="w-full px-0.5 h-full !break-words !whitespace-pre-wrap max-w-[270px] font-semibold italic leading-normal">
                &quot;{content}&quot;
              </p>
            </div>

            {highlight.note && (
              <div className="p-2 border border-border rounded-md relative group overflow-hidden">
                <Button
                  disabled={isPending}
                  size="icon"
                  variant="secondary"
                  className="absolute top-0 right-0 !w-fit !h-fit p-1 hidden opacity-0 group-hover:opacity-100 group-hover:block rounded-t-none rounded-r-none"
                  onClick={() => handleRemovingNotes()}
                >
                  <X width={16} height={16} />
                </Button>

                <div
                  onClick={() => setNoteState(true)}
                  className="w-full px-0.5 h-full text-wrap prose dark:prose-invert prose-sm max-w-none prose-p:m-0 prose-ul:my-1 prose-ol:my-1 prose-a:text-blue-500 prose-h1:text-base prose-p:!break-words prose-a:!break-words prose-hr:m-1.5"
                  dangerouslySetInnerHTML={{ __html: note }}
                />
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-card w-full flex items-center justify-end pb-1">
            <Button
              size="icon"
              variant="ghost"
              disabled={isPending}
              className="w-[30px] h-[30px]"
              onClick={() => setNoteState(true)}
            >
              <Edit03 width={16} />
            </Button>
            <Button
              disabled={isPending}
              variant="ghost"
              size="icon"
              className="w-[30px] h-[30px] !text-[#ef4444]"
              onClick={() => handleRemoveHighlighting()}
            >
              <Trash04 width={16} />
            </Button>
          </div>
        </div>
      )}

      {noteState && (
        <ClipmateTextEditor
          value={highlight?.note}
          isSubmitting={isPending}
          onSubmit={(v) => handleAddingNotes(v)}
          onCancel={() => setNoteState(false)}
        />
      )}
    </div>
  );
};

export default Highlight;
