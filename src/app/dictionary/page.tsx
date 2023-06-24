import { Suspense } from "react";
import { Dictionary } from "./Dictionary";

export default function DictionaryPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Dictionary />
      </Suspense>
    </div>
  );
}
