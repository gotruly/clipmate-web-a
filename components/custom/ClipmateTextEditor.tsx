"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send03, X } from "@untitled-ui/icons-react";
import { Loader2 } from "lucide-react";

type Props = {
  value?: string;
  isSubmitting?: boolean;
  onSubmit?: (v: string) => void;
  onCancel?: () => void;
};

const ClipmateTextEditor = ({ value, isSubmitting, onSubmit, onCancel }: Props) => {
  const [content, setContent] = useState<string>(value || "");

  const editor = useEditor({
    content: content,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1],
        },
      }),
      Markdown,
      Underline,
      Link.configure({
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({ placeholder: "Start typing" }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm !max-w-full !w-full prose-p:m-0 p-2 prose-ul:my-1 prose-ol:my-1 prose-a:text-blue-500 !h-full prose-h1:text-base prose-p:!break-words prose-a:!break-words prose-hr:m-1.5",
      },
    },
    autofocus: true,
    immediatelyRender: true,
    onUpdate: ({ editor }) => {
      setContent(editor.storage.markdown.getMarkdown());
    },
  });

  return (
    <div className="w-full border border-border rounded-md relative">
      <ScrollArea className="h-[150px] editor">
        <EditorContent editor={editor} />
      </ScrollArea>

      <div className="flex items-center justify-between sticky bottom-0 left-0 h-fit w-full p-2">
        <Button
          disabled={isSubmitting}
          variant="outline"
          size="icon"
          className="w-[30px] h-[30px]"
          onClick={() => onCancel && onCancel()}
        >
          <X width={16} />
        </Button>
        <Button
          disabled={isSubmitting}
          size="icon"
          className="w-[30px] h-[30px]"
          onClick={() => onSubmit && onSubmit(content)}
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send03 width={16} />}
        </Button>
      </div>
    </div>
  );
};

export default ClipmateTextEditor;
