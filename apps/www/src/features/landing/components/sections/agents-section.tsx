import type { ComponentType } from "react";
import { MousePointer2, SquareTerminal, Waves } from "lucide-react";
import {
  SiClaude,
  SiGithub,
  SiGooglegemini,
  SiMistralai,
  SiOllama,
  SiOpenai,
  SiPerplexity,
} from "@/shared/icons/si";
import { Lattice, Section } from "./section";
import { Button } from "ui-lab-components";

type Agent = { name: string; Icon: ComponentType<{ className?: string }> };

const agents: Agent[] = [
  { name: "Claude", Icon: SiClaude },
  { name: "Codex", Icon: SiOpenai },
  { name: "OpenCode", Icon: SquareTerminal },
  { name: "DeepSeek", Icon: Waves },
  { name: "Cursor", Icon: MousePointer2 },
  { name: "Gemini", Icon: SiGooglegemini },
  { name: "Copilot", Icon: SiGithub },
  { name: "Ollama", Icon: SiOllama },
  { name: "Mistral", Icon: SiMistralai },
  { name: "Perplexity", Icon: SiPerplexity },
];

export function AgentsSection() {
  return (
    // no heading beside a panel: the copy is a cell of the grid it describes
    <Section ground="1000" rhythm="small">
      <Lattice className="sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-start justify-between gap-7 bg-background-950 p-6 sm:col-span-2 lg:row-span-2">
          <h2 className="max-w-[18ch] text-balance text-2xl font-medium leading-tight text-foreground-100 sm:text-3xl">
            Works with every agent you already use.
          </h2>
          <Button variant="secondary" className="rounded-full">
            Get Started
          </Button>
        </div>

        {agents.map(({ name, Icon }) => (
          <div
            key={name}
            className="flex items-center gap-4 bg-background-1000 px-5 py-5 text-sm text-foreground-50 transition-colors hover:bg-background-950"
          >
            <Icon className="h-6 w-6 shrink-0 text-foreground-400" />
            {name}
          </div>
        ))}

        <div className="flex items-center bg-background-1000 px-4 py-5 text-sm text-foreground-400 sm:col-span-2">
          Anything that speaks MCP
        </div>
      </Lattice>
    </Section>
  );
}
