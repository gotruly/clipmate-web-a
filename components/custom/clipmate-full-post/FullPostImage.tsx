import { IClipmateResponse } from "@/types/clipmate";
import { ClipmateNextImage } from "../ClipmateImage";

type Props = {
  value: IClipmateResponse;
};

const ClipmateFullPostScreenshot = ({ value }: Props) => {
  return (
    <div className="container mx-auto w-fit h-[calc(100vh-120px)] overflow-hidden rounded-none">
      <ClipmateNextImage
        className="w-full h-full object-contain rounded-none"
        src={value.data.url}
        alt={value.data.title}
        bgClass="h-full bg-transparent overflow-hidden rounded-none"
      />
    </div>
  );
};

export default ClipmateFullPostScreenshot;
