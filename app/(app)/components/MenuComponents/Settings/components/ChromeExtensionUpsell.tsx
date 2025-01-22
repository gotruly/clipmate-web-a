import { Button } from "@/components/ui/button";
import Link from "next/link";
import IconPicker from "@/components/custom/IconPicker";
import { CHROME_EXTENSION_URL } from "@/constants";

const ChromeExtensionUpsell = () => {
  const value = {
    type: "chrome",
    label: "Chrome Extension",
    url: CHROME_EXTENSION_URL,
    description: "Save links directly from your browser to Clipmate",
  };

  return (
    <div
      key={value.type}
      className="flex items-center justify-between border border-border rounded-xl py-2 px-3"
      data-scroll-locked={1}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl">
          <IconPicker type={value.type} size={28} />
        </div>

        <div>
          <p className="text-sm font-medium">{value.label}</p>
          <p className="text-xs text-muted-foreground">{value.description}</p>
        </div>
      </div>

      <div>
        <Button variant="outline" className="h-8 dark:border-[#424242]" asChild>
          <Link href={value.url} target="_blank" referrerPolicy="no-referrer">
            Download
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ChromeExtensionUpsell;
