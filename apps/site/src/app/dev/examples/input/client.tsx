"use client";

import { useState } from "react";

import { Input, Flex, Badge } from "ui-lab-components";
import {
  FaMagnifyingGlass,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaXmark,
  FaLink,
  FaAt,
  FaCopy,
  FaCheck,
  FaHashtag,
} from "react-icons/fa6";

import { DevExampleLayout, type DevExample } from "../dev-example-layout";

function BasicPreview() {
  return (
    <Flex direction="column" gap="sm" style={{ width: 320 }}>
      <Input placeholder="Default input" />
      <Input variant="ghost" placeholder="Ghost variant" />
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Error state" error />
    </Flex>
  );
}

function IconPreview() {
  return (
    <Flex direction="column" gap="sm" style={{ width: 320 }}>
      <Input icon={<FaMagnifyingGlass className="w-3.5 h-3.5 text-foreground-400" />} placeholder="Search..." />
      <Input icon={<FaEnvelope className="w-3.5 h-3.5 text-foreground-400" />} placeholder="Email address" />
      <Input
        icon={{
          prefix: <FaLink className="w-3.5 h-3.5 text-foreground-400" />,
          suffix: <FaCheck className="w-3.5 h-3.5 text-green-500" />,
        }}
        placeholder="https://example.com"
      />
    </Flex>
  );
}

function PasswordPreview() {
  const [visible, setVisible] = useState(false);

  return (
    <Flex direction="column" gap="sm" style={{ width: 320 }}>
      <Input
        type={visible ? "text" : "password"}
        icon={<FaLock className="w-3.5 h-3.5 text-foreground-400" />}
        styles={{
          icon: "bg-red-500",
          controls: "bg-red-500"
        }}
        placeholder="Enter password"
        actions={[
          {
            icon: visible ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />,
            title: visible ? "Hide password" : "Show password",
            onClick: () => setVisible((v) => !v),
          },
        ]}
      />
    </Flex>
  );
}

function SearchWithClearPreview() {
  const [query, setQuery] = useState("");

  return (
    <Flex direction="column" gap="sm" style={{ width: 320 }}>
      <Input
        icon={<FaMagnifyingGlass className="w-3.5 h-3.5 text-foreground-400" />}
        placeholder="Search components..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        hint={<Badge size="sm">⌘K</Badge>}
        actions={
          query
            ? [
              {
                icon: <FaXmark className="w-3.5 h-3.5" />,
                title: "Clear search",
                onClick: () => setQuery(""),
              },
            ]
            : []
        }
      />
    </Flex>
  );
}

function NumberPreview() {
  return (
    <Flex direction="column" gap="sm" style={{ width: 200 }}>
      <Input type="number" placeholder="Quantity" defaultValue={1} min={0} max={99} />
      <Input
        type="number"
        icon={<FaHashtag className="w-3.5 h-3.5 text-foreground-400" />}
        placeholder="Port"
        defaultValue={3000}
      />
    </Flex>
  );
}

function ActionsPreview() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Flex direction="column" gap="sm" style={{ width: 360 }}>
      <Input
        icon={<FaAt className="w-3.5 h-3.5 text-foreground-400" />}
        placeholder="username"
        actions={{
          right: [
            {
              icon: copied
                ? <FaCheck className="w-3.5 h-3.5 text-green-500" />
                : <FaCopy className="w-3.5 h-3.5" />,
              title: copied ? "Copied!" : "Copy username",
              onClick: handleCopy,
            },
          ],
        }}
      />
      <Input
        placeholder="Enter a tag..."
        actions={{
          left: [
            {
              icon: <FaHashtag className="w-3 h-3" />,
              title: "Tag prefix",
              onClick: () => { },
            },
          ],
          right: [
            {
              icon: <FaCheck className="w-3.5 h-3.5" />,
              title: "Add tag",
              onClick: () => { },
            },
          ],
        }}
      />
    </Flex>
  );
}

function HintPreview() {
  return (
    <Flex direction="column" gap="sm" style={{ width: 320 }}>
      <Input placeholder="Search..." hint={<Badge size="sm">⌘K</Badge>} />
      <Input placeholder="Quick open..." hint={<Badge size="sm">⌘P</Badge>} />
      <Input placeholder="Command palette..." hint={<Badge size="sm">⌘⇧P</Badge>} />
    </Flex>
  );
}

const examples: DevExample[] = [
  {
    id: "basic",
    title: "Basic",
    description: "Default, ghost, disabled, and error states.",
    preview: <BasicPreview />,
  },
  {
    id: "icons",
    title: "Icons",
    description: "Prefix icons, suffix icons, and combined prefix/suffix slots.",
    preview: <IconPreview />,
  },
  {
    id: "password-toggle",
    title: "Password Toggle",
    description: "A password field with a visibility toggle action.",
    preview: <PasswordPreview />,
  },
  {
    id: "search-with-clear",
    title: "Search with Clear",
    description: "A search input with a keyboard shortcut hint and a conditional clear action.",
    preview: <SearchWithClearPreview />,
  },
  {
    id: "number",
    title: "Number Input",
    description: "Number type inputs with built-in spin controls.",
    preview: <NumberPreview />,
  },
  {
    id: "actions",
    title: "Actions",
    description: "Left and right action slots for inline interactive buttons.",
    preview: <ActionsPreview />,
  },
  {
    id: "hints",
    title: "Keyboard Hints",
    description: "Badge-style keyboard shortcut hints inside the input.",
    preview: <HintPreview />,
  },
];

export default function InputExamplesPage() {
  return (
    <DevExampleLayout
      title="Input Examples"
      description="Primitive input examples showcasing icons, actions, hints, and number controls."
      examples={examples}
      backHref="/dev/examples"
      backLabel="Examples"
    />
  );
}
