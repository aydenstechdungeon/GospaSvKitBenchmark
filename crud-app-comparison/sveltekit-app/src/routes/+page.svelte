<script lang="ts">
    import type { PageData } from "./$types";
    import { enhance } from "$app/forms";

    let { data } = $props<{ data: PageData }>();

    // Optimistic UI state
    let optimistics = $state<Set<number>>(new Set());
    let pendingCreate = $state(false);
</script>

<div class="min-h-screen flex items-center justify-center p-4 sm:p-8">
    <main
        class="w-full max-w-lg max-h-[50vh] bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100 flex flex-col"
    >
        <header
            class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shrink-0"
        >
            <h1 class="text-2xl font-bold tracking-tight">SvelteKit Todos</h1>
            <p class="text-blue-100 text-sm mt-1 opacity-90">
                Lightning fast CRUD
            </p>
        </header>

        <div class="p-6 flex flex-col min-h-0">
            <form
                method="POST"
                action="?/create"
                class="flex gap-2 mb-6 shrink-0"
                use:enhance={() => {
                    pendingCreate = true;
                    return async ({ update }) => {
                        await update();
                        pendingCreate = false;
                    };
                }}
            >
                <input
                    name="text"
                    type="text"
                    placeholder="What needs to be done?"
                    required
                    autocomplete="off"
                    disabled={pendingCreate}
                    class="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={pendingCreate}
                    class="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95 disabled:opacity-50"
                >
                    Add
                </button>
            </form>

            <ul
                class="space-y-2 overflow-y-auto pr-2 custom-scrollbar"
                style="max-height: 400px;"
            >
                {#if data.todos.length === 0 && !pendingCreate}
                    <li class="text-center py-8 text-slate-400 italic">
                        No tasks yet. Add one above!
                    </li>
                {/if}

                {#each data.todos as todo (todo.id)}
                    {@const isOptimistic = optimistics.has(todo.id)}
                    <li
                        class="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-slate-50 transition-all {isOptimistic
                            ? 'opacity-50'
                            : ''}"
                    >
                        <div class="flex items-center gap-3 overflow-hidden">
                            <form
                                method="POST"
                                action="?/toggle"
                                use:enhance={() => {
                                    optimistics.add(todo.id);
                                    todo.completed = !todo.completed; // Optimistic update
                                    return async ({ update }) => {
                                        await update({ reset: false });
                                        optimistics.delete(todo.id);
                                    };
                                }}
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={todo.id}
                                />
                                <button
                                    type="submit"
                                    class="shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 focus:outline-none transition-colors {todo.completed
                                        ? 'bg-blue-500 border-blue-500'
                                        : 'border-slate-300 hover:border-blue-400'}"
                                >
                                    {#if todo.completed}
                                        <svg
                                            class="w-4 h-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            stroke-width="3"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    {/if}
                                </button>
                            </form>

                            <span
                                class="truncate transition-all {todo.completed
                                    ? 'text-slate-400 line-through'
                                    : 'text-slate-700 font-medium'}"
                            >
                                {todo.text}
                            </span>
                        </div>

                        <form
                            method="POST"
                            action="?/delete"
                            use:enhance={() => {
                                optimistics.add(todo.id);
                                return async ({ update }) => {
                                    await update();
                                    optimistics.delete(todo.id);
                                };
                            }}
                        >
                            <input type="hidden" name="id" value={todo.id} />
                            <button
                                type="submit"
                                class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                            >
                                <svg
                                    class="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        </form>
                    </li>
                {/each}
            </ul>
        </div>
    </main>
</div>
