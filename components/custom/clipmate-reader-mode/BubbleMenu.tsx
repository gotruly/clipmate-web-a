import { cn } from "@/lib/utils";
import { HighlightValue, MenuCoords } from "@/types/clipmate";
import { Editor } from "@tiptap/react";
import { Square } from "@untitled-ui/icons-react";
import { useState } from "react";

type Props = {
  editor: Editor;
  coords: MenuCoords;
  onHighlight: (data: HighlightValue) => void;
};

const BubbleMenu = ({ editor, coords, onHighlight }: Props) => {
  const BASE_BTN = "w-4 h-4 rounded-sm cursor-pointer ";

  const [open, setOpen] = useState<boolean>(coords.hasContent);

  const handleHighlight = (color: string) => {
    editor.chain().focus().toggleHighlight({ color: color }).run();
    onHighlight({ start: coords.start, end: coords.end, color, value: coords.value });
    setOpen(false);
  };

  return (
    <div
      className={cn(
        "bg-foreground text-slate-400 p-2 absolute z-50 rounded-md hidden grid-cols-6 gap-1",
        { grid: open }
      )}
      style={{ top: coords?.top, left: coords?.left }}
    >
      <div className="w-fit absolute z-10 bottom-0 left-1/2 translate-x-[-50%] translate-y-[5px] text-foreground pointer-events-none">
        <Square width={16} height={16} fill="currentColor" className="rotate-45" />
      </div>

      <div
        role="button"
        onClick={() => handleHighlight("#FF6038")}
        className={
          "bg-[#FF6038]" + editor.isActive("highlight", { color: "#FF6038" })
            ? BASE_BTN + "bg-[#FF6038] is-active"
            : ""
        }
      />
      <div
        role="button"
        onClick={() => handleHighlight("#079455")}
        className={
          "bg-[#079455]" + editor.isActive("highlight", { color: "#079455" })
            ? BASE_BTN + "bg-[#079455] is-active"
            : ""
        }
      />
      <div
        role="button"
        onClick={() => handleHighlight("#F79009")}
        className={
          "bg-[#F79009]" + editor.isActive("highlight", { color: "#F79009" })
            ? BASE_BTN + "bg-[#F79009] is-active"
            : ""
        }
      />
      <div
        role="button"
        onClick={() => handleHighlight("#0BA5EC")}
        className={
          "bg-[#0BA5EC]" + editor.isActive("highlight", { color: "#0BA5EC" })
            ? BASE_BTN + "bg-[#0BA5EC] is-active"
            : ""
        }
      />
      <div
        role="button"
        onClick={() => handleHighlight("#7A5AF8")}
        className={
          "bg-[#7A5AF8]" + editor.isActive("highlight", { color: "#7A5AF8" })
            ? BASE_BTN + "bg-[#7A5AF8] is-active"
            : ""
        }
      />
      <div
        role="button"
        onClick={() => handleHighlight("#EE46BC")}
        className={
          "bg-[#EE46BC]" + editor.isActive("highlight", { color: "#EE46BC" })
            ? BASE_BTN + "bg-[#EE46BC] is-active"
            : ""
        }
      />
    </div>
  );
};

export default BubbleMenu;
