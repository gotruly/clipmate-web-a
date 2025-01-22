import { InferType, object, string } from "yup";

const LinkSchema = object().shape({
  url: string().required("Please enter a valid URL"),
});

type LinkSchemaType = InferType<typeof LinkSchema>;

export { LinkSchema };
export type { LinkSchemaType };
