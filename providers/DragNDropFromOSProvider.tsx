import ClipmateAddItem from "@/components/custom/ClipmateAddItem";
import DragNDropFromOSContext, { FileType } from "@/context/DragNDropFromOSContext";
import { AllowedFiles, cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import mime from "mime-types";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { ref, uploadBytesResumable } from "firebase/storage";
import { Storage } from "@/app/api/firebase";
import { isEmpty } from "lodash";
import UploadIcon from "@/components/icons/upload";

const DragNDropFromOSContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = FireAuthHooks.useGetUser();

  const [entered, setEntered] = useState<boolean>(false);
  const [files, setFiles] = useState<(FileType | null)[]>([null]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const setFilesFromForm = (files: FileList) => {
    const not_allowed: Set<string | false> = new Set();

    const allowed = [...files]
      .map((file) => {
        if (AllowedFiles(file.type)) {
          if (!file) {
            return null;
          }

          if (file && file.size > 50000000) {
            toast.warning("File is large than 50MB");
            return null;
          }

          const filename = ["user_uploads", user.uid, file.name].join("/");
          const uploadRef = ref(Storage, filename);
          return { file: file, task: uploadBytesResumable(uploadRef, file) };
        } else {
          const extension = mime.extension(file.type);
          not_allowed.add(extension);
          return null;
        }
      })
      .filter((file) => file !== null);

    if (not_allowed.size > 0) {
      toast.warning(`We don't support ${[...not_allowed].join(",")} yet`, { duration: 5000 });
    }

    setFiles((prev) => [...prev, ...[...allowed]]);
  };

  const handleEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isEmpty([...e.dataTransfer.items])) setEntered(false);
    else setEntered(true);
  };

  const handleLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setEntered(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setEntered(false);

    if (e.dataTransfer.items) {
      const not_allowed: Set<string | false> = new Set();

      const uploaded_files = [...e.dataTransfer.items]
        .map((item) => {
          if (item.kind === "file" && AllowedFiles(item.type)) {
            const file = item.getAsFile();

            if (!file) {
              return null;
            }

            if (file && file.size > 50000000) {
              toast.warning("File is large than 50MB");
              return null;
            }

            const filename = ["user_uploads", user.uid, file?.name].join("/");
            const uploadRef = ref(Storage, filename);
            return { file: file, task: uploadBytesResumable(uploadRef, file) };
          } else {
            const extension = mime.extension(item.type);
            not_allowed.add(extension);
            return null;
          }
        })
        .filter((item) => item !== null);

      if (uploaded_files.length > 0) {
        setFiles((prev) => [...prev, ...uploaded_files]);
        setOpenDialog(true);
      }

      if (not_allowed.size > 0) {
        toast.warning(`We don't support ${[...not_allowed].join(",")} yet`, { duration: 5000 });
      }
    }
  };

  return (
    <DragNDropFromOSContext.Provider
      value={{ files, setFiles, setFilesFromForm, openDialog, setOpenDialog }}
    >
      <div
        className="relative drop-zone"
        onDragEnter={(e) => handleEnter(e)}
        onDragOver={(e) => handleOver(e)}
        onDragLeave={(e) => handleLeave(e)}
        onDrop={(e) => handleDrop(e)}
      >
        <ClipmateAddItem />
        <div
          className={cn(
            "fixed top-0 left-0 h-screen w-full hidden opacity-0 transition pointer-events-none z-50 bg-black/70 backdrop-blur-sm items-center justify-center duration-1000",
            { "flex opacity-1 transition pointer-events-auto": entered && !openDialog }
          )}
        >
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <UploadIcon width={150} height={150} />
            <h1 className="text-2xl text-center font-semibold text-white">Upload to Clipmate</h1>
          </div>
        </div>
        {children}
      </div>
    </DragNDropFromOSContext.Provider>
  );
};

export default DragNDropFromOSContextProvider;
