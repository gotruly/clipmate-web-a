import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Globe01, Lock04 } from "@untitled-ui/icons-react";

type Props = {
  visibility: boolean;
};

const DefaultAdjustment =
  "flex items-center text-[13px] font-medium gap-1 py-[1px] px-2 border-[1.8px]";

const VisibilityIndicator = ({ visibility }: Props) => {
  const ResolvedVisibility = visibility ? "public" : "private";
  const CompMap: Record<string, JSX.Element> = {
    public: (
      <Badge
        variant="outline"
        className={cn(
          "!bg-green-500/10 !text-green-600 !border-green-500 dark:!bg-[#053321] dark:!text-[#75E0A7] dark:!border-[#085D3A]",
          DefaultAdjustment
        )}
      >
        <Globe01 width={14} height={14} />
        Public collection
      </Badge>
    ),
    private: (
      <Badge variant="outline" className={cn("!bg-transparent", DefaultAdjustment)}>
        <Lock04 width={14} height={14} />
        Private collection
      </Badge>
    ),
  };

  return CompMap[ResolvedVisibility];
};

const SharedVisibilityIndicator = () => {
  return (
    <Badge variant="outline" className={cn("!bg-transparent", DefaultAdjustment)}>
      <Globe01 width={14} height={14} />
      Shared collection
    </Badge>
  );
};

export { SharedVisibilityIndicator };
export default VisibilityIndicator;
