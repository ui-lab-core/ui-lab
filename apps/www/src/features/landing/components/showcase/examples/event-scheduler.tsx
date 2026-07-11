"use client";

import { useState } from "react";
import { Button, Badge } from "ui-lab-components";
import { CalendarDays, Clock, Video } from "lucide-react";

const DAYS = [
  { id: "mon", label: "Mon", date: 13 },
  { id: "tue", label: "Tue", date: 14 },
  { id: "wed", label: "Wed", date: 15 },
  { id: "thu", label: "Thu", date: 16 },
  { id: "fri", label: "Fri", date: 17 },
];

const SLOTS = ["9:00", "9:30", "10:00", "11:30", "13:00", "14:30", "15:00", "16:30"];

export function EventScheduler() {
  const [day, setDay] = useState("wed");
  const [slot, setSlot] = useState<string | null>("10:00");
  const selectedDay = DAYS.find((d) => d.id === day)!;

  return (
    <div className="h-fit w-full bg-background-900 border border-background-700 rounded-sm overflow-hidden">
      <div className="px-4 pt-3.5 pb-3 border-b border-background-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays size={18} className="text-foreground-300" />
          <div>
            <div className="text-sm font-semibold text-foreground-100">Book a demo</div>
            <div className="text-sm text-foreground-400 mt-0.5">30 min · Google Meet</div>
          </div>
        </div>
        <Badge icon={<Video size={11} />}>Remote</Badge>
      </div>

      <div className="px-4 py-3 flex gap-1.5">
        {DAYS.map((d) => (
          <Button
            key={d.id}
            variant={d.id === day ? "default" : "outline"}
            onPress={() => setDay(d.id)}
            aria-pressed={d.id === day}
            className="flex-1 h-auto py-2"
          >
            <span className="flex flex-col items-center">
              <span className="text-xs">{d.label}</span>
              <span className="text-sm font-semibold mt-0.5">{d.date}</span>
            </span>
          </Button>
        ))}
      </div>

      <div className="px-4 pb-3 grid grid-cols-4 gap-1.5">
        {SLOTS.map((time) => (
          <Button
            key={time}
            size="sm"
            variant={slot === time ? "default" : "outline"}
            onPress={() => setSlot(time)}
            aria-pressed={slot === time}
            className="w-full"
          >
            {time}
          </Button>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-background-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-foreground-400">
          <Clock size={14} />
          {slot ? `${selectedDay.label} ${selectedDay.date} June · ${slot}` : "Pick a time"}
        </div>
        <Button isDisabled={!slot}>Confirm</Button>
      </div>
    </div>
  );
}
