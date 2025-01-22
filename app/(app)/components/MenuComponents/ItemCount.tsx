import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { Progress } from "@/components/ui/progress";
import { IClipmateConnection } from "@/types/clipmate";

const BookmarksItemsCount = () => {
  const { user } = FireAuthHooks.useGetUser();
  const { data } = FirestoreHooks.useGetDoc<IClipmateConnection>(["users"], user.uid, {
    key: "getUserInfoLimits",
    onFocus: true,
  });

  const USED = Number(data?.limits.limit) - Number(data?.limits.remaining);
  const PROGRESS = (USED / Number(data?.limits.limit)) * 100;

  return (
    <div className="w-full flex gap-2 flex-col">
      <div className="flex items-center justify-between text-[13px]">
        <p className="font-medium">Item limit</p>
        <p className="font-medium">
          {USED || 0}/
          <span className="text-[#141414] dark:text-[#FAFAFA]">
            {data?.limits.limit} this month
          </span>
        </p>
      </div>

      <Progress className="h-2" value={PROGRESS} max={100} />
    </div>
  );
};

export default BookmarksItemsCount;
