import { twJoin } from "tailwind-merge";
import { DefinitionOutput } from "../../server/routers/_app";
import { replaceNumericalPinyin, sortEntriesByRelevancy } from "../../utils";

export function SingleCharDefinition({
  entries: entries,
  className,
}: {
  entries: DefinitionOutput;
  className?: string;
}) {
  const sortedEntries = sortEntriesByRelevancy(entries);
  return (
    <ul className={twJoin("space-y-4", className)}>
      {sortedEntries.map((e) => {
        return (
          <li key={e.id}>
            <div>
              <h3 className="text-base">
                <CharacterHeader
                  simplified={e.simplified}
                  traditional={e.traditional}
                />{" "}
                {replaceNumericalPinyin(e.pronunciation)}
              </h3>
              <ul>
                {e.definitions.map((def) => {
                  return (
                    <li key={def.id} className="list-disc ml-4">
                      {def.definition}
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function CharacterHeader({
  simplified,
  traditional,
}: {
  simplified: string;
  traditional: string;
}) {
  if (simplified === traditional) {
    return <span className="text-green-500">{simplified}</span>;
  }

  return (
    <>
      <span className="text-green-500">{simplified}</span> [
      <span className="text-green-500">{traditional}</span>]
    </>
  );
}
