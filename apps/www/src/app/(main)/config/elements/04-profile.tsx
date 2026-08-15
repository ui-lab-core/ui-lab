"use client";


import { Badge, Button, Card, Divider, Flex, Scroll, Tabs } from "ui-lab-components";
import { Bot, Figma, Github, MessageCircle, Settings2, Triangle } from "lucide-react";

const software = [
  {
    category: "AI workspace",
    items: [
      { name: "Codex", access: "Studio seat · 48% quota left", action: "Open", icon: Bot },
      { name: "ChatGPT Team", access: "Studio seat · shared projects", action: "Open", icon: MessageCircle },
      { name: "Claude", access: "Available to activate", action: "Activate", icon: Bot },
    ],
  },
  {
    category: "Make & ship",
    items: [
      { name: "Figma", access: "Editor seat", action: "Open", icon: Figma },
      { name: "GitHub", access: "Studio organization", action: "Open", icon: Github },
      { name: "Vercel", access: "Available to activate", action: "Activate", icon: Triangle },
    ],
  },
];

export function Profile() {
  return (
    <Card className="flex h-full w-full flex-col bg-transparent">
      <Card.Header>
        <Flex justify-between align-center>
          <Flex direction="column" gap="xs">
            <span className="text-sm font-medium text-foreground-100">Profile</span>
            <span className="text-xs text-foreground-400">Your space, your defaults.</span>
          </Flex>
          <Button size="sm" variant="secondary" icon={{ left: <Settings2 size={14} /> }}>Edit</Button>
        </Flex>
      </Card.Header>
      <Card.Body className="flex min-h-0 flex-1 flex-col py-4">
        <Tabs default="profile" className="flex h-full flex-col">
          <Tabs.List aria-label="Profile settings" className="w-full">
            <Tabs.Trigger value="profile" className="flex-1">Profile</Tabs.Trigger>
            <Tabs.Trigger value="software" className="flex-1">Software</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="profile" className="flex flex-1 flex-col pt-4">
            <Flex direction="column" align-center gap="sm" className="pt-1 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm border border-background-700 bg-background-800 text-sm font-semibold text-foreground-300">YC</div>
              <Flex direction="column" align-center gap="none" className="min-w-0">
                <span className="text-base font-semibold text-foreground-100">Rin Park</span>
                <span className="max-w-[15rem] text-sm leading-5 text-foreground-400">Designer, developer, and curious builder</span>
              </Flex>
              <Badge variant="default" className="max-w-full text-center">Mostly async · available for critique</Badge>
            </Flex>
            <Divider spacing="md" />
            <Flex direction="column" gap="xs" className="rounded-sm bg-background-900 p-3">
              <span className="text-xs font-medium text-foreground-400">Working style</span>
              <p className="text-sm leading-5 text-foreground-300">Clear context over urgency. AI handles the first draft; people handle direction, taste, and hard decisions.</p>
            </Flex>
          </Tabs.Content>
          <Tabs.Content value="software" className="min-h-0 flex-1 pt-4">
            <Scroll fade-y className="pr-3">
              <Flex direction="column" gap="sm">
                {software.map((group, index) => (
                  <div key={group.category}>
                    {index > 0 && <Divider spacing="sm" />}
                    <span className="text-xs font-medium text-foreground-400">{group.category}</span>
                    <div role="list" aria-label={group.category} className="mt-2 space-y-1">
                      {group.items.map((item) => {
                        const SoftwareIcon = item.icon;
                        const needsActivation = item.action === "Activate";
                        return (
                          <div key={item.name} role="listitem" className={`min-w-0 rounded-sm px-1 py-1.5 ${needsActivation ? "opacity-60" : ""}`}>
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-background-800 text-foreground-300"><SoftwareIcon size={14} /></div>
                            <div className="mt-2 flex min-w-0 items-end gap-2">
                              <div className="min-w-0 flex-1 leading-tight">
                                <span className="block truncate text-sm font-medium text-foreground-100">{item.name}</span>
                                <span className="mt-1 block truncate text-xs text-foreground-500">{item.access}</span>
                              </div>
                              <Button size="sm" variant={needsActivation ? "ghost" : "secondary"} className="shrink-0">{item.action}</Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </Flex>
            </Scroll>
          </Tabs.Content>
        </Tabs>
      </Card.Body>
    </Card>
  );
}
