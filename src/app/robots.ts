import { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constant";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/repo/private/",
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
