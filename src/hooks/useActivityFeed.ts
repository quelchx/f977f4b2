import { useQuery } from "@tanstack/react-query";

import { CallDetails } from "@/types";
import { config } from "@/config";

export function useActivityFeed() {
  async function fetcher(): Promise<CallDetails[]> {
    const response = await fetch(`${config.apiUrl}/activities`);
    if (!response.ok) {
      throw new Error(`Failed to fetch activity feed: ${response.statusText}`);
    }

    return response.json();
  }

  return useQuery({
    queryKey: ["activity-feed"],
    queryFn: fetcher,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
