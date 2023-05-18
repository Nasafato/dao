import { GetStaticPropsContext } from "next";
import { DAO_VERSES } from "../../lib/daoText";

export default function VersePage({
  verse,
}: {
  verse: { id: number; text: string };
}) {
  return (
    <div>
      <div>Verse {verse.id}</div>
      <div>{verse.text}</div>
    </div>
  );
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const verse = DAO_VERSES.find((v) => v.id.toString() === params?.verseId);
  console.log("verse");
  return {
    props: {
      verse,
    },
  };
}

export async function getStaticPaths() {
  const paths = [];
  for (let i = 1; i < 81; i++) {
    paths.push({
      params: { verseId: i.toString() },
    });
  }
  return {
    paths,
    fallback: false,
  };
}
