# GoSPA vs SvelteKit Benchmark 🚀

A comparative study focused on the performance and payload sizes of **GoSPA** (a modern Go-based Single Page Application framework) and **SvelteKit**.

This repository contains two identical CRUD applications (a Todo list) implemented using both frameworks to measure network latency, response sizes, and time-to-interactivity across common operations.

## 📊 Overview

The benchmark evaluates the efficiency of each framework's server-side logic and client-side communication:
- **Initial Page Load**: Measuring the size (bytes) and time (ms) for the first byte and total page rendering.
- **CRUD Latency**: Average time taken for `Create`, `Toggle`, and `Delete` operations over 100 iterations.
- **Island Architecture performance**: How well partial hydration handles dynamic updates compared to traditional SPA approaches.

---

## 🛠️ Stack & Technologies

### GoSPA
- **Backend**: Go (Fiber, a-h/templ)
- **Frontend**: TypeScript
- **Database**: SQLite3
- **Styling**: Tailwind CSS v4

### SvelteKit
- **Backend**: Node.js (via Bun) + SvelteKit Server
- **Frontend**: Svelte 5 + TypeScript
- **Database**: SQLite3
- **Styling**: Tailwind CSS v4

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- **Bun** (for SvelteKit and benchmarking script)
- **Go 1.26+** (for GoSPA)
- **SQLite3**

### Installation
Clone the repository and install dependencies for both apps:

```bash
# SvelteKit dependencies
cd crud-app-comparison/sveltekit-app
bun install

# GoSPA dependencies
cd ../gospa-app
go mod download
bun install
```

---

## 🏎️ Running the Benchmark

### 1. Start the Development Servers
In separate terminals, start both applications:

**SvelteKit (Port 5173):**
```bash
cd crud-app-comparison/sveltekit-app
bun dev
```

**GoSPA (Port 3000):**
```bash
cd crud-app-comparison/gospa-app
go run main.go
```

### 2. Execute the Benchmark Script
Once both servers are running, run the following command from the root or `crud-app-comparison` directory:

```bash
cd crud-app-comparison
bun benchmark.ts
```

---

## 📈 Understanding the Results

The benchmark outputs metrics for both frameworks in the following format:
- **Initial Page Load**: Total time for the first GET request and payload size.
- **CRUD Operations**: Sequential execution of 100 create, toggle, and delete actions.
- **Averages**: Calculation of latency per operation to identify framework overhead.

GoSPA aims to provide a faster, more lightweight alternative for Go-centric applications by reducing the JavaScript payload and leveraging high-performance Go-to-JS bridges.

---

## 📂 Project Structure

```text
.
├── crud-app-comparison/
│   ├── benchmark.ts       # The benchmarking script
│   ├── gospa-app/         # Go-based implementation
│   ├── sveltekit-app/     # SvelteKit-based implementation
│   └── generated/         # Shared/Generated types and routes
```

---

## ⚖️ License
[MIT](LICENSE) (or as per project configuration)
