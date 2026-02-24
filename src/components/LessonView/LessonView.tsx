"use client";

import dynamic from "next/dynamic";
import type { Lesson } from "@/lib/db";
import styles from "./LessonView.module.css";

const ExcalidrawCanvas = dynamic(
  () =>
    import("@/components/ExcalidrawCanvas").then((mod) => mod.ExcalidrawCanvas),
  { ssr: false, loading: () => <div className={styles.loading}>Loading canvas…</div> }
);

interface LessonViewProps {
  lesson: Lesson;
}

export function LessonView({ lesson }: LessonViewProps) {
  return (
    <div className={styles.root}>
      <ExcalidrawCanvas
        lessonId={lesson.id}
        initialSceneData={lesson.sceneData}
      />
    </div>
  );
}
