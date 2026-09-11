"use client";

import { useState } from "react";
import { Button } from "ui-lab-components/button";
import { Date as DatePicker } from "ui-lab-components/date";
import { Flex } from "ui-lab-components/flex";
import { Surface, Note, Choice } from "./shared";

export default function Booking() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 8, 16));
  const [time, setTime] = useState("10:30 AM");
  const [booked, setBooked] = useState(false);
  const dateLabel = date?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <Surface
      title={"Book a design session"}
      footer={
        <Button className="w-full" disabled={!date || booked} onPress={() => setBooked(true)}>
          {booked ? "Session booked" : "Confirm booking"}
        </Button>
      }
    >
      <Note>30 minutes with Alex Morgan</Note>
      <Flex direction="column" gap="sm" className="min-w-0">
        <DatePicker
          value={date}
          onChange={(next: Date) => {
            setDate(next);
            setBooked(false);
          }}
        />
        <Choice
          label="Available time"
          value={time}
          className="w-full"
          options={["9:00 AM", "10:30 AM", "2:00 PM", "4:30 PM"]}
          onChange={(next) => {
            setTime(next);
            setBooked(false);
          }}
        />
      </Flex>
      <Note role="status">
        {booked ? `Confirmed for ${dateLabel}, ${time}.` : `${dateLabel} · ${time} · New York`}
      </Note>
    </Surface>
  );
}
