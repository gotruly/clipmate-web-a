import { InferType, object, string } from "yup";

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const SignInSchema = object().shape({
  email: string()
    .matches(EMAIL_REGEX, "Invalid email Address")
    .required("Please enter your email"),
  password: string().required("Please enter your password"),
});

const SignUpSchema = object().shape({
  name: string().required("Please enter your name").min(2),
  email: string()
    .matches(EMAIL_REGEX, "Invalid email Address")
    .required("Please enter your email"),
  password: string().required("Please enter your password"),
});

const ForgotPasswordSchema = object().shape({
  email: string().email("Invalid email address").required("Please enter your email"),
});

const ResetPasswordSchema = object().shape({
  password: string().required("Please enter your password"),
  oobCode: string().required(),
});

type SignInSchemaType = InferType<typeof SignInSchema>;
type SignUpSchemaType = InferType<typeof SignUpSchema>;
type ForgotPasswordSchemaType = InferType<typeof ForgotPasswordSchema>;
type ResetPasswordSchemaType = InferType<typeof ResetPasswordSchema>;

export { SignInSchema, SignUpSchema, ForgotPasswordSchema, ResetPasswordSchema };
export type {
  SignInSchemaType,
  SignUpSchemaType,
  ForgotPasswordSchemaType,
  ResetPasswordSchemaType,
};
