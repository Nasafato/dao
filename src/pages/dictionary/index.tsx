import { MagnifyingGlassCircleIcon } from "@heroicons/react/20/solid";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Spinner } from "../../components/shared/Spinner";
import { api } from "../../utils/trpc";

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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
      <div>
        {searchQuery.isLoading && !(searchQuery.fetchStatus === "idle") ? (
          <Spinner />
        ) : (
          <pre>{JSON.stringify(searchQuery.data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
