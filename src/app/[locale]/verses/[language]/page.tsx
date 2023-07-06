import { Languages } from "types/materials";

export default function Verses({
  params,
}: {
  params: { language: (typeof Languages)[number] };
}) {
  const language = params.language;
  return <div>{language}</div>;
}

export async function generateStaticParams() {
  return Languages.map((language) => ({ language }));
}
