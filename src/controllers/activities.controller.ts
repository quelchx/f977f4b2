import { config } from "@/config";

export async function archiveCall(id: string, achived: boolean) {
  return await fetch(`${config.apiUrl}/activities/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_archived: !achived }),
  });
}
