import { useMutation, useQuery } from "@tanstack/react-query";
import Firestore from "../firestore";
import { DocumentData, QueryConstraint, QueryDocumentSnapshot } from "firebase/firestore";
import { IClipmateBase } from "@/types/clipmate";

export type DocsMutationType = { key: string; constraints?: QueryConstraint[] };
type DocsQueryType = {
  key: string;
  constraints?: QueryConstraint[];
  gcTime?: number;
  placeholder?: any;
  onFocus?: boolean;
};
export type ToMany = { params: IClipmateBase[]; id: string; isPublic: boolean };
type ToRemoveMany = { params: IClipmateBase[]; id: string };
export type MoveToTrash = { params: IClipmateBase[] };

const FirestoreHooks = {
  /**
   * useAddDoc - hooks for adding document to a collection
   * @param url string
   * @returns `UseMutationResult<T, unknown>`
   */
  useAddDoc: <T>(url: string[], { key }: DocsMutationType) =>
    useMutation({
      mutationKey: [key],
      mutationFn: (params: Record<string, any>) => {
        return Firestore.addDocs<T>(params, url.join("/"));
      },
    }),
  /**
   * useAddManyBookmarksToCollection - hooks for adding many bookmarks to a clipmate collection
   * @param url string
   * @returns `UseMutationResult<T, unknown>`
   */
  useAddManyBookmarksToCollection: <T>(url: string[], { key }: DocsMutationType) =>
    useMutation({
      mutationKey: [key],
      mutationFn: (data: ToMany) => {
        return Firestore.addManyBookmarksToCollection<T>(
          data.params,
          data.id,
          data.isPublic,
          url.join("/")
        );
      },
    }),
  /**
   * useTogglePublicCollectionList - hooks for toggling many bookmarks collections_public list
   * @param url string
   * @returns `UseMutationResult<T, unknown>`
   */
  useTogglePublicCollectionList: <T>(url: string[], { key, constraints }: DocsMutationType) =>
    useMutation({
      mutationKey: [key],
      mutationFn: (id: string) => {
        return Firestore.togglePublicCollectionList<T>(url.join("/"), id, constraints);
      },
    }),
  /**
   * useGetDoc - hook for getting a document from a collection
   * @param url string
   * @param id string
   * @returns `UseQueryResult<T, unknown>`
   */
  useGetDoc: <T>(
    url: string[],
    id: string,
    { key, gcTime, placeholder, onFocus }: DocsQueryType
  ) =>
    useQuery({
      queryKey: [key, url, id],
      queryFn: () => {
        return Firestore.getOneDoc<T>(url.join("/"), id);
      },
      gcTime,
      placeholderData: placeholder,
      refetchOnWindowFocus: onFocus || false,
    }),
  /**
   * useGetManyDocs - hook for getting many documents from collections without filtering
   * @param url string[] - allows you to build very specific urls, that are then joined in one url
   * @returns `UseQueryResult<T, unknown>`
   */
  useGetManyDocs: <T>(url: string[], { key, constraints }: DocsQueryType) =>
    useQuery({
      queryKey: [key, url, constraints],
      queryFn: () => {
        return Firestore.getManyDocs<T>(url.join("/"), constraints);
      },
      refetchOnWindowFocus: false,
    }),
  /**
   * useGetManyPaginatedDocs - hook for getting many paginated documents from collections
   * @param url string[] - allows you to build very specific urls, that are then joined in one url
   * @returns `UseQueryResult<T, unknown>`
   */
  useGetManyPaginatedDocs: <T>(
    url: string[],
    { key, constraints, placeholder }: DocsQueryType,
    lastVisible?: QueryDocumentSnapshot<DocumentData> | null,
    countConstraint?: QueryConstraint[]
  ) => {
    return useQuery({
      queryKey: [key, url, constraints, lastVisible],
      queryFn: () => {
        return Firestore.getPaginatedDocs<T>(
          url.join("/"),
          constraints,
          lastVisible,
          countConstraint
        );
      },
      gcTime: 0,
      placeholderData: placeholder,
      refetchOnWindowFocus: false,
    });
  },
  /**
   * useGetSearchManyDocs - hook for getting many searhed documents from collections
   * @param url string[] - allows you to build very specific urls, that are then joined in one url
   * @returns `UseQueryResult<T, unknown>`
   */
  useGetManySearchDocs: <T>(url: string[], { key, constraints }: DocsQueryType) =>
    useMutation({
      mutationKey: [key],
      mutationFn: (ids: string[]) => {
        return Firestore.getManySearchDocs<T>(url.join("/"), ids, constraints);
      },
    }),

  /**
   * useDeleteDoc - hook for delecting a document from a collection
   * @param url string
   * @returns `UseMutationResult<T, unknown>`
   */
  useDeleteDoc: (url: string[], { key }: DocsMutationType) =>
    useMutation({
      mutationFn: (id: string) => {
        return Firestore.delDoc(url.join("/"), id);
      },
      mutationKey: [key],
    }),
  /**
   * useDeleteManyBookmarksToCollection - hooks for deleting many bookmarks from a clipmate collection
   * @param url string
   * @returns `UseMutationResult<T, unknown>`
   */
  useDeleteManyBookmarksToCollection: <T>(url: string[], { key }: DocsMutationType) =>
    useMutation({
      mutationKey: [key],
      mutationFn: (data: ToRemoveMany) => {
        return Firestore.delManyBookmarksToCollection<T>(data.params, data.id, url.join("/"));
      },
    }),
  /**
   * useTogglePublicCollectionList - hooks for toggling many bookmarks collections_public list
   * @param url string
   * @returns `UseMutationResult<T, unknown>`
   */
  useDeleteAllBookmarksFromCollection: (url: string[], { key, constraints }: DocsMutationType) =>
    useMutation({
      mutationKey: [key],
      mutationFn: (id: string) => {
        return Firestore.deleteAllBookmarksFromCollection(url.join("/"), id, constraints);
      },
    }),
  /**
   * useEditDoc - hook for editing a document in a collection
   * @param url string
   * @param id string
   * @returns `UseMutationResult<T, unknown>`
   */
  useEditDoc: <T>(url: string[], id: string, { key }: DocsMutationType) =>
    useMutation({
      mutationFn: (params: Record<string, any>) => {
        return Firestore.editDoc<T>(params, url.join("/"), id);
      },
      mutationKey: [key],
    }),
  /**
   * useUpsertDoc - hook for editing a document in a collection with {merge: true}
   * @param url string
   * @param id string
   * @returns `UseMutationResult<T, unknown>`
   */
  useUpsertDoc: <T>(url: string[], id: string, { key }: DocsMutationType) =>
    useMutation({
      mutationFn: (params: Record<string, any>) => {
        return Firestore.upsertDoc<T>(params, url.join("/"), id);
      },
      mutationKey: [key],
    }),
  /**
   * useMoveToTrash - hooks for moving many bookmarks to trash
   * @param url string
   * @returns `UseMutationResult<T, unknown>`
   */
  useMoveToTrash: <T>(url: string[], { key }: DocsMutationType) =>
    useMutation({
      mutationKey: [key],
      mutationFn: (data: MoveToTrash) => {
        return Firestore.moveToTrash<T>(data.params, url.join("/"));
      },
    }),
  /**
   * useMoveToTrash - hooks for restoring many bookmarks from trash
   * @param url string
   * @returns `UseMutationResult<T, unknown>`
   */
  useRestoreFromTrash: <T>(url: string[], { key }: DocsMutationType) =>
    useMutation({
      mutationKey: [key],
      mutationFn: (data: MoveToTrash) => {
        return Firestore.restoreFromTrash<T>(data.params, url.join("/"));
      },
    }),
  /**
   * useGetDocsCount - hook for getting many documents count from collections without filtering
   * @param url string[] - allows you to build very specific urls, that are then joined in one url
   * @returns `UseQueryResult<T, unknown>`
   */
  useGetDocsCount: <T>(url: string[], { key, constraints }: DocsQueryType) =>
    useMutation({
      mutationFn: () => {
        return Firestore.getDocsCount<T>(url.join("/"), constraints);
      },
      mutationKey: [key, url, constraints],
    }),
};

export default FirestoreHooks;
