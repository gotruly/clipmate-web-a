/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "@/components/ui/card";
import { IClipmateLink } from "@/types/clipmate";
import IconPicker from "../../../../components/custom/IconPicker";
import extractDomain from "extract-domain";
import ClipmateImage from "../../../../components/custom/ClipmateImage";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  value: IClipmateLink;
};

const ClipmateLinkServerCard = ({ value }: Props) => {
  return (
    <Link href={value.data.url} target="_blank" referrerPolicy="no-referrer">
      <Card
        className={cn(
          "px-0 w-full h-fit cursor-default hover:bg-secondary hover:border-input transition-colors duration-300"
        )}
      >
        <CardContent className="flex flex-col gap-1 px-0 pt-0 pb-1 overflow-hidden">
          {/* Domain & Image */}
          <div className="relative">
            <div className="px-2.5 py-2 w-full flex justify-between items-center absolute top-0 left-0 z-10">
              <div className="px-1 py-0.5 font-normal text-xs bg-black/70 text-white rounded-sm">
                {extractDomain(value.data.url)}
              </div>

              <IconPicker size={18} type={value.type} />
            </div>
            {/* Image */}
            <div className="overflow-hidden rounded-t-md w-full h-[180px] max-h-[180px] ">
              {value.data.image && (
                <ClipmateImage src={value.data.image} alt={value.data.description} />
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="flex flex-col px-3 py-2 gap-1">
            <div>
              <p className="text-sm font-semibold text-ellipsis text-wrap whitespace-wrap">
                {value.data.title}
              </p>
            </div>
            {value.data.description !== "No description" && (
              <p className="text-sm text-wrap text-ellipsis overflow-hidden whitespace-nowrap w-full content">
                {value.data.description.slice(0, 125)}
                {value.data.description.length > 125 && "..."}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ClipmateLinkServerCard;
