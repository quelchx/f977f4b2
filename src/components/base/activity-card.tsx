import dayjs from "dayjs";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PhoneIncoming, PhoneOutgoing } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type { CallDetails } from "@/types";
import { archiveCall } from "@/controllers/activities.controller";

function IconDropDownMenu(props: CallDetails) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await archiveCall(props.id, props.is_archived);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-feed"] });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:text-muted">
          {props.direction === "inbound" ? (
            <PhoneIncoming size={24} className="text-red-500" />
          ) : (
            <PhoneOutgoing size={24} className="text-green-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => mutation.mutate()}>
            <span>Archive</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <span>Call Back</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ActivityCard(props: CallDetails) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center">
      <IconDropDownMenu {...props} />

      <div
        className="flex w-full cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-col items-start ml-4 space-y-1">
          <p className="text-sm font-medium leading-none capitalize">
            {props.call_type}
          </p>
          <p className="text-sm text-muted-foreground">
            {dayjs(props.created_at).format("MMM D, h:mm A")}
          </p>
        </div>
        <div className="ml-auto font-medium">
          <span>
            {Math.floor(props.duration / 60)}m {props.duration % 60}s
          </span>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Call Details</DialogTitle>
            <DialogDescription>
              {dayjs(props.created_at).format("MMM D, h:mm A")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid items-center grid-cols-4 gap-y-2">
            <p className="col-span-2 text-sm font-medium">Duration</p>
            <p className="col-span-2 text-sm font-medium">
              {Math.floor(props.duration / 60)}m {props.duration % 60}s
            </p>
            <p className="col-span-2 text-sm font-medium">Direction</p>
            <p className="col-span-2 text-sm font-medium">
              {props.direction === "inbound" ? "Inbound" : "Outbound"}
            </p>
            <p className="col-span-2 text-sm font-medium">Call Type</p>
            <p className="col-span-2 text-sm font-medium">{props.call_type}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
