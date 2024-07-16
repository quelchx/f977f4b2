import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { useLocalTime } from "@/hooks/useLocaleTime";
import { useActivityFeed } from "@/hooks/useActivityFeed";

import { cn } from "@/lib/utils";

import { ActivityCard } from "./activity-card";
import { archiveCall } from "@/controllers/activities.controller";

export function ActivityFeed() {
  const time = useLocalTime();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, isFetching } = useActivityFeed();

  const [archived, setArchived] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const calls = useMemo(() => {
    if (!data) return null;

    return data?.filter((activity) => activity.is_archived === archived);
  }, [data, archived]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (calls) {
        setIsPending(true);

        for (const call of calls) {
          await archiveCall(call.id, call.is_archived);
        }

        setIsPending(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-feed"] });
    },
  });

  if (isLoading) return <div>Fetching Calls...</div>;

  if (isError) return <div>Something went wrong...</div>;

  return (
    calls && (
      <div
        className={cn(
          "flex flex-col items-start p-8 space-y-4 border rounded-lg shadow-2xl border-neutral-200",
          isFetching || isPending ? "animate-pulse" : ""
        )}
      >
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold">
            {archived ? "Archived Calls" : "Activity Feed"} ({calls.length})
          </h2>

          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              className="bg-slate-500"
              onClick={() => setArchived(!archived)}
            >
              {archived ? "Show Active" : "Show Archived"}
            </Button>
            <Button
              size="sm"
              className="bg-green-500"
              onClick={() => mutation.mutate()}
              disabled={calls.length === 0 || isPending}
            >
              {archived ? "Unarchive All" : "Archive All"}
            </Button>
          </div>
        </div>
        <div className="max-h-[500px] overflow-y-auto w-full">
          <div className="w-full pr-6 space-y-6">
            {calls.map((activity) => (
              <ActivityCard key={activity.id} {...activity} />
            ))}
          </div>
        </div>
        <time suppressHydrationWarning className="justify-end ml-auto text-sm">
          Current Time: {time}
        </time>
      </div>
    )
  );
}
