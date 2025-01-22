// app/(auth)/components/signWithEmailButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { FormikProvider, useFormik } from "formik";
import { ResetPasswordSchema, ResetPasswordSchemaType } from "@/schema/authentication";
import { toast } from "sonner";
import ClipmateInput from "@/components/custom/ClipmateInput";
import { handleError } from "@/lib/utils";
import { ArrowRight } from "@untitled-ui/icons-react";
import { useMemo } from "react";

type Props = {
  oobCode: string | null;
};

const ResetPasswordForm = ({ oobCode }: Props) => {
  const router = useRouter();
  const { mutate, isPending } = FireAuthHooks.useResetPassword();

  const handleSubmit = async (values: ResetPasswordSchemaType, resetForm: () => void) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Reset successful");
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
      password: "",
      oobCode: oobCode || "",
    }),
    [oobCode]
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: useMemo(() => ResetPasswordSchema, []),
    onSubmit: (values, { resetForm }) => handleSubmit(values, resetForm),
  });

  if (!oobCode) {
    router.push("/sign-in");
    toast.error("Invalid reset link");
    return null;
  }

  return (
    <div className="grid gap-2">
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2 w-full">
          <ClipmateInput
            LeftIcon={Lock}
            type="password"
            placeholder="New Password"
            name="password"
            autoComplete="off"
            value={formik.values.password}
            onChange={formik.handleChange}
            required
            disabled={isPending}
            className="h-10"
          />

          <Button type="submit" className="w-full gap-2" disabled={isPending}>
            Reset Password
            <ArrowRight width={16} />
          </Button>
        </form>
      </FormikProvider>
    </div>
  );
};

export default ResetPasswordForm;
