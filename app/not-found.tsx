import Link from "next/link";
import { defaultLocale } from "~/lib/i18n";

export default function NotFound() {
  return (
    <html lang={defaultLocale}>
      <body>
        <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
          <h1 className="display text-5xl">404</h1>
          <p className="mt-3 text-muted">This page does not exist.</p>
          <Link
            href={`/${defaultLocale}`}
            className="mt-8 border-b border-ink pb-1 self-start"
          >
            → Athar
          </Link>
        </main>
      </body>
    </html>
  );
}
