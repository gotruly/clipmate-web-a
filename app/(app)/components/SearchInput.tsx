import ClipmateInput from "@/components/custom/ClipmateInput";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SearchSchemaType } from "@/schema/search";
import { FormikProvider, useFormik } from "formik";
import { Search, X } from "lucide-react";
import { useCallback, useMemo } from "react";

type Props = {
  disabled?: boolean;
  isLoading?: boolean;
  inSearchMode: boolean;
  onInputSubmit: (value: SearchSchemaType) => void;
  onInputReset: () => void;
};

const SearchInput = ({
  disabled,
  inSearchMode,
  isLoading,
  onInputSubmit,
  onInputReset,
}: Props) => {
  const initialValue: SearchSchemaType = useMemo(
    () => ({
      search: "",
    }),
    []
  );

  const handleInputSubmit = useCallback(
    (values: SearchSchemaType) => {
      onInputSubmit(values);
    },
    [onInputSubmit]
  );

  const handleFormReset = useCallback(() => {
    onInputReset();
  }, [onInputReset]);

  const formik = useFormik({
    initialValues: initialValue,
    onSubmit: (values) => handleInputSubmit(values),
  });

  const resetForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    handleFormReset();
    formik.resetForm();
  };

  return (
    <TooltipProvider>
      <FormikProvider value={formik}>
        <form className="w-full" onSubmit={formik.handleSubmit}>
          <ClipmateInput
            className="w-full h-[27px] placeholder:text-[#737373] text-[13px]"
            autoComplete="off"
            name="search"
            disabled={disabled}
            isLoading={isLoading}
            value={formik.values.search}
            onChange={formik.handleChange}
            error={
              formik.errors.search || formik.touched.search ? formik.errors.search : undefined
            }
            placeholder="Search"
            LeftIcon={Search}
            Component={
              <>
                {inSearchMode && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-full w-7"
                    onClick={(e) => resetForm(e)}
                  >
                    <X size={13} />
                  </Button>
                )}
              </>
            }
          />
        </form>
      </FormikProvider>
    </TooltipProvider>
  );
};

export default SearchInput;
