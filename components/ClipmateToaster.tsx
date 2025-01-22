"use client";

import IconPicker from "@/components/custom/IconPicker";
import { Toaster } from "./ui/sonner";

const ClipmateToaster = () => {
  return (
    <Toaster
      toastOptions={{
        classNames: {
          toast: "bg-white border-none rounded-[12px] shadow-md py-3 gap-[8px]",
          title: "text-black text-[13px]",
          icon: "text-black",
          closeButton:
            "text-black border-none absolute top-[50%] !left-[92%] !right-2 translate-y-[-50%]",
        },
      }}
      offset={10}
      icons={{
        success: <IconPicker className="mt-0.5" type="check" size={20} />,
      }}
      closeButton
    />
  );
};

export default ClipmateToaster;
