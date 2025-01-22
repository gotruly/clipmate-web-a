// app/(auth)/components/signWithEmailButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Lock, Mail, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { FormikProvider, useFormik } from "formik";
import { SignUpSchema, SignUpSchemaType } from "@/schema/authentication";
import { toast } from "sonner";
import ClipmateInput from "@/components/custom/ClipmateInput";
import Link from "next/link";
import { handleError } from "@/lib/utils";
import { ArrowRight } from "@untitled-ui/icons-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMemo } from "react";

const SignUpEmailForm = () => {
  const router = useRouter();
  const path = usePathname();
  const posthog = usePostHog();

  const { mutate, isPending } = FireAuthHooks.useEmailSignUp();

  const handleSubmit = async (values: SignUpSchemaType) => {
    mutate(values, {
      onSuccess: (res) => {
        posthog.identify(res.user.uid, { info: { ...res.user, ...{ initial_url: path } } });
        router.push("/");
      },
      onError: (err) => {
        const { error } = handleError(err);
        toast.error(error.message);
      },
    });
  };

  const initialValues = useMemo(
    () => ({
      name: "",
      email: "",
      password: "",
    }),
    []
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: useMemo(() => SignUpSchema, []),
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <TooltipProvider>
      <div className="grid gap-2">
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2 w-full">
            <ClipmateInput
              LeftIcon={User}
              type="text"
              placeholder="Name"
              name="name"
              autoComplete="off"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.errors.name}
              required
              disabled={isPending}
              className="h-10"
            />

            <ClipmateInput
              LeftIcon={Mail}
              type="email"
              placeholder="Email"
              name="email"
              autoComplete="off"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.errors.email}
              required
              disabled={isPending}
              className="h-10"
            />

            <ClipmateInput
              LeftIcon={Lock}
              type="password"
              placeholder="Password"
              name="password"
              autoComplete="off"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.errors.password}
              required
              disabled={isPending}
              className="h-10"
            />

            <Button type="submit" className="w-full gap-2" disabled={isPending}>
              Sign up with Email
              <ArrowRight width={16} />
            </Button>
          </form>
        </FormikProvider>

        <div className="w-full flex justify-center mt-2 text-xs text-muted-foreground">
          <span>
            Have an account?{" "}
            <Link href="/sign-in" className="text-primary">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SignUpEmailForm;
