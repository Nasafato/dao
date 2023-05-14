import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRef, useEffect } from "react";
import { VerseToUserSchema } from "../types";
import { z } from "zod";

export function useLogPropChanges(props: any) {
  const prevProps = useRef(props);

  useEffect(() => {
    const changedProps = Object.entries(props).reduce((acc, [key, value]) => {
      if (prevProps.current[key] !== value) {
        acc[key] = { oldValue: prevProps.current[key], newValue: value };
      }
      return acc;
    }, {} as { [key: string]: { oldValue: any; newValue: any } });

    if (Object.keys(changedProps).length > 0) {
      console.log("Changed props:", changedProps);
    }

    prevProps.current = props;
  });
}

// const VerseToUserArraySchema = z.array(VerseToUserSchema);

// export function useVerseStatuses() {
//   const { status, data } = useSession();
//   const queryResult = useQuery({
//     queryKey: ["verseStatuses"],
//     queryFn: async () => {
//       const res = await fetch("/api/verse");
//       const json = await res.json();
//       return VerseToUserArraySchema.parse(json.data);
//     },
//     enabled: status === "authenticated" && !!data,
//   });

//   if (!queryResult.data) {
//     return {};
//   }

//   const result: Record<string, string> = {};
//   for (const verseToUser of queryResult.data) {
//     result[verseToUser.verseId] = verseToUser.status;
//   }

//   return {
//     verseStatuses: result,
//     isFetched: queryResult.isFetched,
//   };
// }
