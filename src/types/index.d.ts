export type CallDetails = {
  direction: "inbound" | "outbound";
  from: number;
  to: number;
  via: number;
  duration: number;
  is_archived: boolean;
  call_type: "answered" | "missed" | "voicemail";
  id: string;
  created_at: string;
};
