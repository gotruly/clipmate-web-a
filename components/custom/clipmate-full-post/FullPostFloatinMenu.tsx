import { IClipmateResponse } from "@/types/clipmate";
import FullPostNavigation from "./FullPostNavigation";
import { createPortal } from "react-dom";

type Props = {
  item: IClipmateResponse;
  url: string | null;
  file?: string;
};

const FullPostFloatingMenu = ({ item, url, file }: Props) => {
  return createPortal(
    <div className="fixed bottom-6 -left-[0px] w-full flex items-center justify-center !z-[99] !pointer-events-auto floating-menu">
      <FullPostNavigation item={item} url={url || file || ""} />
    </div>,
    document.body
  );
};

export default FullPostFloatingMenu;
