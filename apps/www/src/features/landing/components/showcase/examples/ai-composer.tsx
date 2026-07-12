"use client";

import { useState } from "react";
import { Button, Select, Tooltip } from "ui-lab-components";
import { FaGears, FaArrowRight } from "@/shared/icons/fa6";
import { SiOpenai, SiAnthropic, SiGooglegemini, SiClaude } from "@/shared/icons/si";
import {
  Check,
  FileText,
  Languages,
  Braces,
  AlignLeft,
  Code2,
  Search,
  Terminal,
  User,
  Wand2,
} from "lucide-react";
import { HiMicrophone, HiPaperClip } from "@/shared/icons/hi";
import type { ShowcasePanelProps } from "./types";

type Provider = "openai" | "anthropic" | "google";
type Message = { id: number; role: "user" | "assistant"; content: string };

interface ModelInfo {
  label: string;
  provider: Provider;
  description: string;
}

const MODELS: Record<string, ModelInfo> = {
  "gpt-4o": { label: "GPT-4o", provider: "openai", description: "Flagship" },
  "gpt-4.1": { label: "GPT-4.1", provider: "openai", description: "Best coding" },
  "o3": { label: "o3", provider: "openai", description: "Deep reasoning" },
  "o4-mini": { label: "o4-mini", provider: "openai", description: "Fast & smart" },
  "claude-opus-46": { label: "Claude Opus 4.6", provider: "anthropic", description: "Most powerful" },
  "claude-sonnet-46": { label: "Claude Sonnet 4.6", provider: "anthropic", description: "Best for coding" },
  "claude-haiku-45": { label: "Claude Haiku 4.5", provider: "anthropic", description: "Fastest" },
  "gemini-3-pro": { label: "Gemini 3 Pro", provider: "google", description: "Most capable" },
  "gemini-3-flash": { label: "Gemini 3 Flash", provider: "google", description: "Ultra fast" },
  "gemini-25-flash-lite": { label: "Gemini 2.5 Flash-Lite", provider: "google", description: "Cost efficient" },
};

const PROVIDER_ICONS: Record<Provider, React.ElementType> = {
  openai: SiOpenai,
  anthropic: SiClaude,
  google: SiGooglegemini,
};

const INITIAL_MESSAGES: Message[] = [
  { id: 1, role: "user", content: "Find the error in the authentication flow and suggest a fix." },
  { id: 2, role: "assistant", content: "I found the session check is using a stale token after refresh. Updating it to read the current session will resolve the redirect loop." },
];

const TOOL_CALLS = [
  { icon: Search, name: "Search codebase", detail: "auth/session.ts" },
  { icon: Terminal, name: "Read file", detail: "src/lib/auth.ts" },
  { icon: Code2, name: "Apply patch", detail: "Refresh session before redirect" },
];

export function AIComposer({ height }: ShowcasePanelProps) {
  const [text, setText] = useState("");
  const [model, setModel] = useState("claude-sonnet-46");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const selectedModel = MODELS[model];
  const ProviderIcon = PROVIDER_ICONS[selectedModel.provider] as React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  const assistantIndex = messages.findIndex((message) => message.role === "assistant");

  const sendMessage = () => {
    const content = text.trim();
    if (!content) return;

    setMessages((current) => [...current, { id: Date.now(), role: "user", content }]);
    setText("");
  };

  return (
    <div
      className="flex w-full flex-col overflow-hidden rounded-sm"
      style={{ height }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-4 px-3 py-4" aria-live="polite">
          {messages.map((message, index) => (
            <div key={message.id} className="space-y-2">
              {message.role === "user" ? (
                <div className="flex justify-end gap-2 pl-8">
                  <div className="max-w-[calc(100%-3rem)] rounded-sm border border-background-600 px-3.5 py-2.5 text-xs font-medium leading-6 text-foreground-100">
                    {message.content}
                  </div>
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-background-600 bg-background-800">
                    <User className="size-4 text-foreground-300" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-2 pr-8">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-background-700 bg-background-800">
                    <ProviderIcon className="size-4 text-foreground-200" />
                  </div>
                  <div className="max-w-[calc(100%-3rem)] rounded-sm border border-background-700 px-3.5 py-2.5 text-xs font-medium leading-6 text-foreground-200">
                    {message.content}
                  </div>
                </div>
              )}

              {message.role === "assistant" && index === assistantIndex && (
                <div className="space-y-1.5 pr-8">
                  {TOOL_CALLS.map(({ icon: Icon, name, detail }) => (
                    <div key={name} className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-2">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-background-700 bg-background-800">
                        <Icon className="size-3.5 text-foreground-400" />
                      </div>
                      <div className="flex items-center gap-2.5 rounded-sm px-2 py-1.5">
                        <p className="shrink-0 text-xs font-medium text-foreground-200">{name}</p>
                        <p className="min-w-0 truncate text-xs text-foreground-400">{detail}</p>
                        <Check className="mr-1 size-3.5 shrink-0 text-success-500" aria-label="Completed" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-3 mb-3 shrink-0 rounded-sm border border-background-700 p-2 focus-within:border-background-600">
        <textarea
          rows={2}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Reply to the assistant..."
          aria-label="Message"
          className="block w-full resize-none bg-transparent px-2 py-1 text-sm text-foreground-100 outline-none placeholder:text-foreground-400"
        />

        <div className="flex items-center gap-1 px-1 pt-1">
          <Select selectedKey={model} onSelectionChange={(key) => setModel(String(key))} className="w-fit shrink-0">
            <Select.Trigger
              variant="ghost"
              icon={{ prefix: <ProviderIcon className="size-3.5 shrink-0 text-foreground-400" /> }}
              className="h-8 border-none text-xs"
            >
              <span className="text-foreground-200">{selectedModel.label}</span>
            </Select.Trigger>
            <Select.Content>
              <Select.List>
                <Select.Sub>
                  <Select.SubTrigger textValue="OpenAI"><SiOpenai className="size-4" />OpenAI</Select.SubTrigger>
                  <Select.SubContent>
                    <Select.Item value="gpt-4o" textValue="GPT-4o" description="Flagship">GPT-4o</Select.Item>
                    <Select.Item value="gpt-4.1" textValue="GPT-4.1" description="Best coding">GPT-4.1</Select.Item>
                    <Select.Item value="o3" textValue="o3" description="Deep reasoning">o3</Select.Item>
                    <Select.Item value="o4-mini" textValue="o4-mini" description="Fast & smart">o4-mini</Select.Item>
                  </Select.SubContent>
                </Select.Sub>
                <Select.Sub>
                  <Select.SubTrigger textValue="Anthropic"><SiAnthropic className="size-4" />Anthropic</Select.SubTrigger>
                  <Select.SubContent>
                    <Select.Item value="claude-opus-46" textValue="Claude Opus 4.6" description="Most powerful">Claude Opus 4.6</Select.Item>
                    <Select.Item value="claude-sonnet-46" textValue="Claude Sonnet 4.6" description="Best for coding">Claude Sonnet 4.6</Select.Item>
                    <Select.Item value="claude-haiku-45" textValue="Claude Haiku 4.5" description="Fastest">Claude Haiku 4.5</Select.Item>
                  </Select.SubContent>
                </Select.Sub>
                <Select.Sub>
                  <Select.SubTrigger textValue="Google"><SiGooglegemini className="size-4" />Google</Select.SubTrigger>
                  <Select.SubContent>
                    <Select.Item value="gemini-3-pro" textValue="Gemini 3 Pro" description="Most capable">Gemini 3 Pro</Select.Item>
                    <Select.Item value="gemini-3-flash" textValue="Gemini 3 Flash" description="Ultra fast">Gemini 3 Flash</Select.Item>
                    <Select.Item value="gemini-25-flash-lite" textValue="Gemini 2.5 Flash-Lite" description="Cost efficient">Gemini 2.5 Flash-Lite</Select.Item>
                  </Select.SubContent>
                </Select.Sub>
              </Select.List>
            </Select.Content>
          </Select>

          <Tooltip content="Composer options">
            <Select className="w-fit">
              <Select.Trigger chevron={null} variant="ghost" className="h-8 w-8" aria-label="Composer options">
                <FaGears className="size-5.5 text-foreground-400" />
              </Select.Trigger>
              <Select.Content>
                <Select.List>
                  <Select.Sub>
                    <Select.SubTrigger textValue="Tone"><Wand2 className="size-4 text-foreground-400" />Tone</Select.SubTrigger>
                    <Select.SubContent>
                      <Select.Item value="professional" textValue="Professional">Professional</Select.Item>
                      <Select.Item value="casual" textValue="Casual">Casual</Select.Item>
                      <Select.Item value="technical" textValue="Technical">Technical</Select.Item>
                    </Select.SubContent>
                  </Select.Sub>
                  <Select.Sub>
                    <Select.SubTrigger textValue="Format"><FileText className="size-4 text-foreground-400" />Format</Select.SubTrigger>
                    <Select.SubContent>
                      <Select.Item value="markdown" textValue="Markdown" icon={<AlignLeft className="size-4" />}>Markdown</Select.Item>
                      <Select.Item value="json" textValue="JSON" icon={<Braces className="size-4" />}>JSON</Select.Item>
                    </Select.SubContent>
                  </Select.Sub>
                  <Select.Sub>
                    <Select.SubTrigger textValue="Language"><Languages className="size-4 text-foreground-400" />Language</Select.SubTrigger>
                    <Select.SubContent>
                      <Select.Item value="en" textValue="English">English</Select.Item>
                      <Select.Item value="es" textValue="Spanish">Spanish</Select.Item>
                    </Select.SubContent>
                  </Select.Sub>
                </Select.List>
              </Select.Content>
            </Select>
          </Tooltip>

          <div className="flex-1" />

          <Tooltip content="Attach file"><Button icon={<HiPaperClip />} size="sm" variant="ghost" aria-label="Attach file" /></Tooltip>
          <Tooltip content="Use microphone"><Button icon={<HiMicrophone />} size="sm" variant="ghost" aria-label="Use microphone" /></Tooltip>
          <Button onPress={sendMessage} icon={<FaArrowRight />} size="sm" isDisabled={!text.trim()} aria-label="Send message" />
        </div>
      </div>
    </div>
  );
}
