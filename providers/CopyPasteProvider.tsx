"use client";

import FireFunctionHooks from "@/app/api/hooks/firefunction";
import ClipmateImage from "@/components/custom/ClipmateImage";
import IconPicker from "@/components/custom/IconPicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import CopyPasteContext from "@/context/CopyPasteContext";
import queryClient from "@/lib/queryClient";
import extractDomain from "extract-domain";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import isUrl from "is-url";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { useCopyPasteContext } from "@/lib/hooks";
import { useGetMetaData } from "@/app/api/hooks/utilities";

const CopyPasteAction = () => {
  const { text, setText, openDialog, setOpenDialog } = useCopyPasteContext();

  const { user } = FireAuthHooks.useGetUser();
  const { mutate, isPending } = FireFunctionHooks.useSyncLink();
  const { data, isLoading } = useGetMetaData(text);

  const handleSave = () => {
    const data = { url: text };

    mutate(data);

    setOpenDialog(false);
    setText("");
    toast.info("Processing link...");
    queryClient.setQueryData(["getUrlMetaData"], {});
  };

  useEffect(() => {
    const ListenForCMDV = (e: KeyboardEvent) => {
      const element = e.target as HTMLElement;
      const isINPUT = element.tagName === "INPUT";
      const isTEXTAREA = element.tagName === "TEXTAREA";
      const isTIPTAP = element?.className?.includes("tiptap");

      // Ignore if the element that is focused is an input field
      if (!isINPUT && !isTEXTAREA && !isTIPTAP) {
        // Clear whatever is in the text state
        setText("");

        //Compatibility for Windows & Linux too
        if ((e.metaKey || e.ctrlKey) && e.key === "v") {
          e.preventDefault();

          navigator.clipboard.readText().then((value) => {
            if (!value) toast.warning("Clipboard Empty: Nothing to paste");
            if (!isUrl(value)) toast.warning("Invalid URL: Paste a valid URL");
            else {
              setText(value);
              setOpenDialog(true);
            }
          });
        }
      }
    };

    // Make Sure `document` environment is available
    if (typeof document !== "undefined") {
      document.addEventListener("keydown", (e) => ListenForCMDV(e));
    }

    // Remove Listener - Clean Up
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("keydown", ListenForCMDV);
      }
    };
  }, [setOpenDialog, setText, user.email]);

  return (
    <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
      <DialogContent
        autoFocus={false}
        tabIndex={-1}
        className="border border-border rounded-xl"
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>New Link</DialogTitle>
        </DialogHeader>

        <div>
          {!isLoading && !data && text === "" && (
            <div className="flex flex-col items-center py-10 px-10 border border-border rounded-xl bg-muted">
              <p className="text-xs text-muted-foreground text-center">
                Press CMD + V to paste your link
              </p>
            </div>
          )}

          {isLoading && !data && (
            <div className="flex items-center gap-3 w-full h-full bg-card rounded-xl border border-border overflow-hidden relative">
              <div className="absolute top-2 right-2">
                <Skeleton className="h-4 w-4 rounded-md" />
              </div>
              <Skeleton className="h-24 w-24 rounded-none" />
              <div className="flex flex-col items-start gap-1">
                <Skeleton className="h-3 w-[150px]" />
                <Skeleton className="h-3 w-[300px]" />
                <Skeleton className="h-3 w-[300px]" />
                <Skeleton className="h-3 w-[300px]" />
              </div>
            </div>
          )}

          {!isLoading && data && (
            <div className="flex items-center gap-3 border border-border rounded-xl overflow-hidden bg-card relative">
              <div className="absolute top-2 right-2">
                <IconPicker type="link" />
              </div>
              <div className="w-48 h-28 max-h-full">
                {data.image && <ClipmateImage alt={data.description} src={data.image} />}
              </div>
              <div className="flex flex-col gap-2 pr-3">
                <div className="px-1 py-0.5 w-fit font-normal text-xs bg-black/70 dark:bg-white/30 text-white rounded-sm">
                  {extractDomain(text)}
                </div>
                <p className="text-sm font-medium text-wrap max-w-[25ch]">
                  {data.title.length > 30 ? data.title.slice(0, 25) + "..." : data.title}
                </p>
                <p className="text-xs text-gray-400 text-wrap">
                  {data.description.length > 80
                    ? data.description.slice(0, 80) + "..."
                    : data.description}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            disabled={isPending || isLoading || text === ""}
            className="py-1.5 h-fit flex items-center gap-2"
            onClick={() => handleSave()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CopyPasteProvider = ({ children }: { children: React.ReactNode }) => {
  const [text, setText] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <CopyPasteContext.Provider value={{ text, openDialog, setText, setOpenDialog }}>
      <CopyPasteAction />
      {children}
    </CopyPasteContext.Provider>
  );
};

export default CopyPasteProvider;
