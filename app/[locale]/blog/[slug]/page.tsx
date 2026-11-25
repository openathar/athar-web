import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, isRtl, type Locale } from "~/lib/i18n";
import { findPost } from "~/lib/blog";
import { blogCopy, formatBlogDate } from "~/lib/blog-copy";
import { LpShell } from "~/components/lp/shell";
import { ForceDark } from "~/components/force-dark";
import { StoreButtons } from "~/components/lp/app-store";

export const revalidate = 3600;

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) return {};
  const post = findPost(slug);
  if (!post) return {};
  const t = post.text[locale as Locale];
  return {
    title: `${t.title} — Athar`,
    description: t.description,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/blog/${slug}`])),
    },
    openGraph: { title: t.title, description: t.description, type: "article", publishedTime: post.date },
  };
}

/** Einzelner Blogartikel. Text: lib/blog.ts. */
export default async function BlogPostPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  const post = findPost(slug);
  if (!post) notFound();
  const t = post.text[l];
  const c = blogCopy[l];

  return (
    <LpShell locale={l} variant="2">
      <ForceDark />
      <article className="lp-wrap lp-privacy lp-blog-post" dir={isRtl(l) ? "rtl" : "ltr"}>
        <p className="lp-eyebrow mono">
          <time dateTime={post.date}>{formatBlogDate(post.date, l)}</time>
        </p>
        <h1 className="title-xl">{t.title}</h1>
        <p className="lp-lead">{t.description}</p>
        {t.sections.map((s, i) => (
          <section key={i} className="lp-privacy-sec">
            {s.h && <h2 className="title-l">{s.h}</h2>}
            {s.p.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
            {s.store && <StoreButtons locale={l} />}
          </section>
        ))}
        <p className="lp-blog-back">
          <Link href={`/${l}/blog`}>{c.back}</Link>
        </p>
      </article>
    </LpShell>
  );
}
