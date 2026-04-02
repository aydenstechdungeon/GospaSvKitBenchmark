import { db, type Todo } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load = () => {
    const todos = db.query("SELECT * FROM todos ORDER BY id DESC").all() as Todo[];
    return {
        todos: todos.map(t => ({ ...t, completed: Boolean(t.completed) }))
    };
};

export const actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const text = data.get('text');

        if (!text || typeof text !== 'string') {
            return fail(400, { text, error: 'Text is required' });
        }

        db.query("INSERT INTO todos (text) VALUES (?)").run(text);
        return { success: true };
    },
    toggle: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));

        if (!id) return fail(400, { error: 'Missing id' });

        const todo = db.query("SELECT completed FROM todos WHERE id = ?").get(id) as { completed: number } | undefined;
        if (!todo) return fail(404, { error: 'Not found' });

        db.query("UPDATE todos SET completed = ? WHERE id = ?").run(todo.completed ? 0 : 1, id);
        return { success: true };
    },
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));

        if (!id) return fail(400, { error: 'Missing id' });

        db.query("DELETE FROM todos WHERE id = ?").run(id);
        return { success: true };
    }
};
