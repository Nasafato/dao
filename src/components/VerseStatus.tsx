import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AcademicCapIcon,
  PlusCircleIcon,
  PlusSmallIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Spinner } from "./Spinner";
import { VerseToUserSchema, VerseToUserSchemaType } from "../types";
import { api } from "../utils/trpc";
import { getQueryKey } from "@trpc/react-query";

export function VerseStatus({
  verseId,
  verseStatus,
}: {
  verseId: number;
  verseStatus: string | null;
}) {
  const utils = api.useContext();
  const updateStatusMutation = api.verseStatus.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.verseStatus.findMany.invalidate();
    },
  });
  const onUnlearnClick = () => {
    updateStatusMutation.mutate({
      verseId,
      status: "not-learning",
    });
  };

  const onLearnClick = () => {
    updateStatusMutation.mutate({
      verseId,
      status: "learning",
    });
  };

  const session = useSession();
  if (!(session?.status === "authenticated")) return null;
  if (verseStatus === "not-fetched") {
    return null;
  }
  if (!verseStatus || verseStatus === "not-learning")
    return (
      <button
        type="button"
        onClick={onLearnClick}
        className="text-xs ring-1 ring-gray-950/5 rounded-full px-3 py-1"
      >
        <div className="flex w-full gap-x-1 items-center">
          {updateStatusMutation.isLoading ? (
            <Spinner className="h-3 w-3 text-gray-200 fill-gray-800" />
          ) : (
            <PlusCircleIcon className="h-3 w-3 text-green-500" />
          )}
          <div>Learn</div>
        </div>
      </button>
    );

  if (verseStatus === "learning") {
    return (
      <div className="group text-xs">
        <div className="flex items-center gap-x-1 group-hover:hidden ring-1 ring-gray-950/5 rounded-full px-3 py-1">
          <AcademicCapIcon className="h-3 w-3 text-gray-600" /> Learning
        </div>
        <button
          className="hidden group-hover:flex items-center gap-x-1 ring-1 ring-gray-950/5 rounded-full px-3 py-1"
          onClick={onUnlearnClick}
        >
          {updateStatusMutation.isLoading ? (
            <Spinner className="h-3 w-3 text-gray-200 fill-gray-800" />
          ) : (
            <XMarkIcon className="h-3 w-3 text-red-500" />
          )}
          Unlearn
        </button>
      </div>
    );
  }

  if (verseStatus === "reviewing") {
    return <button className="text-sm">Unreview</button>;
  }

  return <div className="text-sm">Unrecognized state</div>;
}

// function renderPill(content) {
//   return (
//     <div className="flex items-center justify-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"></div>
//   );
// }
