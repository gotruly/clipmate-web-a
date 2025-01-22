import { HighlightValue, IClipmateReaderMode, IClipmateResponse } from "@/types/clipmate";
import ClipmateResolvedCard from "../ClipmateResolvedCard";
import useSidebarAtom from "@/stores/SidebarStore";
import { toast } from "sonner";
import FirestoreHooks from "@/app/api/hooks/firestore";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { cn } from "@/lib/utils";
import ClipmateReaderMode from "../ClipmateReaderMode";
import { arrayUnion } from "firebase/firestore";
import queryClient from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { RefreshCcw01 } from "@untitled-ui/icons-react";
import { Loader2 } from "lucide-react";
import FireFunctionHooks from "@/app/api/hooks/firefunction";

type Props = {
  value: IClipmateResponse;
};

const ClipmateFullPostLink = ({ value }: Props) => {
  const { open, openDialog, readerMode, handleOpenDialog } = useSidebarAtom();

  const { user } = FireAuthHooks.useGetUser();
  const { data, isLoading, isFetching } = FirestoreHooks.useGetDoc<IClipmateReaderMode>(
    ["users", user.uid, "reader"],
    value._id,
    { key: value._id }
  );

  const { mutate } = FirestoreHooks.useUpsertDoc<IClipmateReaderMode>(
    ["users", user.uid, "reader"],
    value._id,
    { key: value._id }
  );

  const RefetchLink = FireFunctionHooks.useSyncLink();

  const handleSave = () => {
    const data = { url: value.data.url };
    RefetchLink.mutate(data);

    toast.info("Processing link...");
    handleOpenDialog(false, { url: null, item: null });
  };

  const handleHighlighting = (highlight: HighlightValue) => {
    const { _id, ...rest } = data as IClipmateReaderMode;

    mutate(
      { ...rest, highlights: arrayUnion(highlight) },
      {
        onSuccess: () => {
          toast.success("Highlight added");
          queryClient.refetchQueries({ queryKey: [value._id] });
        },
        onError: () => toast.error("Error adding highlight"),
      }
    );
  };

  const notAvailable = !data?.md_clean;

  return (
    <>
      {!readerMode && <ClipmateResolvedCard value={value} inPopupView={openDialog} />}

      {!isLoading && readerMode && notAvailable && (
        <div className="w-full h-[calc(100vh-120px)] bg-card rounded-lg relative">
          <div className="container w-[720px] mx-auto py-10">
            <div className="space-y-2 w-full">
              <p className="text-center text-md font-semibold">Content not Available</p>
              <p className="text-sm text-center text-muted-foreground break-words">
                If you just saved or refetched this link, give the circuits on the server a minute
                to finish processing the site&apos;s content. If this is however a prior link, you
                can click the button below to try getting the content again.
              </p>
            </div>
          </div>

          <div className="w-full h-fit absolute bottom-0 left-0 py-3 flex items-center justify-center">
            <Button
              size="sm"
              variant="outline"
              className="gap-2 items-center"
              onClick={() => handleSave()}
            >
              <RefreshCcw01 width={16} height={16} />
              <span>Retry Fetching Content</span>
            </Button>
          </div>
        </div>
      )}

      {(isLoading || isFetching) && readerMode && notAvailable && (
        <div className="w-full h-[calc(100vh-120px)] bg-card rounded-lg overflow-hidden relative">
          <div className="w-full h-fit absolute bottom-[-50%] translate-y-[50%] left-0 py-3 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      )}

      {!isLoading && readerMode && !notAvailable && (
        <div className="w-full h-full bg-white dark:bg-card rounded-lg overflow-hidden">
          <div
            className={cn({
              "container w-[820px] mx-auto py-10": readerMode,
              "w-[720px]": open && readerMode,
            })}
          >
            <ClipmateReaderMode
              markdown={data?.md_clean || ""}
              highlights={data?.highlights || []}
              onChange={(v) => handleHighlighting(v)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ClipmateFullPostLink;
