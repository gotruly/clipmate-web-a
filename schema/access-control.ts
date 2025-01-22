import { InferType, object, string } from "yup";

const AccessControlSchema = object().shape({
  code: string().required("Please enter your code"),
});

type AccessControlSchemaType = InferType<typeof AccessControlSchema>;

export { AccessControlSchema };
export type { AccessControlSchemaType };
