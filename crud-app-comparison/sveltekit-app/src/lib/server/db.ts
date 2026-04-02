import { Database } from "bun:sqlite";

export const db = new Database("todos.sqlite", { create: true });

export interface Todo {
    id: number;
    text: string;
    completed: number; // SQLite boolean
}

// Initialize tables if they don't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0
    )
`);
