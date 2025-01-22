import { Database } from "@/app/api/firebase";
import { IClipmateCollections, IClipmateResponse } from "@/types/clipmate";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import type { Metadata } from "next";
import Main from "@/app/(public)/components/Main";
import GenerateOGImage from "@/app/(public)/utils/og-image";
import { notFound } from "next/navigation";

// Get Collection Info - Name, Description, Visibility
const GetCollectionInfo = async (id: string) => {
  const DocRef = doc(Database, "collections", id);

  const snapshot = await getDoc(DocRef);
  const response = snapshot.data();

  if (!response) notFound();

  return response as IClipmateCollections;
};

// Get Public Collection - Bookmarks
const GetPublicCollection = async (uid: string, id: string) => {
  const DocRef = collection(Database, "users", uid, "bookmarks");
  const Query = query(DocRef, orderBy(`collections.${id}.date_added`, "desc"));

  const snapshot = await getDocs(Query);
  const response = snapshot.docs.map((doc) => doc.data());

  return response as IClipmateResponse[];
};

// Revalidate every 5 minutes (300 seconds) - This is used to make sure the page is up-to-date
export const revalidate = 300;

const PublicPage = async ({ params }: { params: { uid: string; id: string } }) => {
  const items = await GetPublicCollection(params.uid, params.id);
  const info = await GetCollectionInfo(params.id);

  const bookmarks = JSON.parse(JSON.stringify(items));

  return <Main params={params} info={info} bookmarks={bookmarks} />;
};

type MetaProps = {
  params: { id: string };
};

// Dynamic Metadata Generation
export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const info = await GetCollectionInfo(params.id);

  return {
    title: info.name,
    description: info.description,
    keywords: ["clipmate", "bookmarks", "collections"],
    icons: "https://app.clipmate.ai/clipmate.ai.png",
    openGraph: {
      type: "website",
      url: "https://app.clipmate.ai",
      title: info.name,
      description: info.description || "No description",
      siteName: info.name,
      images: [GenerateOGImage({ title: info.name, description: info.description })],
    },
    twitter: {
      card: "summary_large_image",
      site: "@clipmateAI",
      creator: "@clipmateAI",
      title: info.name,
      description: info.description || "No description",
      images: [GenerateOGImage({ title: info.name, description: info.description })],
    },
  };
}

export default PublicPage;
