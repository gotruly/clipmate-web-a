import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SVGProps, useEffect } from "react";

type Props = {
  link: {
    name: string;
    href: string;
    icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  };
};

const LinksItem = ({ link }: Props) => {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.prefetch(link.href);
  }, [link.href, router, path]);

  return (
    <Link
      className={cn(
        "h-[26px] grid grid-cols-[15px_auto] items-center gap-2.5 px-2 rounded-md dark:hover:bg-secondary/50 hover:bg-muted/50 font-medium",
        {
          "dark:bg-secondary bg-muted drop-shadow-sm": path === link.href,
        }
      )}
      href={link.href}
      prefetch={true}
      shallow={true}
    >
      <link.icon
        className="text-[#525252] dark:text-[#A3A3A3]"
        strokeWidth={2.2}
        width={16}
        height={16}
      />
      <p className="h-[19px] m-0 p-0 text-[#424242] dark:text-[#D6D6D6]">{link.name}</p>
    </Link>
  );
};

export default LinksItem;
