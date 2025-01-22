"use client";

import { Auth } from "@/app/api/firebase";
import queryClient from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PublicFollowButton from "./FollowButton";

type Props = {
  id: string;
  uid: string;
};

const RedirectToCollection = ({ id, uid }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicFollowButton id={id} uid={uid} />
    </QueryClientProvider>
  );
};

export default RedirectToCollection;
