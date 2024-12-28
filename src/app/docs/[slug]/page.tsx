import { AppDocs } from "@/component/docs/app-docs";
import docsList from "@/content/list.json";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const { default: Post } = await import(`@/content/${slug}.mdx`);

  return (
    <AppDocs>
      <Post />
    </AppDocs>
  );
}

export function generateStaticParams() {
  const docs = docsList.map((doc) => ({ slug: doc.url }));
  return docs;
}

export const dynamicParams = false;
