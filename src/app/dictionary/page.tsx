import { Suspense } from "react";
import { Dictionary, Fallback } from "./Dictionary";
import { Container } from "../../components/shared/PageLayout";

export default function DictionaryPage() {
  return (
    <Container>
      <Suspense fallback={<Fallback />}>
        <Dictionary />
      </Suspense>
    </Container>
  );
}
