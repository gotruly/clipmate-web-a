"use client";

import { FirebaseError } from "firebase/app";
import {
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  QueryConstraint,
  where,
  QueryDocumentSnapshot,
  DocumentData,
  startAfter,
  writeBatch,
  Timestamp,
  addDoc,
  getCountFromServer,
  getDocsFromCache,
  getDocsFromServer,
  arrayRemove,
} from "firebase/firestore";
import { Database } from "../firebase";
import { IClipmateBase } from "@/types/clipmate";
import { isEmpty } from "lodash";

export interface PaginatedResult<T> {
  data: T[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  count: number;
}

const Firestore = {
  /**
   * Extensible function for creating document in a collection defined by
   * `url` and creates `data` in said collection
   * @param data T
   * @param url string
   * @returns `Promise<T>`
   */
  async createDocs<T>(data: Record<string, any>, url: string): Promise<T> {
    const docRef = collection(Database, url);
    return await addDoc(docRef, { ...data })
      .then(() => {
        return data as T;
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message, error);
      });
  },
  /**
   * Extensible function for adding document to a collection defined by
   * `url` and adds `data` to said collection
   * @param data T
   * @param url string
   * @returns `Promise<T>`
   */
  async addDocs<T>(data: Record<string, any>, url: string): Promise<T> {
    const docRef = doc(Database, url);
    return await setDoc(docRef, { ...data })
      .then(() => {
        return data as T;
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message, error);
      });
  },
  /**
   * Specific (somewhat extensible) function for adding multiple document to a collection defined by
   * `url` and adds `data` to said collection
   * @param data string[]
   * @param url string
   * @returns `Promise<T>`
   */
  async addManyBookmarksToCollection<T>(
    data: IClipmateBase[],
    id: string,
    isPublic: boolean,
    url: string
  ): Promise<void> {
    const batch = writeBatch(Database);

    data.forEach((item) => {
      const { _id, ...rest } = item;
      const collections_public = item.collections_public || [];

      return batch.set(doc(Database, url, _id), {
        ...rest,
        ...{
          collections: Object.keys(rest.collections).some((c) => c === id)
            ? rest.collections
            : {
                ...rest.collections,
                ...{ [id]: { date_added: Timestamp.fromDate(new Date()) } },
              },
          collections_public:
            isPublic && isEmpty(collections_public.filter((c) => c === id))
              ? [...collections_public, id]
              : collections_public,
        },
      });
    });

    return await batch
      .commit()
      .then(() => {
        return;
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message);
      });
  },
  /**
   * Specific (somewhat extensible) function for toggling multiple document to public
   * @param id string
   * @param url string
   * @returns `Promise<T>`
   */
  async togglePublicCollectionList<T>(
    url: string,
    id: string,
    queryConstraints: QueryConstraint[] = []
  ): Promise<void> {
    const batch = writeBatch(Database);
    const collectionRef = collection(Database, url);
    const request = query(collectionRef, ...queryConstraints);

    const docs = await getDocs(request)
      .then((res) => {
        return res.docs.map((doc) => {
          return doc;
        });
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message);
      });

    docs.forEach((doc) => {
      const collections_public = doc.data().collections_public || [];

      batch.update(doc.ref, {
        collections_public: collections_public.some((c: string) => c === id)
          ? collections_public.filter((c: string) => c !== id)
          : [...collections_public, id],
      });
    });

    return await batch
      .commit()
      .then(() => {
        return;
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message);
      });
  },
  /**
   * Extensible function for getting many documents from a collection with filtering
   * `url`
   * @param url string
   * @returns `Promise<T[]>`
   */
  async getManyDocs<T>(url: string, queryConstraints: QueryConstraint[] = []): Promise<T[]> {
    const data: T[] = [];

    const docRef = collection(Database, url);
    const request = query(docRef, ...queryConstraints);

    await getDocs(request)
      .then((res) => {
        res.forEach((doc) => {
          data.push({ ...doc.data(), _id: doc.id } as unknown as T);
        });
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message, error);
      });

    return data;
  },

  /**
   * Extensible function for getting many paginated documents from a collection
   * `url`
   * @param url string
   * @returns `Promise<T[]>`
   */
  async getPaginatedDocs<T>(
    url: string,
    queryConstraints: QueryConstraint[] = [],
    lastVisible: QueryDocumentSnapshot<DocumentData> | null = null,
    countConstraint: QueryConstraint[] = []
  ): Promise<PaginatedResult<T>> {
    const data: T[] = [];
    const docRef = collection(Database, url);
    const count = await getCountFromServer(
      countConstraint ? query(docRef, ...countConstraint) : docRef
    );

    let lastDoc = null;

    // Add pagination constraint if lastVisible is provided
    const paginatedConstraints = lastVisible
      ? [...queryConstraints, startAfter(lastVisible)]
      : queryConstraints;

    const request = query(docRef, ...paginatedConstraints);

    return await getDocsFromCache(request)
      .then(async (res) => {
        lastDoc = res.docs.length > 0 ? res.docs[res.docs.length - 1] : null;

        res.forEach((doc) => {
          data.push({ ...doc.data(), _id: doc.id } as unknown as T);
        });

        if (isEmpty(data)) {
          return await getDocsFromServer(request)
            .then((res) => {
              lastDoc = res.docs.length > 0 ? res.docs[res.docs.length - 1] : null;

              res.forEach((doc) => {
                data.push({ ...doc.data(), _id: doc.id } as unknown as T);
              });

              return {
                data,
                lastVisible: lastDoc,
                count: count.data().count,
              };
            })
            .catch((error: FirebaseError) => {
              throw new Error(error.message);
            });
        }

        return {
          data,
          lastVisible: lastDoc,
          count: count.data().count,
        };
      })
      .catch(async (error: FirebaseError) => {
        throw new Error(error.message);
      });
  },

  /**
   * Extensible function for getting many documents from a collection without filtering
   * `url`
   * @param url string
   * @returns `Promise<T[]>`
   */
  async getManySearchDocs<T>(
    url: string,
    ids: string[],
    queryConstraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const dataMap = new Map<string, T>();
    const CHUNK_SIZE = 30;

    // Create chunks of IDs
    const CHUNKS: string[][] = [];
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      CHUNKS.push(ids.slice(i, i + CHUNK_SIZE));
    }

    // Create queries for each chunk
    const queries = CHUNKS.map((chunk) => {
      const docRef = collection(Database, url);
      return query(docRef, where("__name__", "in", chunk), ...queryConstraints);
    });

    // Fetch documents for each query
    const promises = queries.map((query) => getDocs(query));

    // Process the results
    await Promise.all(promises)
      .then((querySnapshots) => {
        querySnapshots.forEach((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            dataMap.set(doc.id, { ...doc.data(), _id: doc.id } as unknown as T);
          });
        });
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message);
      });

    // Sort the data in the order of the provided IDs
    const sortedData: T[] = ids
      .map((id) => dataMap.get(id))
      .filter((doc) => doc !== undefined) as T[];

    return sortedData;
  },

  /**
   * Extensible function for getting a document from a collection defined by
   * `url`
   * @param url string
   * @param id string
   * @returns `Promise<T>`
   */
  async getOneDoc<T>(url: string, id: string): Promise<T> {
    const docRef = doc(Database, url, id);
    return await getDoc(docRef)
      .then((res) => {
        return { ...res.data(), _id: res.id } as unknown as T;
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message, error);
      });
  },

  /**
   * Extensible function for editing a document from a collection defined by
   * `url` & document `id` with `data`
   * @param data T
   * @param url string
   * @param id string
   * @returns `Promise<unknown>`
   */
  async editDoc<T>(data: Record<string, any>, url: string, id: string): Promise<unknown> {
    return await setDoc(doc(Database, url, id), data)
      .then((res: T | unknown) => {
        if (res) return res;
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message, error);
      });
  },

  /**
   * Extensible function for editing a document from a collection defined by
   * `url` & document `id` with `data`
   * @param data T
   * @param url string
   * @param id string
   * @returns `Promise<unknown>`
   */
  async upsertDoc<T>(data: Record<string, any>, url: string, id: string): Promise<unknown> {
    return await setDoc(doc(Database, url, id), data, { merge: true })
      .then((res: T | unknown) => {
        if (res) return res;
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message, error);
      });
  },

  /**
   * Extensible function for deleting a document from a collection defined by
   * `url` and document `id`
   * @param url string
   * @param id string
   * @returns `Promise<unknown>`
   */
  async delDoc(url: string, id: string): Promise<unknown> {
    return await deleteDoc(doc(Database, url, id))
      .then((res: unknown) => {
        if (res) return res;
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message, error);
      });
  },
  /**
   * Specific (somewhat extensible) function for deleting multiple document to a collection defined by
   * `url` and adds `data` to said collection
   * @param data string[]
   * @param url string
   * @returns `Promise<unknown>`
   */
  async delManyBookmarksToCollection<T>(
    data: IClipmateBase[],
    id: string,
    url: string
  ): Promise<void> {
    const batch = writeBatch(Database);

    data.forEach((item) =>
      batch.set(doc(Database, url, item._id), {
        ...item,
        ...{
          collections: Object.keys(item.collections)
            .filter((key) => key !== id)
            .reduce((acc, key) => {
              acc[key] = item.collections[key];
              return acc;
            }, {} as Record<string, { date_added: Timestamp }>),
          collections_public: arrayRemove(id),
        },
      })
    );

    return await batch
      .commit()
      .then(() => {
        return;
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message);
      });
  },
  /**
   * Specific (somewhat extensible) function for toggling multiple document to public
   * @param id string
   * @param url string
   * @returns `Promise<T>`
   */
  async deleteAllBookmarksFromCollection(
    url: string,
    id: string,
    queryConstraints: QueryConstraint[] = []
  ): Promise<void> {
    const batch = writeBatch(Database);
    const collectionRef = collection(Database, url);
    const request = query(collectionRef, ...queryConstraints);

    const docs = await getDocs(request)
      .then((res) => {
        return res.docs.map((doc) => {
          return doc;
        });
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message);
      });

    docs.forEach((doc) => {
      batch.update(doc.ref, {
        collections: Object.keys(doc.data().collections)
          .filter((key) => key !== id)
          .reduce((acc, key) => {
            acc[key] = doc.data().collections[key];
            return acc;
          }, {} as Record<string, { date_added: Timestamp }>),
        collections_public: arrayRemove(id),
      });
    });

    return await batch
      .commit()
      .then(() => {
        return;
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message);
      });
  },
  /**
   * Specific function for moving multiple document to a trash defined by
   * `url` and adds `data` to trash
   * @param data string[]
   * @param url string
   * @returns `Promise<unknown>`
   */
  async moveToTrash<T>(data: IClipmateBase[], url: string): Promise<void> {
    const batch = writeBatch(Database);

    data.forEach((item) =>
      batch.set(doc(Database, url, item._id), {
        ...item,
        ...{ inbox: "trash", inbox_changed: false },
      })
    );

    return await batch
      .commit()
      .then(() => {
        return;
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message);
      });
  },
  /**
   * Specific function for moving multiple document to a trash defined by
   * `url` and adds `data` to trash
   * @param data string[]
   * @param url string
   * @returns `Promise<unknown>`
   */
  async restoreFromTrash<T>(data: IClipmateBase[], url: string): Promise<void> {
    const batch = writeBatch(Database);

    data.forEach((item) =>
      batch.set(doc(Database, url, item._id), {
        ...item,
        ...{ inbox: "default", inbox_changed: false },
      })
    );

    return await batch
      .commit()
      .then(() => {
        return;
      })
      .catch((error: FirebaseError) => {
        throw new Error(error.message);
      });
  },
  /**
   * Extensible function for getting many documents count from a collection with filtering
   * `url`
   * @param url string
   * @param queryConstraints QueryConstraint[]
   * @returns `Promise<number>`
   */
  async getDocsCount<T>(url: string, queryConstraints: QueryConstraint[] = []): Promise<number> {
    const docRef = collection(Database, url);
    const request = query(docRef, ...queryConstraints);
    const count = await getCountFromServer(request);

    return count.data().count;
  },
};

export default Firestore;
