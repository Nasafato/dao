import { Translators } from "types/materials";
import { VersesEnglish } from "../../../components/primary/VersesEnglish";

export default async function VersesEnglishPage(props: {
  params: { translator: (typeof Translators)[number] };
}) {
  const translator = props.params.translator;
  return <VersesEnglish translator={translator} />;
}

export async function generateStaticParams() {
  return Translators.map((translator) => ({
    translator,
  }));
}
