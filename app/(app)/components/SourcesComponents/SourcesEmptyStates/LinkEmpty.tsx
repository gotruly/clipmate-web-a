import { Button } from "@/components/ui/button";
import { Folder } from "@untitled-ui/icons-react";
import { Command } from "lucide-react";
import Link from "next/link";

const LinkEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-sm gap-3">
      <div className="bg-secondary rounded-full w-[40px] h-[40px] flex items-center justify-center">
        <Folder width={16} />
      </div>

      <div className="text-center space-y-1">
        <p>No items added</p>
        <p className="text-muted-foreground">Add your bookmarks to get started</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        Paste link using
        <p className="text-xs flex items-center gap-1 bg-secondary border border-border rounded-md py-2 px-2">
          <Command size={14} /> V
        </p>
        <p className="w-full flex items-center justify-center">or</p>
        <Button asChild size="sm" variant="outline">
          <Link
            className="flex items-center gap-2"
            target="_blank"
            referrerPolicy="no-referrer"
            href="https://chromewebstore.google.com/detail/clipmate-ai/mafodmdmlnaeedjmkcahoalllaaleehj"
          >
            Download Extension
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LinkEmptyState;
