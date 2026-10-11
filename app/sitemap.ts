import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getClasses } from "@/lib/catalog";

// Tells Google which pages exist. Class and subject pages are added automatically from the syllabus.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${siteConfig.url}${path}`;
  const classes = await getClasses();

  const staticPages = [
    "",
    "/classes",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/refund-policy",
  ];

  return [
    ...staticPages.map((path) => ({ url: url(path) })),
    ...classes.flatMap((cls) => [
      { url: url(`/classes/${cls.slug}`) },
      ...cls.subjects.map((subject) => ({
        url: url(`/classes/${cls.slug}/${subject.slug}`),
      })),
    ]),
  ];
}
