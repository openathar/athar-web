"use client";

import dynamic from "next/dynamic";

// three.js nur laden, wenn Variante 2 wirklich geoeffnet wird (kein SSR noetig).
export const MoonStage = dynamic(() => import("./moon-stage").then((m) => m.MoonStage), {
  ssr: false,
  loading: () => <div className="lp-moon" aria-hidden />,
});
