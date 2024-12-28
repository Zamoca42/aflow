import { AppDocs } from "@/component/docs/app-docs";
import Welcome from "@/content/welcome.mdx";

export default async function Home() {
  return (
    <AppDocs>
      <Welcome />
    </AppDocs>
  );
}
