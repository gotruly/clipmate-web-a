"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
import { Button } from "@/components/ui/button";
import PublicSignInDialog from "./auth/signInDialog";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { Timestamp, where } from "firebase/firestore";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  uid: string;
};

const PublicFollowButton = ({ id, uid }: Props) => {
  const router = useRouter();
  const { user } = FireAuthHooks.useGetUser();

  const [docId, setDocId] = useState<string>("");

  const { data, isLoading } = FirestoreHooks.useGetManyDocs(["collections_follow", docId], {
    key: "getAllFollowedCollections",
    constraints: [
      where("user_id", "==", user ? user.uid : ""),
      where("collection_id", "==", id),
      where("origin_user_id", "==", uid),
    ],
  });

  const { mutate, isPending } = FirestoreHooks.useAddDoc(["collections_follow", docId], {
    key: "followCollection",
  });

  const [isFollowing, setIsFollowing] = useState(data && data.length > 0);

  const handleFollowCollection = () => {
    const doc_id = nanoid();
    setDocId(doc_id);

    const payload = {
      user_id: user.uid,
      origin_user_id: uid,
      collection_id: id,
      date_created: Timestamp.fromDate(new Date()),
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Collection followed successfully");
        setIsFollowing(true);
        router.push(`/following/${doc_id}`);
      },
      onError: () => {
        toast.error("Failed to follow collection");
      },
    });
  };

  return (
    <>
      {user && user.uid !== uid && !isFollowing && (
        <Button
          variant={isFollowing ? "outline" : "default"}
          className="rounded-full"
          onClick={() => handleFollowCollection()}
          disabled={isPending || isFollowing || isLoading}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      )}

      {user && user.uid !== uid && isFollowing && (
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => handleFollowCollection()}
          disabled={isFollowing}
        >
          Following
        </Button>
      )}

      {!user && <PublicSignInDialog id={id} uid={uid} />}
    </>
  );
};

export default PublicFollowButton;
