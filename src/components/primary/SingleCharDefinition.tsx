import { twMerge } from "tailwind-merge";
import { DefinitionOutput } from "../../server/routers/_app";
import { buildPinyinWithTones, replaceNumericalPinyin } from "../../utils";

export function SingleCharDefinition({
  definition,
  className,
}: {
  definition: DefinitionOutput;
  className?: string;
}) {
  const { character, spellingVariants, pronunciationVariants } = definition;
  return (
    <div className={twMerge("space-y-4", className)}>
      <div className="flex gap-x-4">
        <h4 className="font-bold text-xl">{character}</h4>
        <div>
          <h5>Variants</h5>
          <ul className="space-y-1">
            {spellingVariants.map((variant) => (
              <li key={variant.id} className="flex gap-x-1 items-center">
                <div>{variant.variant}</div>
                <div>{variant.simplified ? "simplified" : "traditional"}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h5 className="underline font-medium">Definitions</h5>
        <ul className="space-y-1">
          {pronunciationVariants.map((variant) => (
            <li key={variant.id} className="gap-x-1 items-center">
              <div>{`${character} ${buildPinyinWithTones(
                variant.pronunciation
              )}`}</div>
              <ul>
                {variant.definitions.map((definition) => (
                  <li key={definition.id} className="ml-8 list-disc">
                    {replaceNumericalPinyin(definition.definition)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
