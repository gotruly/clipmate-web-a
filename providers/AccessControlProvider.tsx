import FireAuthHooks from "@/app/api/hooks/fireauth";
import FireFunctionHooks from "@/app/api/hooks/firefunction";
import FirestoreHooks from "@/app/api/hooks/firestore";
import ClipmateInput from "@/components/custom/ClipmateInput";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import queryClient from "@/lib/queryClient";
import { AccessControlSchema, AccessControlSchemaType } from "@/schema/access-control";
import { IClipmateConnection } from "@/types/clipmate";
import { FormikProvider, useFormik } from "formik";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { LogOut04 } from "@untitled-ui/icons-react";
import { TooltipProvider } from "@/components/ui/tooltip";

const AccessControlProvider = ({ children }: { children: React.ReactNode }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { user } = FireAuthHooks.useGetUser();
  const Logout = FireAuthHooks.useLogOut();
  const { data } = FirestoreHooks.useGetDoc<IClipmateConnection>(["users"], user.uid, {
    key: "getUserInfoForAccessControl",
  });
  const { mutate, isPending } = FireFunctionHooks.useActivateAccount();

  useEffect(() => {
    if (data && !data.is_activated) {
      setOpenDialog(true);
    }
  }, [data]);

  const handleSubmit = (v: AccessControlSchemaType) => {
    mutate(v, {
      onSuccess: (res) => {
        if (res.status === "error") {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          setOpenDialog(false);
          queryClient.refetchQueries({ queryKey: ["getUserInfoForAccessControl"] });
        }
      },
    });
  };

  const formik = useFormik({
    initialValues: { code: "" },
    onSubmit: (v) => handleSubmit(v),
    validationSchema: useMemo(() => AccessControlSchema, []),
  });

  return (
    <div>
      <AlertDialog open={openDialog}>
        <AlertDialogContent
          className="gap-2"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Your account is not activated</AlertDialogTitle>
          </AlertDialogHeader>

          <TooltipProvider>
            <FormikProvider value={formik}>
              <form className="w-full flex flex-col gap-2" onSubmit={formik.handleSubmit}>
                <ClipmateInput
                  autoComplete="off"
                  name="code"
                  onChange={formik.handleChange}
                  placeholder="Activation code"
                  error={formik.errors.code}
                  LeftIcon={Lock}
                  className="h-9"
                />
                <Button
                  disabled={isPending}
                  className="w-fit flex items-center gap-2"
                  size="sm"
                  type="submit"
                >
                  {isPending && <Loader2 size={16} className="animate-spin" />} Activate
                </Button>
              </form>
            </FormikProvider>
          </TooltipProvider>

          <div className="flex items-center justify-between w-full">
            <p className="text-sm">
              <Link href="mailto:hello@clipmate.ai" className="text-primary">
                Email
              </Link>{" "}
              to request a code.
            </p>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 gap-2 !text-destructive"
              onClick={() => Logout.mutate()}
            >
              <LogOut04 width={16} /> Logout
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </div>
  );
};

export default AccessControlProvider;
