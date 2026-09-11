"use client";

import { useId, useState } from "react";
import { Button } from "ui-lab-components/button";
import { Divider } from "ui-lab-components/divider";
import { Flex } from "ui-lab-components/flex";
import { Input } from "ui-lab-components/input";
import { Surface, Note, Row, Field, Choice } from "./shared";

export default function Delivery() {
  const [service, setService] = useState("Standard");
  const [quantity, setQuantity] = useState("1");
  const [ordered, setOrdered] = useState(false);
  const id = useId();
  const valid =
    Number.isInteger(Number(quantity)) && Number(quantity) >= 1 && Number(quantity) <= 10;
  const total = ((valid ? Number(quantity) : 1) * 48 + (service === "Express" ? 12 : 0)).toFixed(2);
  return (
    <Surface
      title="Order summary"
      footer={
        <Button className="w-full" disabled={ordered || !valid} onPress={() => setOrdered(true)}>
          {ordered ? "Demo order placed" : `Place order · $${total}`}
        </Button>
      }
    >
      <Flex layout="bar" gap="sm" className="min-w-0">
        <Flex direction="column" gap="xs" className="min-w-0">
          <strong>Everyday notebook</strong>
          <Note>Set of three · dotted</Note>
        </Flex>
        <strong>$48</strong>
      </Flex>
      <Field
        label="Quantity"
        htmlFor={id}
        hint={!valid ? "Choose a quantity from 1 to 10." : undefined}
      >
        <Input
          id={id}
          type="number"
          min={1}
          max={10}
          value={quantity}
          error={!valid}
          onChange={(event) => {
            setQuantity(event.target.value);
            setOrdered(false);
          }}
        />
      </Field>
      <Flex direction="column" gap="sm" className="min-w-0">
        <Choice
          label="Shipping method"
          value={service}
          options={["Standard", "Express"]}
          onChange={(next) => {
            setService(next);
            setOrdered(false);
          }}
        />
        <Note>
          {service === "Standard"
            ? "Free shipping · 5–7 business days"
            : "$12 shipping · 1–2 business days"}
        </Note>
      </Flex>
      <Divider spacing="none" />
      <Row label="Total" value={`$${total}`} />
    </Surface>
  );
}

