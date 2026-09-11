"use client";

import { useState } from "react";
import { FileText, MoreHorizontal } from "lucide-react";
import { Flex } from "ui-lab-components/flex";
import { List } from "ui-lab-components/list";
import { Menu } from "ui-lab-components/menu";
import { Surface, Note } from "./shared";

export default function Files() {
  const [files, setFiles] = useState([
    "Brand guidelines.pdf",
    "Homepage exploration.fig",
    "Launch checklist.md",
  ]);
  const [recent, setRecent] = useState<string | null>(null);
  return (
    <Surface title="Project files">
      <List aria-label="Project files">
        {files.map((file) => (
          <List.Item key={file} focusable={false}>
            <List.Media>
              <FileText size={20} />
            </List.Media>
            <Flex direction="column" gap="xs" className="min-w-0 flex-1">
              <List.Title>{file}</List.Title>
              <List.Desc>Edited today</List.Desc>
            </Flex>
            <Menu type="pop-over">
              <Menu.Trigger variant="ghost" aria-label={`Actions for ${file}`}>
                <MoreHorizontal size={18} />
              </Menu.Trigger>
              <Menu.Content>
                <Menu.Item
                  onSelect={() => {
                    setFiles((current) => [...current, `${file} copy ${current.length}`]);
                    setRecent(`Duplicated ${file}`);
                  }}
                >
                  Duplicate
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item
                  onSelect={() => {
                    setFiles((current) => current.filter((item) => item !== file));
                    setRecent(`Archived ${file}`);
                  }}
                >
                  Archive
                </Menu.Item>
              </Menu.Content>
            </Menu>
          </List.Item>
        ))}
      </List>
      {files.length === 0 && <p>No files in this project.</p>}
      {recent && <Note role="status">{recent}</Note>}
    </Surface>
  );
}

