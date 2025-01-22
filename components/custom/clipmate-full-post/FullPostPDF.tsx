import { IClipmateResponse } from "@/types/clipmate";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestorageHooks from "@/app/api/hooks/firestorage";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  value: IClipmateResponse;
};

const ClipmateFullPostPDF = ({ value }: Props) => {
  const [loading, setLoading] = useState(false);
  const { user } = FireAuthHooks.useGetUser();

  const { data, isLoading } = FirestorageHooks.useGetDownloadLink(
    ["user_files", user.uid, value.data.storage_file_name],
    { key: value.data.storage_file_path }
  );

  useEffect(() => {
    setLoading(true);
  }, [value]);

  return (
    <div className="w-full h-[calc(100vh-120px)] relative rounded-md overflow-hidden">
      <iframe
        src={`${data}#toolbar=0&navpanes=0`}
        width="100%"
        height="100%"
        title={value.data.title}
        onLoad={() => setLoading(false)}
      />

      {loading && (
        <div className="w-[300px] h-[150px] bg-background/70 z-[999] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col gap-2 items-center justify-center rounded-md">
          <Loader2 className="animate-spin" />
          <p className="text-sm font-semibold">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default ClipmateFullPostPDF;
