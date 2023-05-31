import { MagnifyingGlassCircleIcon } from "@heroicons/react/20/solid";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Spinner } from "../../components/shared/Spinner";
import { api } from "../../utils/trpc";
import { DefinitionOutput } from "../../server/routers/_app";

const LiStyle = "ring-1 ring-gray-300 rounded-md hover:bg-gray-100";
const commonSearchTerms = ["药", "冰", "道", "名", "为", "圣"];

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState("");

  const searchQuery = api.definition.findOne.useQuery(searchTerm, {
    enabled: !!searchTerm && searchTerm.length > 0,
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const value = inputRef.current?.value;
    if (!value) {
      return;
    }
    setSearchTerm(value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="py-2 max-w-sm mx-auto">
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1">Common search terms</h3>
        <ul className="flex gap-x-2">
          {commonSearchTerms.map((term) => (
            <li className={LiStyle} key={term}>
              <button
                className="px-2 py-1"
                onClick={() => {
                  setSearchTerm(term);
                  if (inputRef.current) {
                    inputRef.current.value = term;
                  }
                }}
              >
                {term}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassCircleIcon
            className="w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring-blue-300 sm:text-sm"
            placeholder=""
            ref={inputRef}
          />
        </form>
      </div>
      <div className="mt-8">
        {searchQuery.isLoading && !(searchQuery.fetchStatus === "idle") ? (
          <div className="flex items-center gap-x-1">
            Searching... <Spinner className="h-4 w-4" />
          </div>
        ) : searchQuery.data ? (
          <SingleCharDefinition definition={searchQuery.data} />
        ) : searchTerm.length > 0 ? (
          <div>Nothing found</div>
        ) : null}
      </div>
    </div>
  );
}

export function SingleCharDefinition({
  definition,
}: {
  definition: DefinitionOutput;
}) {
  const { character, spellingVariants, pronunciationVariants } = definition;
  return (
    <div className="space-y-4">
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
              <div>{`${character} ${variant.pronunciation}`}</div>
              <ul>
                {variant.definitions.map((definition) => (
                  <li key={definition.id} className="ml-8 list-disc">
                    {definition.definition}
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
