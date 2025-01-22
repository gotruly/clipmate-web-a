import { EditorContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import { HighlightValue, MenuCoords } from "@/types/clipmate";
import BubbleMenu from "./clipmate-reader-mode/BubbleMenu";
import useClipmateReaderMode from "@/lib/hooks/reader";

type Props = {
  markdown: string;
  highlights: HighlightValue[];
  disableList?: boolean;
  disableQuote?: boolean;
  onChange: (data: HighlightValue) => void;
};

const ClipmateReaderMode = ({
  markdown,
  highlights,
  onChange,
  disableList = false,
  disableQuote = false,
}: Props) => {
  const [menuCoords, setMenuCoords] = useState<MenuCoords | undefined>(undefined);

  const { editor } = useClipmateReaderMode({ markdown, disableList, disableQuote });

  const CalculatePos = () => {
    const SELECTION = editor.state.selection;
    const START_POS = editor.view.coordsAtPos(SELECTION.from);

    const EDITOR_DOM = editor.view.dom;
    const EDITOR_BOUNDS = EDITOR_DOM.getBoundingClientRect();

    setMenuCoords({
      top: START_POS.top - EDITOR_BOUNDS.top - 45,
      left: START_POS.left - EDITOR_BOUNDS.left,
      start: SELECTION.from,
      end: SELECTION.to,
      value: editor.state.doc.textBetween(SELECTION.from, SELECTION.to),
      hasContent: !SELECTION.empty,
    });
  };

  useEffect(() => {
    /** Set markdown again to remove previous highlights */
    editor.commands.setContent(markdown);

    highlights.forEach((hl) => {
      const { tr } = editor.state;
      const mark = editor.schema.marks.highlight.create({ color: hl.color });
      editor.view.dispatch(tr.addMark(hl.start, hl.end, mark));
    });
  }, [editor, highlights, markdown]);

  return (
    <div className="w-full relative">
      {menuCoords && menuCoords.hasContent && (
        <BubbleMenu editor={editor} coords={menuCoords} onHighlight={(v) => onChange(v)} />
      )}

      <EditorContent
        editor={editor}
        onMouseUp={() => CalculatePos()}
        onMouseLeave={() => CalculatePos()}
        onMouseDown={() => setMenuCoords(undefined)}
      />
    </div>
  );
};

export default ClipmateReaderMode;
