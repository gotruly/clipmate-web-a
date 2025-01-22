import { useMutation, useQuery } from "@tanstack/react-query";

const GetMetaData = async (url: string) => {
  try {
    const response = await fetch(`https://api.dub.co/metatags?url=${url}`);
    const res = await response.json();

    return res;
  } catch (error) {
    return { error };
  }
};

export const useGetMetaData = (url: string) => {
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      if (url !== "") {
        return await GetMetaData(url);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export const useMutateToGetMetaData = () => {
  return useMutation({
    mutationKey: ["getMetaData"],
    mutationFn: async (data: { url: string }) => {
      if (data.url !== "") {
        return await GetMetaData(data.url);
      }
    },
  });
};
