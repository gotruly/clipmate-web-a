import dynamic from "next/dynamic";

const AllItemsSegment = dynamic(() => import("./segment"), { ssr: false });

const AllItemsPage = () => {
  return <AllItemsSegment />;
};

export default AllItemsPage;
