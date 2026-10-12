import { redirect } from "next/navigation";

/**
 * Der Prototyp ist in die Startseite eingegangen — alte Links und
 * Lesezeichen landen dort.
 */
export default async function BeitAtharRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
