import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useRef, useState } from "react";
import ClipmateUploadItem from "./ClipmateUploadItem";
import { CloudUpload, Link as LinkIcon } from "lucide-react";
import FireFunctionHooks from "@/app/api/hooks/firefunction";
import { Skeleton } from "../ui/skeleton";
import IconPicker from "./IconPicker";
import ClipmateImage from "./ClipmateImage";
import extractDomain from "extract-domain";
import ClipmateInput from "./ClipmateInput";
import { Send03 } from "@untitled-ui/icons-react";
import isUrl from "is-url";
import { isEmpty } from "lodash";
import { useDragNDropContext } from "@/lib/hooks";
import { LinkSchemaType } from "@/schema/link";
import { cn } from "@/lib/utils";
import { useMutateToGetMetaData } from "@/app/api/hooks/utilities";
import { toast } from "sonner";
import { DubCoType } from "@/types/clipmate";
import Link from "next/link";
import { CHROME_EXTENSION_URL } from "@/constants";

const ClipmateAddItem = () => {
  const InputRef = useRef<HTMLInputElement>(null);

  const { files, openDialog, setOpenDialog, setFiles, setFilesFromForm } = useDragNDropContext();

  const { mutate, isPending } = FireFunctionHooks.useSyncLink();
  const GetMetaData = useMutateToGetMetaData();

  const [link, setLink] = useState<string>("");
  const [data, setData] = useState<DubCoType | null>(null);

  const handleFileFromForm = (files: FileList) => {
    setFilesFromForm(files);
  };

  const removeCompleted = () => {
    setFiles((prev) => prev.filter((f) => f && f.task.snapshot.state !== "success"));
  };

  const handleGetMetaData = (values: LinkSchemaType) => {
    if (values.url && isUrl(values.url)) {
      GetMetaData.mutate(values, {
        onSuccess: (res) => {
          setData(res);
        },
      });
    }
  };

  const handleAddingLink = (values: LinkSchemaType) => {
    if (values.url && isUrl(values.url)) {
      toast.info("Processing Link...");
      setLink("");
      setOpenDialog(false);
      setData(null);

      mutate(values);
    }
  };

  useEffect(() => {
    /**
     * If user initiates a refresh or page leave, the prompt them
     * that they have unsaved progress if there items that are still
     * uploading
     */
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const fileAreStillUploading = !isEmpty(
        files.filter((f) => f && f.task.snapshot.state === "running")
      );

      // Show prompt based on state
      if (fileAreStillUploading) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome to show the prompt
      }
    };

    /**
     * If user proceeds to refresh or leave the page, then cancel all
     * running uploads
     */
    const handleUnload = () => {
      const fileAreStillUploading = !isEmpty(
        files.filter((f) => f && f.task.snapshot.state === "running")
      );

      if (fileAreStillUploading) {
        files
          .filter((f) => f && f.task.snapshot.state === "running")
          .map((f) => f && f.task.cancel());
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [files]);

  const handleClose = (open: boolean) => {
    setOpenDialog(open);
    removeCompleted();
    setLink("");
    setData(null);
  };

  const handleMinimize = (e?: Event) => {
    e?.preventDefault();
    removeCompleted();
    setOpenDialog(false);
    setData(null);
  };

  return (
    <Dialog open={openDialog} onOpenChange={(open) => handleClose(open)}>
      <DialogContent
        className="border border-border rounded-xl"
        autoFocus={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => handleMinimize(e)}
        onInteractOutside={(e) => handleMinimize(e)}
        onEscapeKeyDown={(e) => handleMinimize(e)}
      >
        <DialogHeader>
          <DialogTitle>New Item</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-3">
            <div>
              <ClipmateInput
                LeftIcon={LinkIcon}
                placeholder="Type or paste link here"
                name="url"
                autoComplete="off"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    console.log("Enter key pressed");
                    handleGetMetaData({ url: link });
                  }
                }}
                Component={
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn("h-full w-6 flex justify-center items-center", {
                      hidden: !isUrl(link),
                    })}
                    type="button"
                    onClick={() => handleGetMetaData({ url: link })}
                  >
                    <Send03 width={14} />
                  </Button>
                }
              />
            </div>

            {GetMetaData.isPending && (
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

            {!GetMetaData.isPending && data && (
              <div className="flex items-center gap-3 border border-border rounded-xl overflow-hidden bg-card relative">
                <div className="absolute top-2 right-2">
                  <IconPicker type="link" />
                </div>
                <div className="w-48 h-28 max-h-full">
                  {data.image && <ClipmateImage alt={data.description} src={data.image} />}
                </div>
                <div className="flex flex-col gap-2 pr-3">
                  <div className="px-1 py-0.5 w-fit font-normal text-xs bg-black/70 dark:bg-white/30 text-white rounded-sm">
                    {extractDomain(link)}
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

            {data && !isEmpty(data) && (
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  type="button"
                  disabled={!data || isPending}
                  className="py-1.5 h-fit flex items-center gap-2"
                  onClick={() => handleAddingLink({ url: link })}
                >
                  Save
                </Button>
              </div>
            )}
          </div>

          <hr className="w-full" />

          <div className="px-3 py-6 w-full flex flex-col items-center justify-center gap-1 rounded-md border-2 border-secondadry border-dashed">
            <input
              ref={InputRef}
              type="file"
              multiple
              onChange={(e) => e.target.files !== null && handleFileFromForm(e.target.files)}
              className="hidden"
            />
            <CloudUpload className="text-muted-foreground" />
            <p className="text-sm">Choose a file or drag & drop it</p>
            <p className="text-xs text-muted-foreground">PDF, up to 50MB</p>
            <Button
              size="sm"
              variant="outline"
              className="text-xs mt-3"
              onClick={() => InputRef.current?.click()}
            >
              Browse Files
            </Button>
          </div>

          <div className="grid grid-cols-[auto_0.5fr] justify-between gap-2 text-xs bg-blue-500/30 text-blue-500 rounded-lg px-2 py-3">
            <p>Download Chrome extension or press CMD + V to save link</p>
            <Link
              className="font-semibold"
              href={CHROME_EXTENSION_URL}
              target="_blank"
              referrerPolicy="no-referrer"
            >
              Download
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {[...files].map(
              (file) => file !== null && <ClipmateUploadItem key={file.file.name} file={file} />
            )}
          </div>

          {!isEmpty(files.filter((file) => file && file.task.snapshot.state === "running")) && (
            <div className="flex items-center justify-end gap-3">
              <Button size="sm" onClick={() => handleMinimize()}>
                Minimize
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClipmateAddItem;
