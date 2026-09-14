---
name: nextjs-tailwind-conventions
description: Next.js App Router + Tailwind CSS conventions for marketing/content sites. Use when adding a page, working with app/[locale] i18n routing, or styling with Tailwind in a Next.js project.
license: MIT
---

# Next.js (App Router) + Tailwind Conventions

## i18n via `app/[locale]` routing

If the project uses `app/[locale]/page.tsx` structure (RTL-aware sites like
Arabic/English/German content): the locale is a route segment, not a query
param or cookie-only mechanism. Every page/layout under `[locale]` receives
`params: { locale: string }`. RTL languages (Arabic) need `dir="rtl"` set at
the `<html>` level based on locale, not per-component — check `layout.tsx`.

```tsx
// app/[locale]/layout.tsx
export default function Layout({ children, params }: { params: { locale: string } }) {
  const dir = params.locale === "ar" ? "rtl" : "ltr";
  return <html lang={params.locale} dir={dir}>{children}</html>;
}
```

## Tailwind conventions

- Prefer utility classes inline over `@apply` in a separate CSS file —
  keeps the "what does this look like" answer in the component itself.
- For repeated multi-class combos (e.g. a button style used in 5 places),
  extract to a component, not a Tailwind `@apply` class — component
  composition beats CSS abstraction for maintainability with AI agents
  editing the code later.
- Dark mode: check if the project uses `dark:` variants (class-based) vs.
  `prefers-color-scheme` (media-based) before adding new dark-mode styles —
  mixing both strategies in one project causes inconsistent toggling.

## Static export vs. server rendering

Check `next.config.js` for `output: "export"` before assuming server
features (API routes, ISR, middleware) are available — marketing/content
sites are often statically exported (no Node runtime at request time),
which silently breaks anything relying on server-side execution.

## Common failure modes

- **Hydration mismatch warnings**: usually locale-dependent content
  (dates, numbers) rendered differently server vs. client — use a
  consistent formatting library configured with explicit locale, not
  `Intl` defaults that vary by environment.
- **RTL layout bugs**: Tailwind's `space-x-*`/`mr-*`/`ml-*` utilities don't
  auto-flip for RTL — use logical properties (`ms-*`/`me-*`, `space-x-reverse`)
  or Tailwind's RTL plugin if the project targets Arabic content.
- **Broken images/fonts after static export**: `next/image` optimization
  API isn't available in static export mode — needs `unoptimized: true` or
  a different image strategy.

## When to use vs. skip

Use for Next.js App Router projects with Tailwind. Skip for Pages Router
(different data-fetching model) or non-Tailwind styling.
