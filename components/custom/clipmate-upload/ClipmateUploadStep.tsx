import { Loader, XCircle } from "lucide-react";
import IconPicker from "../IconPicker";

type Props = {
  completed: boolean;
  isCanceled: boolean;
};

export const ClipmateUploadStepIcon = ({ completed, isCanceled }: Props) => {
  return (
    <>
      {!completed && !isCanceled && (
        <Loader size={12} className="text-primary animate-spin duration-2000" />
      )}
      {completed && !isCanceled && <IconPicker type="check" size={12} />}
      {!completed && isCanceled && <XCircle size={12} className="text-red-600" />}
    </>
  );
};

export const ClipmateUploadStepText = ({ completed, isCanceled }: Props) => {
  return (
    <>
      {!completed && !isCanceled && <p>Uploading</p>}
      {completed && !isCanceled && <p>Uploaded</p>}
      {!completed && isCanceled && <p>Canceled</p>}
    </>
  );
};
