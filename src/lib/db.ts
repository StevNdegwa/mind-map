import Dexie, { type EntityTable } from "dexie";

export interface Lesson {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  /** Excalidraw scene JSON (elements + appState + files) */
  sceneData?: string | null;
}

export class MindMapDb extends Dexie {
  lessons!: EntityTable<Lesson, "id">;

  constructor() {
    super("MindMapDb");
    this.version(1).stores({
      lessons: "id, createdAt, updatedAt",
    });
  }
}

export const db = new MindMapDb();
