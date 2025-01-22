// app/(auth)/components/signWithEmailButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { FormikProvider, useFormik } from "formik";
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from "@/schema/authentication";
import { toast } from "sonner";
import ClipmateInput from "@/components/custom/ClipmateInput";
import Link from "next/link";
import { handleError } from "@/lib/utils";
import { ArrowRight } from "@untitled-ui/icons-react";
import { useMemo } from "react";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const { mutate, isPending } = FireAuthHooks.useSendPasswordResetEmail();

  const handleSubmit = async (values: ForgotPasswordSchemaType, resetForm: () => void) => {
    mutate(values.email, {
      onSuccess: () => {
        toast.success("Reset link sent");
        resetForm();
        router.push("/sign-in");
      },
      onError: (err) => {
        const { error } = handleError(err);
        toast.error(error.message);
      },
    });
  };

  const initialValues = useMemo(
    () => ({
      email: "",
    }),
    []
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: useMemo(() => ForgotPasswordSchema, []),
    onSubmit: (values, { resetForm }) => handleSubmit(values, resetForm),
  });

  return (
    <div className="grid gap-2">
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2 w-full">
          <ClipmateInput
            LeftIcon={Mail}
            type="email"
            placeholder="Email"
            name="email"
            autoComplete="off"
            value={formik.values.email}
            onChange={formik.handleChange}
            required
            disabled={isPending}
            className="h-10"
          />

          <Button type="submit" className="w-full gap-2" disabled={isPending}>
            Send Reset Link
            <ArrowRight width={16} />
          </Button>
        </form>
      </FormikProvider>

      <div className="w-full flex justify-center mt-2 text-xs text-zinc-600 dark:text-zinc-400">
        <span>
          Go back?{" "}
          <Link href="/sign-in" className="text-primary">
            Sign in
          </Link>
        </span>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
