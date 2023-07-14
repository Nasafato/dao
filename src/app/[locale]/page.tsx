import { SHARED_METADATA } from "@/app/sharedMetadata";
import { ResolvingMetadata, Metadata } from "next";
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/verses/chinese");
}

export async function generateMetadata(
  { params, ...rest }: { params: { locale: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  console.log(params, rest);
  console.log("locale", params.locale);

  return {
    ...SHARED_METADATA,
  };
}
