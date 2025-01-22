"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { AccordionContent, AccordionItem, AccordionTrigger2 } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { File06, Plus } from "@untitled-ui/icons-react";
import { orderBy, where } from "firebase/firestore";
import { isEmpty } from "lodash";
import AddNote from "./AddNote";
import { useState } from "react";
import { NoteCreationType } from "@/schema/notes";
import Note from "./Note";
import { Loader2 } from "lucide-react";

type Props = {
  itemId: string;
  open: string[];
};

const Notes = ({ itemId, open }: Props) => {
  const { user } = FireAuthHooks.useGetUser();
  const { data, isLoading } = FirestoreHooks.useGetManyDocs<NoteCreationType>(
    ["users", user.uid, "notes"],
    {
      key: "getNotes",
      constraints: [where("item_id", "==", itemId), orderBy("date_modified", "desc")],
    }
  );

  const [addState, setAddState] = useState<boolean>(false);

  const handleOpenForm = (e?: React.MouseEvent) => {
    if (e && open.find((v) => v === "notes")) e.stopPropagation();
    setAddState(true);
  };

  return (
    <AccordionItem value="notes" className="!border-none">
      <AccordionTrigger2 className="px-3 no-underline hover:!no-underline relative">
        <div className="flex items-center gap-2 text-sm">
          <File06 width={16} />
          <p>Notes</p>
          <Badge variant="outline" className="rounded-full text-xs">
            {isLoading ? "..." : data?.length}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="absolute left-[48%] top-[50%] translate-x-[-50%] translate-y-[-50%] h-fit w-fit px-2.5 py-0.5 gap-1 rounded-full text-xs bg-transparent"
          onClick={(e) => handleOpenForm(e)}
        >
          <Plus width={13} height={13} />
          Add
        </Button>
      </AccordionTrigger2>

      <AccordionContent className="w-full flex flex-col items-center gap-2 px-2 pb-0">
        {!isLoading && addState && (
          <AddNote
            itemId={itemId}
            onComplete={() => setAddState(false)}
            onCancel={() => setAddState(false)}
          />
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-2 w-full h-28 rounded-md">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading notes...</span>
          </div>
        )}

        {!isLoading && data && !isEmpty(data) && (
          <div className="w-full grid items-center gap-2 pb-2">
            {data.map((note) => (
              <Note key={note._id} note={note} />
            ))}
          </div>
        )}

        {!isLoading && isEmpty(data) && (
          <div className="flex items-center justify-center gap-1 h-10 w-full text-center">
            <p className="text-xs text-[#525252] dark:text-[#A3A3A3]">You have no notes</p>
            <Button
              size="sm"
              variant="ghost"
              className="gap-0.5 w-fit h-fit px-2 !text-primary text-xs font-medium"
              onClick={() => handleOpenForm()}
            >
              <Plus width={15} />
              Add note
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default Notes;
