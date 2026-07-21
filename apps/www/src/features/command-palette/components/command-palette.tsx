"use client";

import { useEffect, useState } from "react";
import { FocusScope } from "react-aria";
import {
  Command,
  scoreCommandRelevance,
  useCommandContext,
  type CommandItem,
} from "ui-lab-components/command";
import { Badge } from "ui-lab-components/badge";
import { Divider } from "ui-lab-components/divider";
import { Modal } from "ui-lab-components/modal";
import { useApp } from "@/features/theme/lib/app-context";
import { useCommands, type ComponentResult } from "../hooks/use-commands";
import css from "./command-palette.module.css";

function matchesSearch(command: CommandItem, query: string): boolean {
  if (!query) return true;

  const value = query.toLowerCase();
  if (scoreCommandRelevance(command.label, value) > 0) return true;

  return Boolean(
    command.keywords?.some(
      (keyword) => scoreCommandRelevance(keyword, value) > 0,
    ),
  );
}

function Content({ itemCount }: { itemCount: number }) {
  const { filteredItems, searchValue } = useCommandContext();

  return (
    <>
      <Command.Input placeholder="Search commands, components, docs..." />

      <Command.List
        className={css.list}
        emptyMessage={`0 results for "${searchValue}"`}
      >
        {filteredItems.length > 0 ? (
          <Command.Groups
            className="[&>div:not(:first-child)_.category]:mt-8"
            renderCategory={(category) =>
              category ? (
                <>
                  <Command.Category className="category text-sm font-medium">
                    {category}
                  </Command.Category>
                  <Divider variant="dashed" size="sm" />
                </>
              ) : null
            }
            renderItem={(command) => (
              <Command.Item
                className="mb-2"
                value={command.id}
                textValue={command.label}
                action={command.action}
                icon={command.icon}
                hint={command.shortcut}
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm mb-1.5">{command.label}</h3>
                  {command.description ? (
                    <p className="w-full break-words text-sm">
                      {command.description}
                    </p>
                  ) : null}
                </div>
              </Command.Item>
            )}
          />
        ) : undefined}
      </Command.List>

      <Command.Footer>
        {itemCount > 0 ? (
          <>
            <div>
              <span>Navigate</span>
              <Badge variant="default">↑↓</Badge>
            </div>
            <div>
              <span>Select</span>
              <Badge variant="default">↵</Badge>
            </div>
            <div>
              <span>Close</span>
              <Badge variant="default">Esc</Badge>
            </div>
          </>
        ) : null}
      </Command.Footer>
    </>
  );
}

export default function CommandPalette() {
  const [components, setComponents] = useState<ComponentResult[]>([]);
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    currentThemeMode,
    setCurrentThemeMode,
  } = useApp();
  const commands = useCommands({
    components,
    currentThemeMode,
    setCurrentThemeMode,
  });

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/command-palette", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Command data request failed: ${response.status}`);
        }

        return response.json() as Promise<{ components: ComponentResult[] }>;
      })
      .then((data) => setComponents(data.components))
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Failed to load command palette data:", error);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <Modal
      open={isCommandPaletteOpen}
      onOpenChange={setIsCommandPaletteOpen}
      close={false}
      aria-label="Command palette"
      overlayClassName="command"
      styles={{
        overlay: css.overlay,
        backdrop: css.backdrop,
        root: css.panel,
        content: css.content,
      }}
    >
      <FocusScope contain restoreFocus>
        <Command
          className={css.palette}
          open={isCommandPaletteOpen}
          embedded
          onOpenChange={setIsCommandPaletteOpen}
          items={commands}
          filter={matchesSearch}
        >
          <Content itemCount={commands.length} />
        </Command>
      </FocusScope>
    </Modal>
  );
}
