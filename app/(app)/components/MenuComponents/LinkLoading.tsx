import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  index: number;
};

const SkeletonItem = ({ index }: Props) => {
  return (
    <div className="grid grid-cols-[auto_30px] gap-2.5 items-center">
      <Skeleton className={cn("h-3 w-full", { "w-[70px]": index % 2 === 0 })} />
      <Skeleton className="h-5 w-[30px] rounded-md" />
    </div>
  );
};

const LinkLoading = () => {
  const List = {
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.65, delayChildren: 0.1 },
    },
    hidden: {
      opacity: 0,
      transition: { staggerChildren: 0.65, delayChildren: 0.1 },
    },
  };

  const Item = {
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.5,
        ease: "linear",
      },
    }),
    hidden: { opacity: 0, y: -10 },
  };

  const Items = Array.from({ length: 10 }, () => "");

  return (
    <motion.div className="grid gap-2.5" initial="hidden" animate="visible" variants={List}>
      {Items.map((_, i) => (
        <motion.div custom={i} key={i} variants={Item}>
          <SkeletonItem index={i} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LinkLoading;
