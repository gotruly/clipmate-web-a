"use client";

import queryClient from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import FireAuthHooks from "../api/hooks/fireauth";
import ClipmateToaster from "@/components/ClipmateToaster";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  FireAuthHooks.useIsUserAuth();

  return (
    <div className="w-full h-screen flex items-center justify-center bg-card dark:bg-background">
      <div className="w-full sm:max-w-[320px]">
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        <ClipmateToaster />
      </div>
    </div>
  );
};

export default AuthLayout;
