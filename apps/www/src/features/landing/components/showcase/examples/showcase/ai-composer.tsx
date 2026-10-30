"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "ui-lab-components/button";
import { Scroll } from "ui-lab-components/scroll";
import { TextArea } from "ui-lab-components/textarea";
import {
  FaCheck,
  FaCodeBranch,
  FaFileLines,
  FaList,
  FaMagnifyingGlass,
  FaMicrophone,
  FaPencil,
  FaPlus,
} from "@/shared/icons/fa6";
import { HiArrowUturnRight } from "@/shared/icons/hi2";
import { LuBot } from "@/shared/icons/lu";
import { cn } from "@/shared/lib/utils";
import type { ShowcasePanelProps } from "../types";

type IconType = React.ComponentType<{ className?: string }>;

type ToolStatus = "executing" | "completed";

interface ToolDetail {
  id: string;
  operationIcon: IconType;
  message: string;
  /** Where the operation ran: the UI Lab MCP server, the lab skill, the editor or git. */
  source: string;
}

interface ToolCall {
  actionLabel: string;
  status: ToolStatus;
  detailsHistory: ToolDetail[];
}

interface Attachment {
  name: string;
  dimensions: string;
}

type ChatMessage =
  | {
      id: string;
      role: "user" | "assistant";
      type: "text";
      content: string;
      reveal?: boolean;
      attachment?: Attachment;
    }
  | { id: string; role: "assistant"; type: "tool-call"; toolCall: ToolCall }
  | { id: string; role: "assistant"; type: "processing" };

/** Ported from the app's theme.css / components.css so the panel needs no global CSS. */
const keyframes = `
@keyframes ai-fade-in-up {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0px); }
}
@keyframes ai-timeline-reveal {
  0% { transform: scaleY(0); opacity: 0; }
  50% { opacity: 0.15; }
  100% { transform: scaleY(1); opacity: 0.3; }
}
@keyframes ai-fan-bar {
  0% { opacity: 1; }
  12.5% { opacity: 0.82; }
  25% { opacity: 0.64; }
  37.5% { opacity: 0.46; }
  50% { opacity: 0.28; }
  62.5% { opacity: 0.46; }
  75% { opacity: 0.64; }
  87.5% { opacity: 0.82; }
  100% { opacity: 1; }
}
.ai-fade-in-up { animation: ai-fade-in-up 0.35s ease-out both; }
.ai-message-with-timeline { position: relative; }
.ai-message-with-timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 36px;
  height: calc(100% - 20px);
  width: 2px;
  opacity: 0.3;
  animation: ai-timeline-reveal 0.8s ease-out forwards;
  transform-origin: top;
}
`;

/* -------------------------------------------------------------------------- */
/*                                 Fan loader                                 */
/* -------------------------------------------------------------------------- */

const FAN_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/** Eight bars around a circle, each one trailing the next in opacity as the wave rotates. */
function FanLoader({
  size = 40,
  barColor = "currentColor",
  duration = 1.2,
}: {
  size?: number;
  barColor?: string;
  duration?: number;
}) {
  const barRadius = size * 0.35;
  const barWidth = size * 0.12;
  const barHeight = size * 0.25;

  return (
    <span className="inline-flex items-center justify-center" aria-hidden="true">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {FAN_ANGLES.map((angle, index) => (
            <g
              key={angle}
              transform={`rotate(${angle})`}
              style={{
                animation: `ai-fan-bar ${duration}s linear infinite`,
                animationDelay: `-${(((8 - index) % 8) / 8) * duration}s`,
              }}
            >
              <rect
                x={-barWidth / 2}
                y={barRadius - barHeight / 2}
                width={barWidth}
                height={barHeight}
                fill={barColor}
                rx={barWidth / 4}
              />
            </g>
          ))}
        </g>
      </svg>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Tool call card                               */
/* -------------------------------------------------------------------------- */

const getStatusIcon = (status: ToolStatus) =>
  status === "completed" ? (
    <FaCheck className="w-3.5 h-3.5" />
  ) : (
    <FanLoader size={14} duration={1} />
  );

const getStatusColor = (status: ToolStatus) =>
  status === "completed"
    ? "text-success-600 bg-success-500/10"
    : "text-foreground-400 bg-background-600/20";

/** The avatar slot doubles as the status of whatever the agent is doing. */
function StatusAvatar({ status }: { status: ToolStatus }) {
  return (
    <div
      className={cn(
        "w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-sm border border-background-700 inset-ring-3 inset-ring-background-950",
        getStatusColor(status),
      )}
    >
      {getStatusIcon(status)}
    </div>
  );
}

function ToolCallCard({ toolCall }: { toolCall: ToolCall }) {
  const { actionLabel, status, detailsHistory } = toolCall;

  return (
    <div className="rounded-2xl border border-background-700 bg-background-950/90 px-3 py-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-foreground-100">{actionLabel}</span>
        <span className="text-xs text-foreground-400">
          {status === "completed" ? "Done" : "Working…"}
        </span>
      </div>

      {detailsHistory.length > 0 && (
        <ul className="mt-2 space-y-1.5 border-t border-background-800 pt-2">
          {detailsHistory.map((detail) => {
            const IconComponent = detail.operationIcon;
            return (
              <li key={detail.id} className="ai-fade-in-up flex items-center gap-2.5">
                <IconComponent className="w-3.5 h-3.5 flex-shrink-0 text-foreground-400" />
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground-400">
                  {detail.message}
                </span>
                <span className="flex-shrink-0 text-xs text-foreground-400">{detail.source}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Message bubble                               */
/* -------------------------------------------------------------------------- */

const REVEAL_MS_PER_CHAR = 3;

/**
 * Keyed by message id at the call site so React mounts one instance per message and
 * keeps it. Whether to reveal is decided once, before anything can paint, so the
 * text never flashes in full before rewinding to nothing.
 */
function RevealedText({ text, animate }: { text: string; animate: boolean }) {
  const [visibleCount, setVisibleCount] = useState(() => (animate ? 0 : text.length));
  const revealedCountRef = useRef(visibleCount);

  useEffect(() => {
    if (revealedCountRef.current >= text.length) return;

    const startCount = revealedCountRef.current;
    const startTime = performance.now();
    let frame = requestAnimationFrame(function tick(now: number) {
      const next = Math.min(
        text.length,
        startCount + Math.floor((now - startTime) / REVEAL_MS_PER_CHAR),
      );
      revealedCountRef.current = next;
      setVisibleCount(next);
      if (next < text.length) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [text]);

  return <p className="leading-5">{text.slice(0, visibleCount)}</p>;
}

const LOADING_LABELS = [
  "Thinking...",
  "Processing...",
  "Working on it...",
  "Preparing a response...",
];

function LoadingLabel({ initialIndex }: { initialIndex: number }) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % LOADING_LABELS.length), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm font-medium text-foreground-200" aria-live="polite">
      {LOADING_LABELS[index]}
    </p>
  );
}

/** Uneven widths so the drawn feature rows read as content, not placeholders. */
const MOCKUP_FEATURES = ["w-4/5", "w-3/5", "w-2/3"];

/** A drawn stand-in for the attached screenshot: a phone mockup of a billing card. */
function ScreenshotAttachment({ attachment }: { attachment: Attachment }) {
  return (
    <figure className="w-56 rounded-md border border-background-600/40 bg-background-900/90 p-1">
      <div
        aria-hidden="true"
        className="flex h-32 items-end justify-center overflow-hidden rounded-sm border border-background-800 bg-background-950 px-6 pt-4"
      >
        <div className="flex w-full flex-col gap-1.5 rounded-t-sm border border-b-0 border-background-700 bg-background-900 p-2.5">
          <div className="flex items-center justify-between">
            <div className="h-1 w-8 rounded-full bg-background-600" />
            <div className="h-2 w-6 rounded-full bg-background-700" />
          </div>
          <p className="text-sm font-semibold leading-none tabular-nums text-foreground-200">
            $24<span className="text-[10px] font-normal text-foreground-400">/mo</span>
          </p>
          {MOCKUP_FEATURES.map((width) => (
            <div key={width} className="flex items-center gap-1">
              <div className="h-1 w-1 flex-shrink-0 rounded-full bg-background-500" />
              <div className={cn("h-1 rounded-full bg-background-700", width)} />
            </div>
          ))}
          <div className="mt-0.5 h-3.5 rounded-sm bg-foreground-200/80" />
        </div>
      </div>
      <figcaption className="flex items-center justify-between gap-2 px-1.5 pb-0.5 pt-1.5 text-xs">
        <span className="truncate font-medium text-foreground-200">{attachment.name}</span>
        <span className="flex-shrink-0 tabular-nums text-foreground-400">
          {attachment.dimensions}
        </span>
      </figcaption>
    </figure>
  );
}

function MessageBubble({
  message,
  animateEntrance = true,
}: {
  message: ChatMessage;
  animateEntrance?: boolean;
}) {
  if (message.type === "processing") {
    return (
      <div className={cn("flex gap-2 justify-start", animateEntrance && "ai-fade-in-up")}>
        <StatusAvatar status="executing" />
        <div className="px-3 py-1.5 rounded-2xl bg-background-950/90 border border-background-700">
          <LoadingLabel initialIndex={1} />
        </div>
      </div>
    );
  }

  if (message.type === "tool-call") {
    return (
      <div className={cn("flex gap-2 justify-start", animateEntrance && "ai-fade-in-up")}>
        <StatusAvatar status={message.toolCall.status} />
        <div className="min-w-0 flex-1">
          <ToolCallCard toolCall={message.toolCall} />
        </div>
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-2",
        animateEntrance && !isUser && "ai-fade-in-up",
        isUser ? "justify-end py-1" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-sm flex border border-background-700 items-center justify-center flex-shrink-0 bg-background-950/90">
          <LuBot className="w-5 h-5 text-foreground-300" />
        </div>
      )}
      <div className={cn("flex min-w-0 max-w-[85%] flex-col gap-1.5", isUser && "items-end")}>
        {message.attachment && <ScreenshotAttachment attachment={message.attachment} />}
        <div
          className={cn(
            "px-3 py-2 rounded-2xl text-sm text-foreground-200",
            isUser
              ? "rounded-br-md bg-background-900/90 border border-background-600/40"
              : "rounded-tl-md bg-background-950/90 border border-background-700",
          )}
        >
          <RevealedText key={message.id} text={message.content} animate={message.reveal ?? false} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Scripted transcript                            */
/* -------------------------------------------------------------------------- */

interface Exchange {
  userMessage: string;
  actionLabel: string;
  details: { operationIcon: IconType; message: string; source: string }[];
  reply: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "greeting",
    role: "assistant",
    type: "text",
    content:
      "UI Lab is connected. Share a screen or describe it, and I'll build it from your library.",
  },
  {
    id: "request",
    role: "user",
    type: "text",
    content: "Can you rebuild this billing card from my mockup?",
    attachment: { name: "billing-mockup.png", dimensions: "390 × 844" },
  },
  {
    id: "plan",
    role: "assistant",
    type: "text",
    content:
      "A plan header, price, three included features and an upgrade action. That maps to Card, Badge and Button, so it'll pick up your theme as is.",
  },
];

const EXCHANGES: Exchange[] = [
  {
    userMessage: "Go ahead and build it.",
    actionLabel: "Reading UI Lab",
    details: [
      { operationIcon: FaFileLines, message: "lab/SKILL.md", source: "Skill" },
      { operationIcon: FaMagnifyingGlass, message: "search_guides foundation", source: "MCP" },
      { operationIcon: FaList, message: "get_component card", source: "MCP" },
      { operationIcon: FaPencil, message: "billing-card.tsx", source: "Edit" },
    ],
    reply:
      "Done. billing-card.tsx uses Card, Badge and Button from their subpaths, with spacing and color from your theme tokens.",
  },
  {
    userMessage: "Make sure it holds up in light mode.",
    actionLabel: "Checking theme",
    details: [
      { operationIcon: FaMagnifyingGlass, message: "search_guides theming", source: "MCP" },
      { operationIcon: FaPencil, message: "billing-card.tsx", source: "Edit" },
    ],
    reply:
      "One border was hardcoded, so I moved it to a semantic token. Everything else already flips with the theme.",
  },
  {
    userMessage: "Run the checks.",
    actionLabel: "Running preflight",
    details: [
      { operationIcon: FaList, message: "scripts/preflight.sh", source: "Skill" },
      { operationIcon: FaCheck, message: "0 issues", source: "Skill" },
    ],
    reply: "Preflight is clean: no barrel imports, no raw colors, and every control has a label.",
  },
  {
    userMessage: "Open a PR.",
    actionLabel: "Opening pull request",
    details: [
      { operationIcon: FaCodeBranch, message: "billing-card → main", source: "Git" },
      { operationIcon: FaFileLines, message: "2 files, +64 −3", source: "Git" },
    ],
    reply: "PR #214 is up, with a screenshot of the card beside your mockup.",
  },
];

const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

function ChatInputArea({
  input,
  setInput,
  handleSendMessage,
  isLoading,
}: {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => setRecordingDuration((seconds) => seconds + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    setRecordingDuration(0);
    setIsRecording((recording) => !recording);
  };

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-end gap-1 rounded-2xl border border-background-700 bg-background-950 p-1">
      <Button variant="ghost" className="h-8 w-8 px-0 rounded-xl" aria-label="Add attachment">
        <FaPlus size={14} />
      </Button>

      <TextArea
        rows={1}
        size="sm"
        resize="none"
        maxHeight="7rem"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            handleSendMessage();
          }
        }}
        placeholder="Message"
        aria-label="Message"
        className="w-full"
        variant="ghost"
        styles={{
          scroll: "border-0 bg-transparent",
          field: "min-h-0 border-0 bg-transparent px-1 py-1.5",
        }}
      />

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          onPress={toggleRecording}
          aria-label={isRecording ? "Stop recording" : "Start voice recording"}
          className={cn(
            "h-8 rounded-xl",
            isRecording ? "animate-pulse bg-background-800 px-2.5 gap-1.5" : "w-8 px-0",
          )}
        >
          {isRecording ? (
            <>
              <div className="w-3 h-3 bg-background-500 rounded-sm" />
              <span className="text-foreground-300 text-xs tabular-nums">
                {formatDuration(recordingDuration)}
              </span>
            </>
          ) : (
            <FaMicrophone size={13} />
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onPress={handleSendMessage}
          aria-label="Send message"
          className="h-8 w-8 px-0 rounded-xl"
        >
          {isLoading ? (
            <div className="bg-background-500 w-2.5 h-2.5 rounded-sm" />
          ) : (
            <HiArrowUturnRight size={14} strokeWidth={1.1} />
          )}
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Panel                                    */
/* -------------------------------------------------------------------------- */

/** Beat between an answer landing and the next question appearing in the composer. */
const NEXT_QUESTION_MS = 900;
/** Distance from the bottom within which the transcript keeps following new content. */
const STICK_THRESHOLD_PX = 80;

/**
 * Appends a message, or replaces it in place when it is already there. React may
 * replay an updater, so every transcript update has to survive being applied twice.
 */
const upsertMessage = (messages: ChatMessage[], message: ChatMessage): ChatMessage[] =>
  messages.some((existing) => existing.id === message.id)
    ? messages.map((existing) => (existing.id === message.id ? message : existing))
    : [...messages, message];

export function AIComposer({ height }: ShowcasePanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  // The next question waits in the composer; nothing happens until send is pressed.
  const [input, setInput] = useState(EXCHANGES[0].userMessage);
  const [chatHeight, setChatHeight] = useState<number>();

  const chatRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const nextExchange = useRef(0);
  const stickToBottom = useRef(true);

  const lastMessage = messages[messages.length - 1];
  const lastMessageIsActiveLoader =
    lastMessage?.type === "processing" || lastMessage?.type === "tool-call";
  const showTailLoader = isLoading && messages.length > 0 && !lastMessageIsActiveLoader;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // The scroller needs a definite height to scroll rather than clip, and the
  // panel's own height is only known once it is laid out.
  useEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;

    const observer = new ResizeObserver(([entry]) => setChatHeight(entry.contentRect.height));
    observer.observe(chat);
    return () => observer.disconnect();
  }, []);

  const scrollToBottom = useCallback(() => {
    const viewport = viewportRef.current;
    if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, []);

  // Follow the transcript as it grows — a new message, a tool detail landing, or
  // an answer revealing itself character by character — unless the reader has
  // scrolled up to look at something.
  useEffect(() => {
    const viewport = viewportRef.current;
    const transcript = transcriptRef.current;
    if (!viewport || !transcript) return;

    const handleScroll = () => {
      const distance = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      stickToBottom.current = distance < STICK_THRESHOLD_PX;
    };

    const observer = new ResizeObserver(() => {
      if (stickToBottom.current) scrollToBottom();
    });

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    observer.observe(transcript);
    return () => {
      viewport.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [chatHeight, scrollToBottom]);

  useEffect(() => {
    if (stickToBottom.current) scrollToBottom();
  }, [messages, showTailLoader, scrollToBottom]);

  const later = useCallback((delay: number, run: () => void) => {
    timers.current.push(setTimeout(run, delay));
  }, []);

  /** Plays one agent turn: it works, reports each operation, then answers. */
  const runExchange = useCallback(
    (exchange: Exchange, userMessage: string, turn: number, onFinished: () => void) => {
      const toolId = `turn-${turn}-tool`;

      setIsLoading(true);
      setMessages((current) =>
        upsertMessage(current, {
          id: `turn-${turn}-user`,
          role: "user",
          type: "text",
          content: userMessage,
        }),
      );

      later(1200, () =>
        setMessages((current) =>
          upsertMessage(current, {
            id: toolId,
            role: "assistant",
            type: "tool-call",
            toolCall: {
              actionLabel: exchange.actionLabel,
              status: "executing",
              detailsHistory: [],
            },
          }),
        ),
      );

      exchange.details.forEach((detail, index) => {
        const detailId = `${toolId}-detail-${index}`;

        later(1900 + index * 700, () =>
          setMessages((current) =>
            current.map((message) => {
              if (message.id !== toolId || message.type !== "tool-call") return message;

              const { detailsHistory } = message.toolCall;
              if (detailsHistory.some((existing) => existing.id === detailId)) return message;

              return {
                ...message,
                toolCall: {
                  ...message.toolCall,
                  detailsHistory: [...detailsHistory, { id: detailId, ...detail }],
                },
              };
            }),
          ),
        );
      });

      const completedAt = 1900 + exchange.details.length * 700;

      later(completedAt, () =>
        setMessages((current) =>
          current.map((message) =>
            message.id === toolId && message.type === "tool-call"
              ? { ...message, toolCall: { ...message.toolCall, status: "completed" } }
              : message,
          ),
        ),
      );

      later(completedAt + 600, () => {
        setMessages((current) =>
          upsertMessage(current, {
            id: `turn-${turn}-reply`,
            role: "assistant",
            type: "text",
            content: exchange.reply,
            reveal: true,
          }),
        );
        setIsLoading(false);
        onFinished();
      });
    },
    [later],
  );

  const handleSendMessage = () => {
    const content = input.trim();
    if (!content || isLoading) return;

    const turn = nextExchange.current;
    const exchange = EXCHANGES[turn % EXCHANGES.length];
    nextExchange.current += 1;
    setInput("");

    runExchange(exchange, content, turn, () => {
      // Load the following question, unless something has been typed in the meantime.
      const question = EXCHANGES[nextExchange.current % EXCHANGES.length].userMessage;
      later(NEXT_QUESTION_MS, () => setInput((current) => (current === "" ? question : current)));
    });
  };

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-sm" style={{ height }}>
      <style>{keyframes}</style>

      <div ref={chatRef} className="min-h-0 flex-1">
        <Scroll
          viewport-ref={viewportRef}
          max-height={chatHeight ? `${chatHeight}px` : undefined}
          fade-y
          className="relative"
        >
          <div ref={transcriptRef} className="w-full px-3">
            <div className="flex flex-col space-y-3 py-4">
              {messages.map((message, index) => {
                const nextMessage = messages[index + 1];
                const shouldShowTimeline =
                  index !== messages.length - 1 && nextMessage && message.role === nextMessage.role;

                return (
                  <div
                    key={message.id}
                    className={cn(
                      shouldShowTimeline && "ai-message-with-timeline before:bg-foreground-200/50",
                    )}
                  >
                    <MessageBubble message={message} />
                  </div>
                );
              })}

              {showTailLoader && (
                <MessageBubble
                  message={{
                    id: "synthetic-processing",
                    role: "assistant",
                    type: "processing",
                  }}
                  animateEntrance={false}
                />
              )}
            </div>
          </div>
        </Scroll>
      </div>

      <div className="px-2 pb-2">
        <ChatInputArea
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
