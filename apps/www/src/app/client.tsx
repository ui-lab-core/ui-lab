'use client';

import { useCallback, useEffect } from "react";
import { ChatProvider, useChat } from "@/features/chat/context/chat-context";
import { themes } from "@/features/theme/constants/themes";
import { useThemeStorage } from "@/features/theme/hooks/use-theme-storage";
import { AppProvider, useApp } from "@/features/theme/lib/app-context";
// import { PERF_OVERLAY_TOGGLE_EVENT, PerfOverlay } from "@/features/dev/components/perf-overlay";

function KeyboardShortcuts() {
  const { toggleChat } = useChat();
  const { isSettingsPanelOpen, setIsSettingsPanelOpen, currentThemeMode, currentThemeColors, setCurrentThemeMode, setCurrentThemeColors, setIsCommandPaletteOpen } = useApp();
  const { applyAndPersistModeAndColors } = useThemeStorage({
    onColorsChange: setCurrentThemeColors,
    onModeChange: setCurrentThemeMode,
    currentThemeMode,
  });

  const toggleThemeMode = useCallback(() => {
    const nextMode = currentThemeMode === "light" ? "dark" : "light";
    const colors = currentThemeColors || themes["Vitesse"][nextMode];
    const startTransition = () => {
      document.documentElement.classList.add("theme-transition");
      setCurrentThemeMode(nextMode);
      setCurrentThemeColors(colors);
      applyAndPersistModeAndColors(nextMode, colors);
      setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 300);
    };

    if (document.startViewTransition && typeof document.startViewTransition === "function") {
      document.startViewTransition(startTransition);
      return;
    }

    startTransition();
  }, [
    applyAndPersistModeAndColors,
    currentThemeColors,
    currentThemeMode,
    setCurrentThemeColors,
    setCurrentThemeMode,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      if (e.ctrlKey && e.key === "i") {
        e.preventDefault();
        toggleChat();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        return;
      }

      // if (e.ctrlKey && (e.key === "d" || e.key === "D")) {
      //   e.preventDefault();
      //   window.dispatchEvent(new Event(PERF_OVERLAY_TOGGLE_EVENT));
      //   return;
      // }

      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === "d" || e.key === "D") {
          toggleThemeMode();
          return;
        }
        if (e.key === "t" || e.key === "T") {
          setIsSettingsPanelOpen(!isSettingsPanelOpen);
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isSettingsPanelOpen,
    setIsCommandPaletteOpen,
    setIsSettingsPanelOpen,
    toggleChat,
    toggleThemeMode,
  ]);

  return null;
}

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ChatProvider>
        <KeyboardShortcuts />
        {/* <PerfOverlay /> */}
        {children}
      </ChatProvider>
    </AppProvider>
  );
}
