import { IClipmateCollections, IClipmateResponse } from "@/types/clipmate";
import { Timestamp } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

type HandleMultipleParams = {
  collection: IClipmateCollections;
  selectedItems: IClipmateResponse[];
  setSelectedItems: Dispatch<SetStateAction<IClipmateResponse[]>>;
  handleAdd: (identifier: string, collection: string, ids: IClipmateResponse[]) => void;
  handleRemove: (identifier: string, collection: string, ids: string[]) => void;
};

type HandleSingleParams = {
  collection: IClipmateCollections;
  item: IClipmateResponse | null;
  value: IClipmateResponse;
  setItem: Dispatch<SetStateAction<IClipmateResponse | null>>;
  handleAdd: (identifier: string, collection: string, ids: IClipmateResponse[]) => void;
  handleRemove: (identifier: string, collection: string, ids: string[]) => void;
};

/**
 * Sets the collection to multiple items in the local data after request to the database
 * is successfully completed
 * @param {string} identifier
 * @param {HandleMultipleParams} data
 */
const handleSetToMultipleItems = (identifier: string, data: HandleMultipleParams) => {
  data.handleAdd(identifier, data.collection._id, data.selectedItems);

  data.setSelectedItems((prev) =>
    prev.map((i) => ({
      ...i,
      collections: {
        ...i.collections,
        ...{ [data.collection._id]: { date_added: Timestamp.fromDate(new Date()) } },
      },
    }))
  );
};

/**
 * Set the collection to an item in the local data after request to the database
 * is successfully completed
 * @param {string} identifier
 * @param {HandleSingleParams} data
 */
const handleSetToAnItem = (identifier: string, data: HandleSingleParams) => {
  data.handleAdd(identifier, data.collection._id, [data.value]);

  if (data.item) {
    // If the item is in the sidebar
    data.setItem({
      ...data.item,
      collections: {
        ...data.item.collections,
        ...{ [data.collection._id]: { date_added: Timestamp.fromDate(new Date()) } },
      },
    });
  }
};

/**
 * Removes the collection from multiple items in the local data after request to the database
 * is successfully completed
 * @param {string} identifier
 * @param {HandleMultipleParams} data
 */
const handleRemoveFromMultipleItems = (identifier: string, data: HandleMultipleParams) => {
  data.handleRemove(
    identifier,
    data.collection._id,
    data.selectedItems.map((i) => i._id)
  );

  data.setSelectedItems((prev) =>
    // Also remove the collection from the selected items
    prev.map((i) => ({
      ...i,
      collections: Object.keys(i.collections)
        .filter((key) => key !== data.collection._id)
        .reduce((acc, key) => {
          acc[key] = i.collections[key];
          return acc;
        }, {} as Record<string, { date_added: Timestamp }>),
    }))
  );
};

/**
 * Remove the collection from the local data after request to the database
 * is successfully completed
 * @param {string} identifier
 * @param {HandleSingleParams} data
 */
const handleRemoveFromAnItem = (identifier: string, data: HandleSingleParams) => {
  data.handleRemove(identifier, data.collection._id, [data.value._id]);

  if (data.item) {
    // If the item is in the sidebar
    data.setItem({
      ...data.item,
      collections: Object.keys(data.item.collections)
        .filter((key) => key !== data.collection._id)
        .reduce((acc, key) => {
          if (data.item) {
            acc[key] = data.item.collections[key];
          }
          return acc;
        }, {} as Record<string, { date_added: Timestamp }>),
    });
  }
};

export {
  handleSetToMultipleItems,
  handleSetToAnItem,
  handleRemoveFromMultipleItems,
  handleRemoveFromAnItem,
};
