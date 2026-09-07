import { InlineCodeHighlight } from "@/features/docs/components/code-display/inline-code-highlight";
import { Table, type Column } from "@/features/docs/components/table";
import { Popover } from "ui-lab-components";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type {
  APITypeToken,
  APICustomType,
  APIEnumValue,
  ComponentAPI,
  PropDefinition,
} from "ui-lab-registry";

function CustomTypeDefinition({
  customType,
  api,
  onCustomTypeSelect,
}: {
  customType: APICustomType;
  api: ComponentAPI;
  onCustomTypeSelect: (name: string) => void;
}) {
  const prefix =
    customType.kind === "alias"
      ? `type ${customType.name} = `
      : customType.kind === "interface"
        ? `interface ${customType.name} `
        : "";
  const suffix = customType.kind === "alias" ? ";" : "";
  const type = {
    name: customType.name,
    type: customType.type,
    required: true,
    typeTokens: customType.typeTokens,
  };

  return (
    <span className="font-mono text-xs text-foreground-300">
      {prefix}
      <TypeDisplay prop={type} api={api} onCustomTypeSelect={onCustomTypeSelect} />
      {suffix}
    </span>
  );
}

function CustomTypeInspector({ initialType, api }: { initialType: string; api: ComponentAPI }) {
  const [path, setPath] = useState([initialType]);
  const currentName = path.at(-1)!;
  const customType = api.customTypes?.[currentName];

  if (!customType) return null;

  return (
    <div
      className="mt-4 w-[min(36rem,calc(100vw-2rem))] space-y-4 text-xs"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div>
        <p className="flex flex-wrap items-center gap-1 font-mono text-foreground-300">
          {path.map((name, index) => (
            <span key={`${name}-${index}`} className="flex items-center gap-1">
              {index ? (
                <ChevronRight size={14} aria-hidden className="text-foreground-400" />
              ) : null}
              {index === path.length - 1 ? (
                <span>{name}</span>
              ) : (
                <button
                  type="button"
                  className="text-accent-500 underline cursor-pointer"
                  onClick={() => setPath((current) => current.slice(0, index + 1))}
                >
                  {name}
                </button>
              )}
            </span>
          ))}
        </p>
        <p className="mt-1 text-foreground-400">{customType.summary}</p>
      </div>
      <CustomTypeDefinition
        customType={customType}
        api={api}
        onCustomTypeSelect={(name) => setPath((current) => [...current, name])}
      />
      {customType.kind === "interface" && customType.members?.length ? (
        <div className="mt-4">
          <Table
            popover
            data={customType.members}
            getRowKey={(member) => member.name}
            columns={customTypeColumns(api, (name) => setPath((current) => [...current, name]))}
          />
        </div>
      ) : null}
      {customType.values?.length ? (
        <div className="mt-4">
          <Table
            popover
            data={customType.values}
            getRowKey={(item) => item.value}
            columns={enumValueColumns}
          />
        </div>
      ) : null}
      {customType.examples?.length ? (
        <div className="space-y-1 my-4">
          <p className="font-medium text-foreground-300">Examples</p>
          <div className="flex flex-col">
            {customType.examples.map((example) => (
              <InlineCodeHighlight key={example} code={example} language="tsx" />
            ))}
          </div>
        </div>
      ) : null}
      {customType.notes?.map((note) => (
        <p key={note} className="text-foreground-400">
          {note}
        </p>
      ))}
    </div>
  );
}

function customTypeColumns(
  api: ComponentAPI,
  onSelect: (name: string) => void,
): Column<PropDefinition>[] {
  return [
    {
      key: "name",
      label: "Member",
      width: "10rem",
      minWidth: "10rem",
      render: (value, member) => (
        <span className="whitespace-nowrap font-mono text-foreground-100">
          {String(value)}
          {member.required ? null : "?"}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      minWidth: "12rem",
      render: (_value, member) => (
        <TypeDisplay prop={member} api={api} onCustomTypeSelect={onSelect} />
      ),
    },
    {
      key: "description",
      label: "Description",
      width: "24rem",
      minWidth: "24rem",
      render: (value) => (
        <span className="min-w-48 font-sans font-medium text-foreground-400">{String(value)}</span>
      ),
    },
  ];
}

const enumValueColumns: Column<APIEnumValue>[] = [
  {
    key: "value",
    label: "Value",
    width: "10rem",
    minWidth: "10rem",
    render: (value) => <InlineCodeHighlight code={`"${String(value)}"`} language="typescript" />,
  },
  {
    key: "description",
    label: "Description",
    render: (value) => (
      <span className="min-w-48 font-sans font-medium text-foreground-400">{String(value)}</span>
    ),
  },
];

function TypeToken({
  token,
  api,
  onCustomTypeSelect,
}: {
  token: APITypeToken;
  api: ComponentAPI;
  onCustomTypeSelect?: (name: string) => void;
}) {
  const customType = token.customType ? api.customTypes?.[token.customType] : undefined;

  if (customType) {
    if (onCustomTypeSelect) {
      return (
        <button
          type="button"
          className="text-xs font-mono text-accent-500 underline cursor-pointer"
          onClick={() => onCustomTypeSelect(customType.name)}
        >
          {token.text}
        </button>
      );
    }

    return (
      <Popover
        position="top"
        align="start"
        show-arrow
        content={<CustomTypeInspector initialType={customType.name} api={api} />}
      >
        <button
          type="button"
          className="font-mono text-xs text-accent-500 underline cursor-pointer"
        >
          {token.text}
        </button>
      </Popover>
    );
  }

  if (token.href) {
    return (
      <a
        href={token.href}
        target="_blank"
        rel="noreferrer"
        className="font-mono text-xs text-accent-500 underline cursor-pointer"
      >
        {token.text}
      </a>
    );
  }

  return <span className="font-mono text-xs text-foreground-300">{token.text}</span>;
}

export function TypeDisplay({
  prop,
  api,
  onCustomTypeSelect,
}: {
  prop: PropDefinition;
  api: ComponentAPI;
  onCustomTypeSelect?: (name: string) => void;
}) {
  if (!prop.typeTokens?.length) {
    return (
      <InlineCodeHighlight
        code={
          prop.enumValues?.length
            ? prop.enumValues.map((item) => `"${item}"`).join(" | ")
            : prop.type
        }
        language="typescript"
      />
    );
  }

  return (
    <span>
      {prop.typeTokens.map((token, index) => (
        <TypeToken
          key={`${token.text}-${index}`}
          token={token}
          api={api}
          onCustomTypeSelect={onCustomTypeSelect}
        />
      ))}
    </span>
  );
}
