const GOSPA_URL = "http://localhost:3000";
const SVELTEKIT_URL = "http://localhost:5173";
const COUNT = 100;

async function measure(name: string, url: string, options: RequestInit = {}) {
    const start = performance.now();
    const res = await fetch(url, options);
    const body = await res.arrayBuffer();
    const end = performance.now();

    return {
        name,
        duration: end - start,
        size: body.byteLength,
        status: res.status,
    };
}

// GoSPA CRUD
const gospa = {
    get: () => measure("Index (GoSPA)", GOSPA_URL),
    create: (text: string) => fetch(`${GOSPA_URL}/_gospa/remote/createTodo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(text)
    }),
    getAll: () => fetch(`${GOSPA_URL}/_gospa/remote/getTodos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    }).then(r => r.json()).then(j => (j as any).data),
    toggle: (id: number) => fetch(`${GOSPA_URL}/_gospa/remote/toggleTodo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id)
    }),
    delete: (id: number) => fetch(`${GOSPA_URL}/_gospa/remote/deleteTodo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id)
    }),
};

// SvelteKit CRUD
const sk = {
    get: () => measure("Index (SvelteKit)", SVELTEKIT_URL),
    create: (text: string) => fetch(`${SVELTEKIT_URL}/?/create`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `text=${encodeURIComponent(text)}`
    }),
    getAll: () => fetch(`${SVELTEKIT_URL}/`).then(r => r.text()),
    toggle: (id: number) => fetch(`${SVELTEKIT_URL}/?/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${id}`
    }),
    delete: (id: number) => fetch(`${SVELTEKIT_URL}/?/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${id}`
    }),
};

async function benchmarkFramework(name: string, f: typeof gospa | typeof sk) {
    console.log(`\nTesting ${name}...`);

    // 1. Initial Page Load
    const initial = await f.get();
    console.log(`- Initial Page Load: ${initial.duration.toFixed(2)}ms (${initial.size} bytes)`);

    // 2. Create COUNT items
    const startCreate = performance.now();
    for (let i = 0; i < COUNT; i++) {
        await f.create(`Benchmark Todo ${i}`);
    }
    const endCreate = performance.now();
    console.log(`- Create ${COUNT} Items: ${(endCreate - startCreate).toFixed(2)}ms (${((endCreate - startCreate) / COUNT).toFixed(2)}ms avg)`);

    // 3. Get All (optional/not precise for SK)
    let ids: number[] = [];
    if (name === "GoSPA") {
        try {
            const todos = await gospa.getAll();
            ids = todos.slice(0, COUNT).map((t: any) => t.id);
        } catch (e) {
            console.warn("Could not get IDs for GoSPA:", (e as any).message);
        }
    }

    // 4. Toggle
    if (ids.length > 0) {
        const startToggle = performance.now();
        for (const id of ids) {
            await f.toggle(id);
        }
        const endToggle = performance.now();
        console.log(`- Toggle ${ids.length} Items: ${(endToggle - startToggle).toFixed(2)}ms (${((endToggle - startToggle) / ids.length).toFixed(2)}ms avg)`);
    }

    // 5. Delete
    if (ids.length > 0) {
        const startDelete = performance.now();
        for (const id of ids) {
            await f.delete(id);
        }
        const endDelete = performance.now();
        console.log(`- Delete ${ids.length} Items: ${(endDelete - startDelete).toFixed(2)}ms (${((endDelete - startDelete) / ids.length).toFixed(2)}ms avg)`);
    }
}

async function runBenchmark() {
    console.log("🚀 Starting CRUD Benchmark (COUNT=" + COUNT + ")");

    try {
        await benchmarkFramework("GoSPA", gospa);
    } catch (e) {
        console.error("GoSPA benchmark failed:", (e as any).message);
    }

    try {
        await benchmarkFramework("SvelteKit", sk);
    } catch (e) {
        console.error("SvelteKit benchmark failed:", (e as any).message);
    }

    console.log("\nBenchmark Complete!");
}

runBenchmark();
