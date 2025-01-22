import UploadIcon from "@/components/icons/upload";

const PDFEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-sm gap-3">
      <div>
        <UploadIcon width={150} height={150} />
      </div>

      <div className="text-center">
        <p>Upload PDFs to see them here</p>
        <p className="text-muted-foreground text-xs">Drag and drop a PDF to upload</p>
      </div>
    </div>
  );
};

export default PDFEmptyState;
