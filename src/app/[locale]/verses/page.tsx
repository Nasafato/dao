import { redirect } from "next/navigation";

export default async function VersesRootPage(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  redirect(`/${locale}/verses/chinese`);
}
