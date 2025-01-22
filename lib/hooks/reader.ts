import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import { Markdown } from "tiptap-markdown";
import { useState } from "react";

type Props = {
  markdown: string;
  disableList?: boolean;
  disableQuote?: boolean;
};

const useClipmateReaderMode = ({ markdown, disableList, disableQuote }: Props) => {
  const [content, setContent] = useState<string>(markdown || "");

  const editor = useEditor({
    content: content,
    editable: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
        hardBreak: { keepMarks: true },
        orderedList: disableList ? false : undefined,
        bulletList: disableList ? false : undefined,
        listItem: disableList ? false : undefined,
        blockquote: disableQuote ? false : undefined,
      }),
      Markdown,
      Underline,
      Link.configure({
        defaultProtocol: "https",
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm !max-w-full prose-p:!my-0.5 prose-ul:my-0.5 prose-ol:my-0.5 prose-a:text-blue-500 !h-full prose-h1:text-base prose-p:!break-words prose-a:!break-words prose-hr:m-1.5 !p-0 reader-mode prose-p:!leading-3",
      },
    },
    autofocus: true,
    immediatelyRender: true,
  });

  return { editor };
};

export default useClipmateReaderMode;
