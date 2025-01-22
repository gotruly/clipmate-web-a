import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  bgClass?: string;
};

const ClipmateDivider = ({ children, bgClass }: Props) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="h-[0.5px] absolute w-full top-1/2 left-0 translate-y-1/2 bg-input" />
      <div
        className={cn(
          "w-fit flex items-center justify-center z-10 bg-card dark:bg-background px-2 py-1 text-xs text-muted-foreground",
          bgClass
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ClipmateDivider;
