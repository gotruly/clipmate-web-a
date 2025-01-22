/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "@/components/ui/card";
import { IClipmatePDF } from "@/types/clipmate";
import IconPicker from "../../../../components/custom/IconPicker";
import { ClipmateNextImage } from "../../../../components/custom/ClipmateImage";
import { BsFeather } from "react-icons/bs";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  value: IClipmatePDF;
};

const ClipmatePDFServerCard = ({ value }: Props) => {
  return (
    <Link href={value.data.file_CACHE || "#"}>
      <Card
        className={cn(
          "px-0 w-full h-fit pointer-events-auto cursor-default hover:bg-secondary hover:border-input transition-colors duration-300"
        )}
      >
        <CardContent className="flex flex-col gap-1 px-0 pt-0 pb-1 overflow-hidden">
          {/* Domain & Image */}
          <div className="relative w-full">
            <div className="px-2.5 py-2 w-full flex justify-end items-center absolute top-0 left-0 z-10">
              <IconPicker size={18} type={value.type} />
            </div>
            {/* Image */}
            {value.data.image_CACHE && value.data.image_CACHE !== "" && (
              <div className="overflow-hidden rounded-t-md w-full h-[250px] max-h-[250px] ">
                <ClipmateNextImage
                  draggable={false}
                  className="object-cover object-top w-full h-full"
                  src={value.data.image_CACHE}
                  alt={value.data.short_summary}
                />
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="flex flex-col px-3 py-2 gap-2 mt-3">
            <p className="text-sm font-semibold text-ellipsis text-wrap whitespace-wrap">
              {value.data.title}
            </p>

            {value.data.summary !== "No description" && (
              <p className="text-sm text-wrap text-ellipsis overflow-hidden whitespace-nowrap">
                {value.data.summary.slice(0, 150)}
                {value.data.summary.length > 150 && "..."}
              </p>
            )}

            {value.data.authors && (
              <div className="grid grid-cols-[0.1fr_auto] items-center gap-1.5 text-muted-foreground">
                <BsFeather className="p-0" size={15} />
                <p className="w-full pr-2 pt-1 text-xs text-ellipsis overflow-hidden whitespace-nowrap">
                  {value.data.authors.join(", ")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ClipmatePDFServerCard;
