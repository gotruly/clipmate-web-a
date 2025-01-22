import { Button } from "@/components/ui/button";
import useSettingsModalAtom from "@/stores/SettingsModalStore";
import { Folder } from "@untitled-ui/icons-react";

const GithubEmptyState = () => {
  const { setOpen } = useSettingsModalAtom();

  return (
    <div className="flex flex-col items-center justify-center text-sm gap-3">
      <div className="bg-secondary rounded-full w-[40px] h-[40px] flex items-center justify-center">
        <Folder width={16} />
      </div>

      <div className="text-center space-y-1">
        <p>No Github repo added</p>
        <p className="text-muted-foreground">Connect your Github account to get started</p>
      </div>

      <Button size="sm" onClick={() => setOpen(true)}>
        Get started
      </Button>
    </div>
  );
};

export default GithubEmptyState;
