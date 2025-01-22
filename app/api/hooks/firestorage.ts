import { useQuery } from "@tanstack/react-query";
import Firestorage from "../firestorage";

type StorageQueryType = { key: string };

const FirestorageHooks = {
  /**
   * useGetDownloadLink - returns the download link from Firebasr to
   * view the item or open in a new tab
   * @returns `UseMutationResult<T, unknown>`
   */
  useGetDownloadLink: (url: string[], { key }: StorageQueryType) => {
    return useQuery({
      queryKey: [url, key],
      queryFn: () => {
        return Firestorage.GetDownloadLink(url.join("/"));
      },
    });
  },
};

export default FirestorageHooks;
