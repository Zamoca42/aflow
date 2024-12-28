import { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constant";
import docsList from "@/content/list.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = APP_URL;
  return [
    {
      url,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...docsList.map((doc) => ({
      url: `${url}/docs/${doc.url}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    })) as MetadataRoute.Sitemap,
  ];
}
