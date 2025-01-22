import { Database } from "@/app/api/firebase";
import CollectionsContext, { CollectionsContextType } from "@/context/CollectionsContext";
import CopyPasteContext, { CopyPasteContextType } from "@/context/CopyPasteContext";
import DragNDropFromOSContext, {
  DragNDropFromOSContextType,
} from "@/context/DragNDropFromOSContext";
import { notFound } from "next/navigation";
import { RefObject, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  onSnapshot,
  collection,
  query,
  QueryConstraint,
  FirestoreError,
} from "firebase/firestore";
import { IClipmateBase } from "@/types/clipmate";
import PaginatedPageContext, { PaginatedPageContextType } from "@/context/PaginatedPageContext";
import ToggleCollectionContext, { ToggleCollectionContextType } from "@/context/ToggleCollection";
import { isEmpty } from "lodash";
import SubscriptionContext, { SubscriptionContextType } from "@/context/SubscriptionContext";
import { captureException } from "@sentry/nextjs";
import OnDropToCollectionContext, {
  OnDropToCollectionContextType,
} from "@/context/OnDropToCollectionContext";
import CommandKContext, { CommandKContextType } from "@/context/CommandKContext";
import MoveToTrashContext, { MoveToTrashContextType } from "@/context/MoveToTrashContext";
import RestoreFromTrashContext, {
  RestoreFromTrashContextType,
} from "@/context/RestoreFromTrashContext";

const useDimensions = (ref: RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      const { current } = ref;

      current.addEventListener("resize", () => {
        const boundingRect = current.getBoundingClientRect();
        const { width, height } = boundingRect;
        setDimensions({ width: Math.round(width), height: Math.round(height) });
      });
    }
  }, [ref]);

  return dimensions;
};

/*
 *
 * Utility Hooks
 *
 */
const useCMDPress = () => {
  const [cmdDown, setCmdDown] = useState<boolean>(false);
  const [shiftDown, setShiftDown] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Meta" || e.key === "Control") setCmdDown(true);
      if (e.key === "Shift") setShiftDown(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Meta" || e.key === "Control") setCmdDown(false);
      if (e.key === "Shift") setShiftDown(false);
    };

    if (typeof document !== undefined) {
      document.addEventListener("keydown", (e) => handleKeyDown(e));
      document.addEventListener("keyup", (e) => handleKeyUp(e));
    }

    // Remove Listener - Clean Up
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      }
    };
  }, []);

  return { cmdDown, setCmdDown, shiftDown, setShiftDown };
};

const useKeyPress = (key: string, callback: (e: KeyboardEvent) => void) => {
  const [down, setDown] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const element = e.target as HTMLElement;
      const isINPUT = element.tagName === "INPUT";
      const isTEXTAREA = element.tagName === "TEXTAREA";

      // Ignore if the element that is focused is an input field
      if (!isINPUT && !isTEXTAREA && !element.className.includes("tiptap")) {
        if (e.key === key) callback(e);
      }
    };

    if (typeof document !== undefined) {
      document.addEventListener("keydown", handleKeyDown);
    }

    // Remove Listener - Clean Up
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [callback, key]);

  return { down, setDown };
};

const useValidSlug = (source: string, callback?: () => void) => {
  useEffect(() => {
    const validSlugs = ["twitter", "reddit", "link", "PDF", "github", "screenshot"];

    if (!validSlugs.includes(source)) {
      callback ? callback() : notFound();
    }
  }, [callback, source]);
};

const useDBListener = (
  url: string,
  callback: (docs: IClipmateBase[]) => void,
  modified: (docs: IClipmateBase[]) => void,
  removed: (docs: IClipmateBase[]) => void,
  constraints: QueryConstraint[] = []
) => {
  const CollectionRef = collection(Database, url);
  const Query = query(CollectionRef, ...constraints);

  const handleAdded = useCallback(
    (docs: IClipmateBase[]) => {
      callback(docs);
    },
    [callback]
  );

  const handleModified = useCallback(
    (docs: IClipmateBase[]) => {
      modified(docs);
    },
    [modified]
  );

  const handleRemoved = useCallback(
    (docs: IClipmateBase[]) => {
      removed(docs);
    },
    [removed]
  );

  useEffect(() => {
    const Unsubscribe = onSnapshot(
      Query,
      (snapshot) => {
        const Added: IClipmateBase[] = [];
        const Modified: IClipmateBase[] = [];
        const Removed: IClipmateBase[] = [];

        snapshot.docChanges().forEach((change) => {
          switch (change.type) {
            case "added":
              Added.push({ ...change.doc.data(), _id: change.doc.id } as IClipmateBase);
              break;
            case "modified":
              Modified.push({ ...change.doc.data(), _id: change.doc.id } as IClipmateBase);
              break;
            case "removed":
              Removed.push({ ...change.doc.data(), _id: change.doc.id } as IClipmateBase);
              break;
          }
        });

        if (Added.length > 0) handleAdded(Added);
        if (Modified.length > 0) handleModified(Modified);
        if (Removed.length > 0) handleRemoved(Removed);
      },
      (error) => {
        captureException(error);
      }
    );

    return () => Unsubscribe();
  }, [Query, handleAdded, handleModified, handleRemoved]);
};

const useSubscriptionListener = (
  url: string,
  callback: (isPremium: boolean) => void,
  onError: (error: FirestoreError) => void,
  constraints: QueryConstraint[] = []
) => {
  const CollectionRef = collection(Database, url);
  const Query = query(CollectionRef, ...constraints);

  const handleCallback = useCallback(
    (b: boolean) => {
      callback(b);
    },
    [callback]
  );

  const handleError = useCallback(
    (error: FirestoreError) => {
      onError(error);
    },
    [onError]
  );

  useEffect(() => {
    const Unsubscribe = onSnapshot(
      Query,
      (snapshot) => {
        if (isEmpty(snapshot.docs)) handleCallback(false);
        else if (!isEmpty(snapshot.docs)) handleCallback(true);
      },
      (error) => {
        handleError(error);
      }
    );

    return () => Unsubscribe();
  }, [Query, handleCallback, handleError]);
};

/*
 *
 * Context Hooks
 *
 */
const useDragNDropContext = (): DragNDropFromOSContextType => {
  const context = useContext(DragNDropFromOSContext);
  if (!context) {
    throw new Error("DragNDrop context must be used from within the DragNDrop context provider");
  }
  return { ...context };
};

const useCopyPasteContext = (): CopyPasteContextType => {
  const context = useContext(CopyPasteContext);
  if (!context) {
    throw new Error("CopyPaste context must be used from within the CopyPaste context provider");
  }
  return { ...context };
};

const useCollectionsContext = (): CollectionsContextType => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error(
      "Collections context must be used from within the Collections context provider"
    );
  }
  return { ...context };
};

const useCommandKContext = (): CommandKContextType => {
  const context = useContext(CommandKContext);
  if (!context) {
    throw new Error("CommandK context must be used from within the CommandK context provider");
  }
  return { ...context };
};

const useMoveToTrashContext = (): MoveToTrashContextType => {
  const context = useContext(MoveToTrashContext);
  if (!context) {
    throw new Error(
      "MoveToTrash context must be used from within the MoveToTrash context provider"
    );
  }
  return { ...context };
};

const useRestoreFromTrashContext = (): RestoreFromTrashContextType => {
  const context = useContext(RestoreFromTrashContext);
  if (!context) {
    throw new Error(
      "RestoreFromTrash context must be used from within the RestoreFromTrash context provider"
    );
  }
  return { ...context };
};

const usePaginatedPageContext = (): PaginatedPageContextType => {
  const context = useContext(PaginatedPageContext);
  if (!context) {
    throw new Error(
      "PaginatedPage context must be used from within the PaginatedPage context provider"
    );
  }
  return useMemo(() => ({ ...context }), [context]);
};

const useToggleCollectionContext = (): ToggleCollectionContextType => {
  const context = useContext(ToggleCollectionContext);
  if (!context) {
    throw new Error(
      "ToggleCollection context must be used from within the ToggleCollection context provider"
    );
  }
  return { ...context };
};

const useOnDropToCollectionContext = (): OnDropToCollectionContextType => {
  const context = useContext(OnDropToCollectionContext);
  if (!context) {
    throw new Error(
      "OnDropToCollection context must be used from within the OnDropToCollection context provider"
    );
  }
  return { ...context };
};

const useSubscriptionContext = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "SubscriptionContext must be used from within the SubscriptionContext provider"
    );
  }
  return { ...context };
};

export {
  /* Utilities Hook Export */
  useDimensions,
  useCMDPress,
  useKeyPress,
  useValidSlug,
  useDBListener,
  useSubscriptionListener,
  /* Context Hook Exports */
  useDragNDropContext,
  useCopyPasteContext,
  useCollectionsContext,
  useCommandKContext,
  usePaginatedPageContext,
  useToggleCollectionContext,
  useOnDropToCollectionContext,
  useSubscriptionContext,
  useMoveToTrashContext,
  useRestoreFromTrashContext,
};
