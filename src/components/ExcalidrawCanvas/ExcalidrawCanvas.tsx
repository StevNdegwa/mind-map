"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { db } from "@/lib/db";
import { serializeAsJSON } from "@excalidraw/excalidraw";
import styles from "./ExcalidrawCanvas.module.css";

import "@excalidraw/excalidraw/index.css";
import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";


const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw");
    return mod.Excalidraw;
  },
  { ssr: false, loading: () => <div className={styles.loading}>Loading canvas…</div> }
);

interface ExcalidrawCanvasProps {
  lessonId: string;
  initialSceneData: string | null | undefined;
}

function parseSceneData(raw: string | null | undefined): {
  elements: readonly unknown[];
  appState: Record<string, unknown>;
} | null {
  if (!raw || typeof raw !== "string") return null;
  try {
    const data = JSON.parse(raw) as { elements?: unknown[]; appState?: Record<string, unknown> };
    if (!data || typeof data !== "object") return null;
    return {
      elements: Array.isArray(data.elements) ? data.elements : [],
      appState:
        data.appState && typeof data.appState === "object" ? data.appState : {},
    };
  } catch {
    return null;
  }
}

const SAVE_DEBOUNCE_MS = 800;

export function ExcalidrawCanvas({
  lessonId,
  initialSceneData,
}: ExcalidrawCanvasProps) {
  const { theme } = useTheme();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    },
    []
  );

  const initialData = useMemo(() => {
    const parsed = parseSceneData(initialSceneData);
    if (!parsed) return null;
    return {
      elements: parsed.elements,
      appState: parsed.appState,
      scrollToContent: true,
    };
  }, [initialSceneData]);

  const saveScene = useCallback(
    (
      elements: Parameters<typeof serializeAsJSON>[0],
      appState: Parameters<typeof serializeAsJSON>[1],
      files: Parameters<typeof serializeAsJSON>[2]
    ) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveTimeoutRef.current = null;
        const json = serializeAsJSON(elements, appState, files, "database");
        db.lessons.update(lessonId, {
          sceneData: json,
          updatedAt: Date.now(),
        });
      }, SAVE_DEBOUNCE_MS);
    },
    [lessonId]
  );

  const onChange = useCallback(
    (
      elements: Parameters<typeof serializeAsJSON>[0],
      appState: Parameters<typeof serializeAsJSON>[1],
      files: Parameters<typeof serializeAsJSON>[2]
    ) => {
      saveScene(elements, appState, files);
    },
    [saveScene]
  );

  return (
    <div className={styles.root}>
      <Excalidraw
        initialData={initialData ? () => Promise.resolve(initialData as ExcalidrawInitialDataState) : undefined}
        onChange={onChange}
        theme={theme}
        UIOptions={{
          canvasActions: {
            toggleTheme: false,
            loadScene: false,
            saveToActiveFile: false,
            export: false,
            saveAsImage: true,
          },
        }}
      />
    </div>
  );
}
