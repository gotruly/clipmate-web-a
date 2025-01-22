import IconPicker from "./IconPicker";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Progress } from "../ui/progress";
import { partial } from "filesize";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { toast } from "sonner";
import { FileType } from "@/context/DragNDropFromOSContext";
import {
  ClipmateUploadStepIcon,
  ClipmateUploadStepText,
} from "./clipmate-upload/ClipmateUploadStep";
import FireFunctionHooks from "@/app/api/hooks/firefunction";
import { Button } from "../ui/button";
import { useDragNDropContext } from "@/lib/hooks";
import { Trash04 } from "@untitled-ui/icons-react";

type Props = {
  file: FileType;
};

const size = partial({ standard: "jedec" });

const ClipmateUploadItem = ({ file }: Props) => {
  const { user } = FireAuthHooks.useGetUser();
  const { mutate } = FireFunctionHooks.useProcessFiles();
  const { setFiles } = useDragNDropContext();

  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [transfered, setTransfered] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [isCanceled, setIsCanceled] = useState<boolean>(false);

  const filename = ["user_uploads", user.uid, file.file.name].join("/");

  const handleUploadCancel = () => {
    setIsCanceled(true);
  };

  const handleUploadSuccess = () => {
    setCompleted(true);

    toast.info("Proccessing: " + `${file.file.name.slice(0, 20)}...`);
  };

  useEffect(() => {
    file.task.on(
      "state_changed",
      (snapshot) => {
        setProgressPercent((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setTransfered(snapshot.bytesTransferred);
      },
      (error) => {
        error.code === "storage/canceled" && handleUploadCancel();
      },
      () => {
        handleUploadSuccess();

        mutate({
          data: {
            files: [
              {
                storage_path: filename,
                file_name: file.file.name,
                local_path: file.file.webkitRelativePath,
              },
            ],
          },
        });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = () => {
    setFiles((prev) => prev.filter((f) => f && f.file.name !== file.file.name));
  };

  return (
    <div className="p-2.5 border border-border rounded-md flex flex-col gap-3 relative">
      {!completed && isCanceled && (
        <Button
          variant="ghost"
          size="icon"
          className="m-3 w-4 h-4 absolute right-0 top-0 cursor-pointer !bg-transparent"
          onClick={() => handleDelete()}
        >
          <Trash04 width={13} />
        </Button>
      )}

      {!completed && !isCanceled && (
        <Button
          variant="ghost"
          size="icon"
          className="m-3 w-4 h-4 absolute right-0 top-0 cursor-pointer !bg-transparent"
          onClick={() => file.task.cancel()}
        >
          <X size={13} />
        </Button>
      )}

      <div className="flex items-center gap-2" key={file.file.name}>
        <IconPicker size={40} type={file.file.type} />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap max-w-[30ch]">
            {file.file.name}
          </p>

          <div className="flex items-center gap-1.5 text-xs">
            <p>
              {size(isCanceled ? 0 : transfered)} of {size(file.file.size)}
            </p>

            <p>&bull;</p>

            <ClipmateUploadStepIcon completed={completed} isCanceled={isCanceled} />
            <ClipmateUploadStepText completed={completed} isCanceled={isCanceled} />
          </div>
        </div>
      </div>

      {!isCanceled && <Progress className={"h-1.5"} value={progressPercent} />}
    </div>
  );
};

export default ClipmateUploadItem;
