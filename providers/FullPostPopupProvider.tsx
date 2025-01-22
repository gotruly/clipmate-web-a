import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestorageHooks from "@/app/api/hooks/firestorage";
import FullPostFloatingMenu from "@/components/custom/clipmate-full-post/FullPostFloatinMenu";
import ClipmateFullPost from "@/components/custom/ClipmateFullPost";
import { cn } from "@/lib/utils";
import useSidebarAtom from "@/stores/SidebarStore";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export const FullPostPopupProvider = ({ children }: Props) => {
  const { item, url, openDialog, readerMode, handleOpenDialog } = useSidebarAtom();

  const { user } = FireAuthHooks.useGetUser();
  const File = FirestorageHooks.useGetDownloadLink(
    ["user_files", user.uid, item?.data.storage_file_name],
    { key: item?.data.storage_file_path }
  );

  const requiresBigScreen = item?.type === "screenshot" || item?.type === "PDF";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const PostBackdrop = e.target === document.querySelector(".post-backdrop");

      if (openDialog && PostBackdrop) {
        handleOpenDialog(false, { item: null, url: null });
      }
    };

    document.addEventListener("click", (e) => handleClickOutside(e));

    return () => {
      document.removeEventListener("click", (e) => handleClickOutside(e));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog]);

  return (
    <>
      {children}

      <div
        className={cn(
          "post-backdrop fixed top-0 left-0 bg-black/60 backdrop-blur-md h-screen w-full flex flex-col justify-center items-center z-50 pointer-events-auto",
          {
            hidden: !openDialog,
            "justify-start pt-4": (openDialog && readerMode) || requiresBigScreen,
          }
        )}
      >
        <ClipmateFullPost />
      </div>

      {item && <FullPostFloatingMenu item={item} url={url} file={File.data} />}
    </>
  );
};
