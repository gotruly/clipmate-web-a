import { Button } from "@/components/ui/button";
import useSettingsModalAtom from "@/stores/SettingsModalStore";
import { Folder } from "@untitled-ui/icons-react";

const ScreenshotEmptyState = () => {
  const { setOpen } = useSettingsModalAtom();

  return (
    <div className="flex flex-col items-center justify-center text-sm gap-3">
      <div className="bg-secondary rounded-full w-[40px] h-[40px] flex items-center justify-center">
        <Folder width={16} />
      </div>

      <div className="text-center space-y-1">
        <p>No Screenshots added</p>
        <p className="text-zinc-500">Connect to start saving screenshots to Clipmate</p>
      </div>

      <Button size="sm" onClick={() => setOpen(true)}>
        Get started
      </Button>
    </div>
  );
};

export default ScreenshotEmptyState;
