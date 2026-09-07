"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Scroll } from "ui-lab-components";
import {
  FaCheck,
  FaChevronDown,
  FaCodeBranch,
  FaFileLines,
  FaList,
  FaMagnifyingGlass,
  FaMicrophone,
  FaPencil,
  FaPlus,
  FaUser,
  FaWandMagicSparkles,
} from "@/shared/icons/fa6";
import { HiArrowUturnRight } from "@/shared/icons/hi2";
import { cn } from "@/shared/lib/utils";
import type { ShowcasePanelProps } from "../types";

type IconType = React.ComponentType<{ className?: string }>;

type ToolStatus = "executing" | "completed";

interface ToolDetail {
  id: string;
  operationIcon: IconType;
  message: string;
}

interface ToolCall {
  actionLabel: string;
  status: ToolStatus;
  detailsHistory: ToolDetail[];
}

type ChatMessage =
  | { id: string; role: "user" | "assistant"; type: "text"; content: string; reveal?: boolean }
  | { id: string; role: "assistant"; type: "tool-call"; toolCall: ToolCall }
  | { id: string; role: "assistant"; type: "processing" };

/* -------------------------------------------------------------------------- */
/*                              Animation styles                              */
/* -------------------------------------------------------------------------- */

/** Ported from the app's theme.css / components.css so the panel needs no global CSS. */
const keyframes = `
@keyframes ai-fade-in-up {
  from { opacity: 0; transform: translateY(8px); }
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
.ai-fade-in-up { animation: ai-fade-in-up 0.4s ease-out both; }
.ai-message-with-timeline { position: relative; }
.ai-message-with-timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 50px;
  height: calc(100% - 34px);
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

const getStatusMessage = (status: ToolStatus, actionLabel: string) =>
  status === "completed" ? "Completed" : `${actionLabel}...`;

const getStatusIcon = (status: ToolStatus) =>
  status === "completed" ? <FaCheck className="w-4 h-4" /> : <FanLoader size={16} duration={1} />;

const getStatusColor = (status: ToolStatus) =>
  status === "completed"
    ? "text-success-600 bg-success-500/10"
    : "text-background-400 bg-background-600/20";

function ToolCallCard({
  toolCall,
  showChevron = true,
}: {
  toolCall: ToolCall;
  showChevron?: boolean;
}) {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const { actionLabel, status, detailsHistory } = toolCall;
  const statusMessage = getStatusMessage(status, actionLabel);
  const mostRecentDetail =
    detailsHistory.length > 0 ? detailsHistory[detailsHistory.length - 1] : null;

  return (
    <div className="w-full">
      <div className="relative min-w-[16rem] flex items-center overflow-hidden p-3 pl-4 h-fit gap-3 rounded-[1.3rem] border bg-background-950/90 border-background-700">
        <div className="flex-1">
          <div className="font-medium text-sm text-foreground-100">{actionLabel}</div>
          <p className="text-sm font-semibold text-foreground-200">{statusMessage}</p>
        </div>
      </div>

      {detailsHistory.length > 0 && (
        <div className="flex mt-1 ml-2 mr-7">
          <div className="py-1 overflow-x-hidden min-w-[18rem] relative flex flex-col-reverse pr-1 bg-background-950/90 border border-background-700 rounded-xl px-2 border-r-0 rounded-r-none">
            {(isDetailsExpanded ? detailsHistory : [mostRecentDetail]).map((detail) => {
              if (!detail) return null;
              const IconComponent = detail.operationIcon;
              return (
                <div
                  key={detail.id}
                  className="ai-fade-in-up text-sm flex items-center gap-2 text-foreground-200 my-1 last:pb-0 border-background-700 last:border-0"
                >
                  <div className="bg-background-900/90 aspect-square text-background-300 border border-background-700 flex items-center justify-center w-7 h-7 rounded-lg">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <p className="mt-1 whitespace-nowrap text-sm font-medium">{detail.message}</p>
                </div>
              );
            })}
          </div>
          <div className="p-2 bg-background-950/90 border border-background-700 rounded-xl rounded-l-none border-l-0">
            {showChevron && (
              <button
                type="button"
                aria-expanded={isDetailsExpanded}
                aria-label={isDetailsExpanded ? "Hide tool details" : "Show tool details"}
                className="z-10 p-2 rounded-lg cursor-pointer top-2 right-2 flex items-center gap-2 text-sm text-foreground-300 hover:text-foreground-100 transition-colors hover:bg-background-700/50"
                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              >
                <FaChevronDown
                  className={cn("w-3 h-3 transition-transform", isDetailsExpanded && "rotate-180")}
                />
              </button>
            )}
          </div>
        </div>
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

  return (
    <p className="font-medium mb-3 last:mb-0 leading-relaxed">{text.slice(0, visibleCount)}</p>
  );
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
    <p className="text-sm font-semibold text-foreground-200" aria-live="polite">
      {LOADING_LABELS[index]}
    </p>
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
        <div className="w-12 h-12 p-0.5 bg-background-950/90 rounded-2xl flex border border-background-700 flex-shrink-0">
          <div
            className={cn(
              "h-full w-full flex items-center justify-center rounded-xl",
              getStatusColor("executing"),
            )}
          >
            {getStatusIcon("executing")}
          </div>
        </div>
        <div className="p-3 pr-4 h-fit rounded-[1.3rem] bg-background-950/90 border border-background-700">
          <div className="flex items-center gap-2">
            <LoadingLabel initialIndex={1} />
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "tool-call") {
    const hasMultipleTasks = message.toolCall.detailsHistory.length > 1;
    return (
      <div className={cn("flex gap-2 justify-start", animateEntrance && "ai-fade-in-up")}>
        <div className="w-12 h-12 p-0.5 bg-background-950/90 rounded-2xl flex border border-background-700 flex-shrink-0">
          <div
            className={cn(
              "h-full w-full flex items-center justify-center rounded-xl",
              getStatusColor(message.toolCall.status),
            )}
          >
            {getStatusIcon(message.toolCall.status)}
          </div>
        </div>
        <div className="max-w-100">
          <ToolCallCard toolCall={message.toolCall} showChevron={hasMultipleTasks} />
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
        isUser ? "justify-end my-10" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="w-12 h-12 rounded-2xl flex border border-background-700 items-center justify-center flex-shrink-0 bg-background-950/90">
          <FaWandMagicSparkles className="w-5 h-5 text-foreground-200" />
        </div>
      )}
      <div className="flex flex-col gap-2 max-w-100">
        <div
          className={cn(
            "px-4 py-3 rounded-[1.3rem] min-h-11",
            isUser
              ? "bg-background-900/90 border border-background-600/40"
              : "bg-background-950/90 border border-background-700",
          )}
        >
          <div className="text-sm text-foreground-200 min-h-5">
            <RevealedText
              key={message.id}
              text={message.content}
              animate={message.reveal ?? false}
            />
          </div>
        </div>
      </div>
      {isUser && (
        <div className="w-12 h-12 rounded-2xl flex border border-background-600/40 items-center justify-center flex-shrink-0 bg-background-900/90">
          <FaUser className="w-4 h-4 text-foreground-300" />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Scripted transcript                            */
/* -------------------------------------------------------------------------- */

interface Exchange {
  userMessage: string;
  actionLabel: string;
  details: { operationIcon: IconType; message: string }[];
  reply: string;
}

const GREETING = "I'm watching this repo. Tell me what should change and I'll take it from there.";

const EXCHANGES: Exchange[] = [
  {
    userMessage: "Keep my place in the collection when I return from an item.",
    actionLabel: "Checking routes",
    details: [
      { operationIcon: FaFileLines, message: "collection/[slug]/page.tsx" },
      { operationIcon: FaMagnifyingGlass, message: "use-collection-filters.ts" },
    ],
    reply:
      "The collection was resetting on every visit. It now restores your filters and scroll position, so opening an item won't interrupt browsing.",
  },
  {
    userMessage: "Ship it behind a flag as well.",
    actionLabel: "Planning work",
    details: [
      { operationIcon: FaList, message: "Persist the query in the URL" },
      { operationIcon: FaPencil, message: "Restore focus on the last card" },
    ],
    reply: "Both steps are staged on the same branch — say the word and I'll open the PR.",
  },
  {
    userMessage: "Run the checks first.",
    actionLabel: "Running checks",
    details: [
      { operationIcon: FaCodeBranch, message: "branch: keep-collection-state" },
      { operationIcon: FaCheck, message: "12 tests passed" },
    ],
    reply: "Clean run. The collection keeps your place across every entry point now.",
  },
];

const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

/** Single-line height of the field: one `leading-6` line plus its `py-1`. */
const INPUT_LINE_HEIGHT = 32;
const INPUT_MAX_HEIGHT = 440;

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // The field grows with its content once a line can no longer hold it.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = `${INPUT_LINE_HEIGHT}px`;
    if (textarea.scrollHeight > INPUT_LINE_HEIGHT) {
      textarea.style.height = `${Math.min(textarea.scrollHeight, INPUT_MAX_HEIGHT)}px`;
    }
  }, [input]);

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
    <div className="relative flex-shrink-0 space-y-2">
      <div className="relative grid grid-cols-[auto_1fr_auto] border-background-700 bg-background-950 p-1.5 w-full rounded-3xl flex-col border">
        <div className="flex items-end">
          <Button variant="ghost" className="px-3 rounded-3xl" aria-label="Add attachment">
            <FaPlus size={18} />
          </Button>
        </div>

        <div className="flex items-center relative w-full">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask me anything or request AI assistance..."
            aria-label="Message"
            className="block w-full px-2 py-1 leading-6 font-medium bg-transparent resize-none focus:outline-none text-foreground-100 placeholder:text-background-500"
          />
        </div>

        <div className="flex items-end">
          <div>
            <Button
              type="button"
              variant="ghost"
              onPress={toggleRecording}
              aria-label={isRecording ? "Stop recording" : "Start voice recording"}
              className={cn(
                "relative transition-all overflow-hidden rounded-3xl",
                isRecording
                  ? "animate-pulse bg-background-800 hover:bg-background-800/60 border-background-700 px-4 gap-2"
                  : "w-auto",
              )}
            >
              {isRecording ? (
                <>
                  <div className="w-4 h-4 bg-background-300 rounded-md transition-all duration-300" />
                  <span className="text-foreground-300 font-medium text-sm whitespace-nowrap">
                    {formatDuration(recordingDuration)}
                  </span>
                </>
              ) : (
                <FaMicrophone size={16} className="transition-colors" />
              )}
            </Button>
          </div>
          <Button
            type="button"
            variant="secondary"
            onPress={handleSendMessage}
            aria-label="Send message"
            className="bg-background-700 hover:bg-background-600/80 border border-background-600/50 w-12 px-2 rounded-3xl ml-2"
          >
            {isLoading ? (
              <div className="bg-background-400 w-3.5 h-3.5 rounded-sm" />
            ) : (
              <HiArrowUturnRight size={16} strokeWidth={1.1} />
            )}
          </Button>
        </div>
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "greeting", role: "assistant", type: "text", content: GREETING },
  ]);
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

      later(1400, () =>
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

        later(2200 + index * 900, () =>
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

      const completedAt = 2200 + exchange.details.length * 900;

      later(completedAt, () =>
        setMessages((current) =>
          current.map((message) =>
            message.id === toolId && message.type === "tool-call"
              ? { ...message, toolCall: { ...message.toolCall, status: "completed" } }
              : message,
          ),
        ),
      );

      later(completedAt + 700, () => {
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
          viewportRef={viewportRef}
          maxHeight={chatHeight ? `${chatHeight}px` : undefined}
          className="relative"
        >
          <div ref={transcriptRef} className="w-full px-4">
            <div className="flex flex-col space-y-4 max-w-4xl pt-6 pb-6 justify-start">
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

      <div className="px-3 pb-3">
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
