import { InferType, object, string } from "yup";

const SearchSchema = object().shape({
  search: string().required("Please provide a search value"),
});

type SearchSchemaType = InferType<typeof SearchSchema>;

export { SearchSchema };
export type { SearchSchemaType };
