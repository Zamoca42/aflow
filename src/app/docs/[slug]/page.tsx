import { AppDocs } from "@/component/docs/app-docs";

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
  return [{ slug: "welcome" }];
}

export const dynamicParams = false;
