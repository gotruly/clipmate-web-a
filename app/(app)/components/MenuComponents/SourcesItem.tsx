import IconPicker from "@/components/custom/IconPicker";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  source: {
    name: string;
    type: string;
    href: string;
  };
};

const SourcesItem = ({ source }: Props) => {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.prefetch(source.href);
  }, [source.href, router, path]);

  return (
    <Link
      className={cn(
        "h-[26px] grid grid-cols-[15px_auto_auto] items-center gap-2.5 px-2 rounded-md dark:hover:bg-secondary/50 hover:bg-muted/50 text-[13px] font-medium",
        {
          "dark:bg-secondary bg-muted drop-shadow-sm": path.includes(source.href),
        }
      )}
      href={source.href}
      prefetch={true}
      shallow={true}
    >
      <IconPicker type={source.type} size={16} />
      <span className="text-[#424242] dark:text-[#D6D6D6]">{source.name}</span>
    </Link>
  );
};

export default SourcesItem;
