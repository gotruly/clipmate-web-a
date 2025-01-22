import { cn } from "@/lib/utils";

type Props = {
  keys: string[];
  text: string;
  hidden?: boolean;
  destructive?: boolean;
  onClick?: () => void;
};

const ClipmateKeyboardShortcut = ({ keys, text, hidden, destructive, onClick }: Props) => {
  return (
    <div
      role="button"
      className={cn(
        "flex items-center h-fit w-fit gap-1.5 p-1 px-2 !text-xs font-medium rounded-md cursor-pointer hover:bg-muted/50 focus-visible:!outline-none focus-visible:!ring-0",
        text,
        { hidden: hidden }
      )}
      onClick={() => onClick && onClick()}
    >
      <p
        className={cn("text-xs text-[#424242] dark:text-[#E5E5E5]", {
          "text-destructive": destructive,
        })}
      >
        {text}
      </p>
      <div className="flex items-center gap-1">
        <div
          className={cn(
            "px-1.5 h-[20px] flex items-center gap-0.5 bg-transparent border border-[#E5E5E5] dark:border-[#292929] rounded-sm",
            {
              "bg-destructive/20 text-destructive border-destructive": destructive,
            }
          )}
        >
          {keys.map((key, index) => (
            <span className="text-[#737373] dark:text-[#A3A3A3]" key={key + index}>
              {key}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClipmateKeyboardShortcut;
