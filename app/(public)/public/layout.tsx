import ClipmateToaster from "@/components/ClipmateToaster";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full w-full box-border public">
      {children}
      <ClipmateToaster />
    </main>
  );
};

export default PublicLayout;
