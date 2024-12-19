import { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constant";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = APP_URL;
  return [
    {
      url,
      lastModified: new Date().toDateString(),
      changeFrequency: "yearly",
      priority: 1,
    },
  ];
}
