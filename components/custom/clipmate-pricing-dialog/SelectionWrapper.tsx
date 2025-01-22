"use client";

import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

const SelectionWrapper = ({ children }: Props) => {
  return (
    <div className="bg-[#FFFFFF] dark:bg-card px-4 py-3 rounded-t-[16px] self-end w-full flex flex-col gap-3 absolute bottom-0 left-0 shadow-md">
      {children}
      <div className="w-full flex flex-col gap-2 items-center justify-center mt-4">
        <p className="text-xs dark:text-[#D6D6D6]">No commitment. Cancel anytime.</p>
        <p className="font-semibold text-xs dark:text-[#D6D6D6]">
          <Link href="#">Terms of use</Link> ⋅ <Link href="#">Restore</Link> ⋅{" "}
          <Link href="#">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default SelectionWrapper;
