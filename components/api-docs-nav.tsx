"use client";

import { useEffect, useState } from "react";

export type NavItem = { id: string; label: string; badge?: string };
export type NavGroup = { title: string; items: NavItem[] };

/**
 * Sticky index for the developer reference.
 *
 * Scrollspy via IntersectionObserver rather than scroll offsets: it stays
 * correct when panels differ wildly in height (a long endpoint next to a
 * three-line section) and costs nothing on the scroll thread. The rootMargin
 * biases the "active" band towards the upper third of the viewport, which is
 * where a reader's eye actually sits.
 */
export function ApiDocsNav({ groups }: { groups: NavGroup[] }) {
  const ids = groups.flatMap((g) => g.items.map((i) => i.id));
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -68% 0px", threshold: 0 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // ids is derived from a static prop; re-running on every render would
    // thrash the observer for no benefit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  return (
    <nav aria-label="API reference" lang="en" className="api-rail">
      {groups.map((group) => (
        <div key={group.title} className="mb-7">
          <p className="mono mb-3 text-[10px] uppercase tracking-[0.18em] text-muted/70">{group.title}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`api-rail-link ${isActive ? "is-active" : ""}`}
                  >
                    <span className="api-rail-dot" aria-hidden />
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="mono ms-auto shrink-0 text-[10px] uppercase tracking-wider text-muted/60">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
