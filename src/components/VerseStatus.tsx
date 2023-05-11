import { useSession } from "next-auth/react";
import { queryClient } from "../setup";
import { AcademicCapIcon, XMarkIcon } from "@heroicons/react/20/solid";

export function VerseStatus({
  verseId,
  verseStatus,
}: {
  verseId: number;
  verseStatus: string | null;
}) {
  const onLearnClick = () => {
    console.log("learning verse", verseId);
    fetch("/api/verse", {
      method: "POST",
      body: JSON.stringify({
        status: "learning",
        verseId,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Failed to mark verse as 'learning'");
      })
      .then((json) => {
        console.log("json", json);
        queryClient.invalidateQueries(["verseStatuses"]);
      });
  };

  const onUnlearnClick = () => {
    console.log("unlearning verse", verseId);
    fetch("/api/verse", {
      method: "POST",
      body: JSON.stringify({
        status: "not-learning",
        verseId,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Failed to mark verse as 'learning'");
      })
      .then((json) => {
        console.log("json", json);
        queryClient.invalidateQueries(["verseStatuses"]);
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
        Learn
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
          <XMarkIcon className="h-3 w-3 text-red-500" /> Unlearn
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
