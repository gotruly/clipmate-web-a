import { IClipmateCollections, IClipmateResponse } from "@/types/clipmate";
import ClipmatePublicGrid from "./ClipmatePublicGrid";
import { Lock04 } from "@untitled-ui/icons-react";

type Props = {
  bookmarks: IClipmateResponse[];
  info: IClipmateCollections;
};

const Grid = ({ info, bookmarks }: Props) => {
  return (
    <div className="container mx-auto mt-5 px-3">
      {info.public && <ClipmatePublicGrid data={bookmarks} />}

      {!info.public && (
        <div className="h-[calc(100vh-390px)] grid gap-2 items-center border border-border rounded-md px-6">
          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center justify-center h-12 w-12 bg-accent/90 border border-border rounded-md">
              <Lock04 width={24} />
            </div>
            <h1 className="text-2xl font-semibold text-center">This collection is private</h1>
            <p className="text-sm text-center text-wrap font-normal max-w-[55ch] text-muted-foreground">
              This collection is private and can only be viewed by the owner
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grid;
