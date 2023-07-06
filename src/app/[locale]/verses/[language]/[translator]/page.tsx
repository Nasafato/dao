export default function VersesTranslation({
  params,
}: {
  params: {
    translator: string;
    language: string;
  };
}) {
  const { language, translator } = params;
  return (
    <div>
      {language} {translator}
    </div>
  );
}
