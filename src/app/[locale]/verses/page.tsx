import { redirect } from "next/navigation";

export default function VersesRootPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  redirect(`/${locale}/verses/chinese`);
}
