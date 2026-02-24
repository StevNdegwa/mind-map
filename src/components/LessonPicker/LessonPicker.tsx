"use client";

import { useCallback, useState } from "react";
import { db, type Lesson } from "@/lib/db";
import styles from "./LessonPicker.module.css";

interface LessonPickerProps {
  lessons: Lesson[];
  onSelect: (lesson: Lesson) => void;
  onRefresh: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function LessonPicker({
  lessons,
  onSelect,
  onRefresh,
}: LessonPickerProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = name.trim();
      if (!trimmed) {
        setError("Enter a lesson name");
        return;
      }
      setError(null);
      setSubmitting(true);
      try {
        const now = Date.now();
        const lesson: Lesson = {
          id: generateId(),
          name: trimmed,
          createdAt: now,
          updatedAt: now,
        };
        await db.lessons.add(lesson);
        setName("");
        onRefresh();
        onSelect(lesson);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create lesson");
      } finally {
        setSubmitting(false);
      }
    },
    [name, onRefresh, onSelect]
  );

  return (
    <div className={styles.root}>
      <h2 className={styles.heading}>Select or create a lesson</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder="New lesson name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          aria-invalid={!!error}
          aria-describedby={error ? "new-lesson-error" : undefined}
        />
        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={submitting}
        >
          Add
        </button>
      </form>
      {error && (
        <p id="new-lesson-error" className={styles.error} role="alert">
          {error}
        </p>
      )}
      {lessons.length === 0 ? (
        <p className={styles.empty}>
          No lessons yet. Create one above to get started.
        </p>
      ) : (
        <ul className={styles.list}>
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <button
                type="button"
                className={styles.item}
                onClick={() => onSelect(lesson)}
              >
                {lesson.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
