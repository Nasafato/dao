import { SHARED_METADATA } from "@/app/sharedMetadata";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/verses/chinese");
}

export const metadata: Metadata = {
  ...SHARED_METADATA,
};
