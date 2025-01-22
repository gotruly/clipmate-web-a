import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const ClipmateSynedBadge = ({ count, isLoading }: { count: number; isLoading?: boolean }) => {
  return (
    <Badge className="!bg-green-500/10 !text-green-600 !border-green-500 dark:!bg-[#053321] dark:!text-[#75E0A7] dark:!border-[#085D3A] text-[11px] py-0 px-2 h-fit font-medium border flex items-center gap-1">
      {isLoading && isLoading ? <Loader2 className="animate-spin" /> : <p>{count}</p>}
      <p>Synced</p>
    </Badge>
  );
};

const ClipmateUpgradeBadge = () => {
  return (
    <Badge className="!bg-blue-500/10 !text-blue-600 !border-blue-500 dark:!bg-[#062C41] dark:!text-[#7CD4FD] dark:!border-[#065986] text-[11px] py-0 px-2 h-fit font-medium border flex items-center gap-1">
      <p>Upgrade</p>
    </Badge>
  );
};

export { ClipmateUpgradeBadge };
export default ClipmateSynedBadge;
