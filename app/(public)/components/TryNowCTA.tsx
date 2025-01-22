import IconPicker from "@/components/custom/IconPicker";
import Link from "next/link";

const TryNowCTA = () => {
  return (
    <div className="w-full h-fit py-3 px-3 fixed bottom-0 lg:top-1 left-0 bg-transparent z-30 flex flex-col items-center lg:items-end pointer-events-none">
      <Link
        href="https://clipmate.ai"
        target="_blank"
        referrerPolicy="no-referrer"
        className="pointer-events-auto"
      >
        <div className="bg-white text-black p-1 pl-2 rounded-xl text-sm w-fit h-fit flex items-center gap-2">
          Collection by <IconPicker type="alternate" size={24} />
          <div className="bg-primary rounded-xl px-2 text-white flex items-center text-[13px] font-normal h-7">
            Try now
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TryNowCTA;
