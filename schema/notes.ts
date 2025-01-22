import { Timestamp } from "firebase/firestore";
import { date, object, string } from "yup";

const NoteCreationSchema = object().shape({
  text: string().required("Provide some content for the note"),
  item_id: string(),
  date_added: date(),
  date_modified: date(),
});

type NoteCreationType = {
  _id: string;
  text: string;
  item_id: string;
  date_added: Timestamp;
  date_modified: Timestamp;
};

export { NoteCreationSchema };
export type { NoteCreationType };
