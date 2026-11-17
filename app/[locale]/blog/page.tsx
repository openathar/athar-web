import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, isRtl, type Locale } from "~/lib/i18n";
import { publishedPosts } from "~/lib/blog";
import { blogCopy, formatBlogDate } from "~/lib/blog-copy";
import { LpShell } from "~/components/lp/shell";
import { ForceDark } from "~/components/force-dark";

// Artikel mit künftigem Datum erscheinen ab ihrem Tag, ohne neues Deployment.
export const revalidate = 3600;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const c = blogCopy[locale as Locale];
  return {
    title: `${c.title} — Athar`,
    description: c.metaDescription,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/blog`])),
    },
  };
}

/** Blog-Übersicht. Artikel: lib/blog.ts, Rahmentexte: lib/blog-copy.ts. */
export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  const c = blogCopy[l];
  const posts = publishedPosts();

  return (
    <LpShell locale={l} variant="2">
      <ForceDark />
      <div className="lp-wrap lp-blog" dir={isRtl(l) ? "rtl" : "ltr"}>
        <h1 className="title-xl">{c.title}</h1>
        <p className="lp-lead">{c.intro}</p>
        <ul className="lp-blog-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/${l}/blog/${p.slug}`} className="lp-blog-item">
                <time className="mono" dateTime={p.date}>
                  {formatBlogDate(p.date, l)}
                </time>
                <h2 className="title-l">{p.text[l].title}</h2>
                <p>{p.text[l].description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </LpShell>
  );
}
