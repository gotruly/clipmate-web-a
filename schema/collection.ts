import { Timestamp } from "firebase/firestore";
import { InferType, object, string } from "yup";

const CollectionCreationSchema = object().shape({
  name: string()
    .required("Please provide a collection name")
    .min(3, "Collection name must be at least 3 characters long")
    .max(35, "Collection name must be at most 35 characters long"),
  description: string().max(180, "Collection description must be at most 180 characters long"),
});

type CollectionCreationType = InferType<typeof CollectionCreationSchema>;
type AddItemToCollectionType = { item_id: string; date_added: Timestamp };

export { CollectionCreationSchema };
export type { CollectionCreationType, AddItemToCollectionType };
