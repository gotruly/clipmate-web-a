import { sendTokenToChromeExtension } from "@/lib/utils";
import { Functions } from "../firebase";
import { HttpsCallableResult, httpsCallable } from "firebase/functions";

export interface FnResult<T> extends HttpsCallableResult<T> {}
export interface SyncSourceParams {
  type: string;
  access_token?: string;
  refresh_token?: string;
}

export interface FnParams {
  type: string;
  access_token: string;
  refresh_token: string;
}

export interface LinkFnParams {
  url: string;
}

export interface ActivateFnParams {
  code: string;
}

export interface SearchFnParams {
  query: string;
  type_filter: string[];
}

export interface FnReturn {
  message: string;
  status: "success" | "error";
}

export interface LinkFnReturn {
  doc_data: {
    description: string;
    image: string;
    title: string;
    url: string;
  };
  doc_id: string;
  message: string;
  status: string;
}

export interface ProcessFile {
  storage_path: string;
  file_name: string;
  local_path: string;
}

export interface ProcessFileFnParams {
  data: { files: ProcessFile[] };
}

export interface SearchResult {
  bookmark_count: number;
  bookmarks: { id: string; index: number }[];
}

export interface DeleteCollection {
  id: string;
}

export interface DeleteSource {
  type: string;
}

export interface DeleteItem {
  items: string[];
}

export interface TokenGen {
  token: string;
}

interface TokenRes {
  firebaseToken: string;
}

const generateCustomTokenFn = httpsCallable(Functions, "get_firebase_token");
const syncSourceFn = httpsCallable(Functions, "sync");
const syncURLFn = httpsCallable(Functions, "add_link");
const processFileFn = httpsCallable(Functions, "process_files");
const searchFn = httpsCallable(Functions, "search");
const activateAccountFn = httpsCallable(Functions, "activate_account");
const deleteCollectionFn = httpsCallable(Functions, "delete_collection");
const deleteSourceFn = httpsCallable(Functions, "delete_source");
const deleteItemFn = httpsCallable(Functions, "delete_items");
const deleteAccountFn = httpsCallable(Functions, "delete_account");

const generateAndSendCustomToken = async ({ token }: TokenGen) => {
  return generateCustomTokenFn({ token }).then((result) => {
    const res = result as FnResult<TokenRes>;

    if (res.data && res.data.firebaseToken) {
      sendTokenToChromeExtension(res.data.firebaseToken);
    }
  });
};

const syncSource = async ({ type, access_token, refresh_token }: SyncSourceParams) => {
  const data: any = { type };

  if (access_token) {
    data.access_token = access_token;
  }

  if (refresh_token) {
    data.refresh_token = refresh_token;
  }

  return syncSourceFn(data).then((result) => {
    return result.data as FnReturn;
  });
};

const syncLink = async ({ url }: LinkFnParams) => {
  return syncURLFn({ url }).then((result) => {
    return result.data as LinkFnReturn;
  });
};

const processFiles = async ({ data }: ProcessFileFnParams) => {
  return processFileFn({ data }).then((result) => {
    return result.data;
  });
};

const search = async ({ query, type_filter }: SearchFnParams) => {
  return searchFn({ query, type_filter }).then((result) => {
    return result.data as SearchResult;
  });
};

const activateAccount = async ({ code }: ActivateFnParams) => {
  return activateAccountFn({ code }).then((result) => {
    return result.data as FnReturn;
  });
};

const deleteCollection = async ({ id }: DeleteCollection) => {
  return deleteCollectionFn({ id }).then((result) => {
    return result.data as FnReturn;
  });
};

const deleteSource = async ({ type }: DeleteSource) => {
  return deleteSourceFn({ type }).then((result) => {
    return result.data as FnReturn;
  });
};

const deleteItem = async ({ items }: DeleteItem) => {
  return deleteItemFn({ items }).then((result) => {
    return result.data as FnReturn;
  });
};

const deleteAccount = async () => {
  return deleteAccountFn().then((result) => {
    return result.data as FnReturn;
  });
};

const FireFunction = {
  generateAndSendCustomToken,
  syncSource,
  syncLink,
  processFiles,
  search,
  activateAccount,
  deleteCollection,
  deleteSource,
  deleteItem,
  deleteAccount,
};

export default FireFunction;
