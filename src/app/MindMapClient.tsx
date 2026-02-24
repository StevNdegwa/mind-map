"use client";

import { useCallback, useEffect, useState } from "react";
import { db, type Lesson } from "@/lib/db";
import { Header } from "@/components/Header";
import { LessonPicker } from "@/components/LessonPicker";
import { LessonView } from "@/components/LessonView";
import styles from "./page.module.css";

export function MindMapClient() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const loadLessons = useCallback(async () => {
    const list = await db.lessons.orderBy("updatedAt").reverse().toArray();
    setLessons(list);
  }, []);

  useEffect(() => {
    loadLessons().finally(() => setLoading(false));
  }, [loadLessons]);

  const handleBack = useCallback(() => {
    setSelected(null);
  }, []);

  const handleSelectLesson = useCallback(async (lesson: Lesson) => {
    const latest = await db.lessons.get(lesson.id);
    setSelected(latest ?? lesson);
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <Header lessonName={null} showBack={false} />
        <main className={styles.main}>
          <p className={styles.loading}>Loading…</p>
        </main>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className={styles.page}>
        <Header lessonName={null} showBack={false} />
        <main className={styles.main}>
          <LessonPicker
            lessons={lessons}
            onSelect={handleSelectLesson}
            onRefresh={loadLessons}
          />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header
        lessonName={selected.name}
        showBack
        onBack={handleBack}
      />
      <main className={styles.main}>
        <LessonView lesson={selected} />
      </main>
    </div>
  );
}
