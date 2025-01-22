import { ClipmateNextImage } from "@/components/custom/ClipmateImage";
import { DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Essential from "./clipmate-pricing-dialog/Essential";
import Professional from "./clipmate-pricing-dialog/Professional";

const ClipmatePricingDialog = () => {
  const ACTIVE =
    "data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#141414] dark:data-[state=active]:text-[#424242] rounded-lg w-full data-[state=active]:drop-shadow-md h-[28px]";
  const LIST =
    "!rounded-[12px] h-[40px] bg-[#FAFAFA] dark:bg-background border border-[#E5E5E5] dark:border-[#292929] w-full";

  return (
    <DialogContent className="max-w-[936px] h-[calc(100vh-120px)] p-0 bg-[#F5F5F5] dark:bg-[#0B0B0B] border-none flex items-start gap-0 overflow-hidden">
      <ClipmateNextImage
        className="w-[468px] h-full object-cover"
        bgClass="h-full"
        src="/pricing-side-img.png"
        alt="Pricing - Clipmate Pro"
      />

      <div className="w-[468px] h-full flex flex-col gap-3 text-sm">
        <div className="h-fit grid gap-1 p-4">
          <h1 className="text-base font-semibold">Clipmate Plans</h1>
          <p className="text-sm text-muted-foreground">
            Unlock powerful features to help you do more with the content you save.
          </p>
        </div>

        <Tabs defaultValue="essential">
          <div className="px-4">
            <TabsList className={LIST}>
              <TabsTrigger className={ACTIVE} value="essential">
                Essential
              </TabsTrigger>
              {/* <TabsTrigger className={ACTIVE} value="pro">
                Professional
              </TabsTrigger> */}
            </TabsList>
          </div>

          <Essential />
          {/* <Professional /> */}
        </Tabs>
      </div>
    </DialogContent>
  );
};

export default ClipmatePricingDialog;
