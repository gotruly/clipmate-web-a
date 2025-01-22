import { Button } from "@/components/ui/button";
import { FolderMinus } from "@untitled-ui/icons-react";
import RemoveFromCollectionWrapper from "@/providers/RemoveFromCollectionProvider";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";

type Props = {
  collectionId: string;
  disabled?: boolean;
};

const RemoveMultipleItemsToCollection = ({ collectionId, disabled }: Props) => {
  const { store } = useCollectionDetailsStore();

  return (
    <RemoveFromCollectionWrapper collection={store[collectionId]}>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 text-[13px]"
        disabled={disabled}
      >
        <FolderMinus width={16} />
        <span>Remove from collection</span>
      </Button>
    </RemoveFromCollectionWrapper>
  );
};

export default RemoveMultipleItemsToCollection;
