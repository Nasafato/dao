"use client";

import { MagnifyingGlassCircleIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { SingleCharDefinition } from "../../components/primary/SingleCharDefinition";
import { Spinner } from "../../components/shared/Spinner";
import { trpcClient } from "../../lib/trpcClient";

const LiStyle = "ring-1 ring-gray-300 rounded-md hover:bg-gray-100";
const commonSearchTerms = ["药", "冰", "道", "名", "为", "圣"];

export function Dictionary() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const query = searchParams?.get("query");
  useEffect(() => {
    if (!query || query.length < 1) {
      return;
    }

    setSearchTerm(query);
    if (inputRef.current) {
      inputRef.current.value = query;
    }
  }, [query]);

  const updateSearchTerm = useCallback(
    (searchTerm: string) => {
      if (searchTerm) {
        router.push(`/dictionary?query=${encodeURIComponent(searchTerm)}`);
      } else {
        router.push("/dictionary");
      }
      setSearchTerm(searchTerm);
      if (inputRef.current) {
        inputRef.current.value = searchTerm;
      }
    },
    [router]
  );

  const searchQuery = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: async () => {
      const result = await trpcClient.definition.findOne.query(searchTerm);
      return result;
    },
    networkMode: "offlineFirst",
    enabled: !!searchTerm && searchTerm.length > 0,
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const value = inputRef.current?.value;
    if (!value) {
      return;
    }
    updateSearchTerm(value);
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
                  updateSearchTerm(term);
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
          <SingleCharDefinition entries={searchQuery.data} />
        ) : searchTerm.length > 0 ? (
          <div>Nothing found</div>
        ) : null}
      </div>
    </div>
  );
}
