import FirestoreHooks from "@/app/api/hooks/firestore";
import { Button } from "@/components/ui/button";
import queryClient from "@/lib/queryClient";
import { FolderMinus, Minus, Plus } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  id: string;
};

const FollowButton = ({ id }: Props) => {
  const router = useRouter();

  const Following = FirestoreHooks.useGetDoc(["collections_follow"], id, {
    key: "getFollowingCollection",
  });

  const UnFollow = FirestoreHooks.useDeleteDoc(["collections_follow"], {
    key: "unfollowCollection",
  });

  const handleUnfollowCollection = () => {
    UnFollow.mutate(id, {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["getAllFollowedCollections"] });
        router.push("/");
        toast.success("Collection unfollowed successfully");
      },
      onError: () => {
        toast.error("Failed to unfollow collection");
      },
    });
  };

  const isFollowing = Following.data;

  return (
    <>
      {isFollowing && (
        <Button
          variant="outline"
          className="h-7 gap-2 items-center"
          size="sm"
          disabled={UnFollow.isPending}
          onClick={() => handleUnfollowCollection()}
        >
          <FolderMinus width={16} />
          Unfollow
        </Button>
      )}
    </>
  );
};

export default FollowButton;
