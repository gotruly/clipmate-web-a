// app/(auth)/components/signWithEmailButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { FormikProvider, useFormik } from "formik";
import { SignInSchema, SignInSchemaType } from "@/schema/authentication";
import { toast } from "sonner";
import ClipmateInput from "@/components/custom/ClipmateInput";
import Link from "next/link";
import { handleError } from "@/lib/utils";
import { ArrowRight } from "@untitled-ui/icons-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMemo } from "react";

const SignInEmailForm = () => {
  const router = useRouter();
  const path = usePathname();
  const posthog = usePostHog();

  const { mutate, isPending } = FireAuthHooks.useEmailSignIn();

  const handleSubmit = async (values: SignInSchemaType) => {
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
      email: "",
      password: "",
    }),
    []
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: useMemo(() => SignInSchema, []),
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <TooltipProvider>
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
              error={formik.errors.email}
              required
              disabled={isPending}
              className="h-10"
            />
            <div className="flex flex-col items-end gap-1.5">
              <ClipmateInput
                LeftIcon={Lock}
                type="password"
                placeholder="Password"
                name="password"
                autoComplete="off"
                value={formik.values.password}
                error={formik.errors.password}
                onChange={formik.handleChange}
                required
                disabled={isPending}
                className="h-10"
              />
              <Link href="/forgot-password" className="text-xs text-primary">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isPending}>
              Sign in with Email
              <ArrowRight width={16} />
            </Button>
          </form>
        </FormikProvider>

        <div className="w-full flex justify-center mt-2 text-xs text-zinc-600 dark:text-zinc-400">
          <span>
            No account?{" "}
            <Link href="/sign-up" className="text-primary">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SignInEmailForm;
