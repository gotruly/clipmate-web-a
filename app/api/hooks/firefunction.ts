import { useMutation } from "@tanstack/react-query";
import FireFunction, {
  ActivateFnParams,
  DeleteCollection,
  DeleteItem,
  DeleteSource,
  LinkFnParams,
  ProcessFileFnParams,
  SearchFnParams,
  SyncSourceParams,
} from "../firefunctions";

const FireFunctionHooks = {
  /**
   * useSyncSource - hook for syncing a source (Twitter, Reddit, etc.)
   * @returns `UseMutationResult<FnReturn, unknown>`
   */
  useSyncSource: () => {
    return useMutation({
      mutationFn: ({ type, access_token, refresh_token }: SyncSourceParams) => {
        return FireFunction.syncSource({ type, access_token, refresh_token });
      },
    });
  },
  /**
   * useSyncLink - hook for add Link
   * @returns `UseMutationResult<T, unknown>`
   */
  useSyncLink: () => {
    return useMutation({
      mutationFn: ({ url }: LinkFnParams) => {
        return FireFunction.syncLink({ url });
      },
    });
  },
  /**
   * useProcessFiles - hook for processing files after uploading them to storage
   * @returns `UseMutationResult<T, unknown>`
   */
  useProcessFiles: () => {
    return useMutation({
      mutationFn: ({ data }: ProcessFileFnParams) => {
        return FireFunction.processFiles({ data });
      },
    });
  },
  /**
   * useSearch - hook for searching bookmarks
   * @returns `UseMutationResult<SearchResult, unknown>`
   */
  useSearch: () => {
    return useMutation({
      mutationFn: ({ query, type_filter }: SearchFnParams) => {
        return FireFunction.search({ query, type_filter });
      },
    });
  },
  /**
   * useActivateAccount - hook for activating account
   * @returns `UseMutationResult<SearchResult, unknown>`
   */
  useActivateAccount: () => {
    return useMutation({
      mutationFn: ({ code }: ActivateFnParams) => {
        return FireFunction.activateAccount({ code });
      },
    });
  },
  /**
   * useDeleteCollection - hook for deleting collection
   * @returns `UseMutationResult<FnReturn, unknown>`
   */
  useDeleteCollection: () => {
    return useMutation({
      mutationFn: ({ id }: DeleteCollection) => {
        return FireFunction.deleteCollection({ id });
      },
    });
  },
  /**
   * useDeleteSource - hook for deleting sources ie. Twitter or Reddit
   * @returns `UseMutationResult<FnReturn, unknown>`
   */
  useDeleteSource: () => {
    return useMutation({
      mutationFn: ({ type }: DeleteSource) => {
        return FireFunction.deleteSource({ type });
      },
    });
  },
  /**
   * useDeleteItem - hook for deleting items
   * @returns `UseMutationResult<FnReturn, unknown>`
   */
  useDeleteItem: () => {
    return useMutation({
      mutationKey: ["deleteItem"],
      mutationFn: ({ items }: DeleteItem) => {
        return FireFunction.deleteItem({ items });
      },
    });
  },
  /**
   * useDeleteAccount - hook for deleting user account and data
   * @returns `UseMutationResult<FnReturn, unknown>`
   */
  useDeleteAccount: () => {
    return useMutation({
      mutationFn: () => {
        return FireFunction.deleteAccount();
      },
    });
  },
};

export default FireFunctionHooks;
