# TaskFlow — Offline-First Task Manager

> A React Native task manager built around an offline-first experience: manage tasks locally, keep working without internet, and synchronize pending changes when connectivity returns.

**Status:** In development  
**Platform:** iOS and Android  
**Language:** TypeScript  
**Project type:** Portfolio project

---

## Overview

TaskFlow is a mobile task management app designed to demonstrate practical React Native engineering beyond basic CRUD screens. The local database is the primary source for the UI, so users can create, edit, complete, delete, search, and filter tasks while offline. Changes that need to reach the server are tracked and synchronized when a remote API is available.

The project emphasizes:

- Offline-first task management
- Persistent local storage
- Explicit synchronization and retry behavior
- Clear loading, empty, offline, and error states
- Separation of UI, business logic, persistence, and remote API code
- Testable design and documented engineering trade-offs

> **Implementation note:** Update this README as features are implemented. Do not claim a feature is complete until it has been built and tested. If the remote service is mocked or has limitations, describe that clearly in the “Known Limitations” section.

## Features

### Core task management

- [ ] Create a task with a required title
- [ ] Add an optional description, priority, and due date
- [ ] View task details
- [ ] Edit task information
- [ ] Mark tasks complete or incomplete
- [ ] Delete tasks with confirmation
- [ ] Persist tasks across app restarts

### Search and organization

- [ ] Search by title and description
- [ ] Filter by completion status
- [ ] Filter by priority
- [ ] Sort by creation date, due date, and priority
- [ ] Display helpful empty and no-results states

### Offline-first behavior

- [ ] Perform core task operations without a network connection
- [ ] Display online/offline status
- [ ] Store pending synchronization work
- [ ] Sync pending changes when connectivity returns
- [ ] Retry transient failures safely
- [ ] Preserve offline deletions until the server acknowledges them
- [ ] Recover interrupted sync operations after app restart
- [ ] Handle local/remote conflicts using a documented policy

### Quality and portfolio

- [ ] Unit tests for task logic and validation
- [ ] Tests for persistence and synchronization behavior
- [ ] Accessible labels and usable touch targets
- [ ] Architecture and sync-flow documentation
- [ ] Screenshots or demo recording

---

## Screens and app flow

The intended core flow is:

1. **Task List** — view saved tasks and current sync/connectivity status.
2. **Create Task** — enter a title and optional task details.
3. **Task Details** — review task information and choose an action.
4. **Edit Task** — update existing task information.
5. **Search, Filter, and Sort** — find tasks without modifying stored task data.
6. **Offline Mode** — continue working from local data and queue pending changes.
7. **Synchronization** — send pending changes to the remote API and display the outcome.
8. **Error States** — show validation, storage, and network errors without losing local work.

Onboarding, calendar, analytics, and settings screens are optional extensions and are not required for the first MVP unless they are explicitly implemented.

## Technology stack

The intended stack is:

| Area | Technology |
|---|---|
| Mobile framework | React Native with Expo |
| Language | TypeScript |
| Navigation | Expo Router or React Navigation |
| Local database | SQLite using Expo SQLite |
| Networking | Fetch API or a small HTTP client wrapper |
| Connectivity | NetInfo or an Expo-compatible network API |
| State management | React Context or a lightweight store |
| Testing | Jest and React Native Testing Library, configured for the chosen Expo/RN version |
| Code quality | ESLint and Prettier |
| Version control | Git and GitHub |

This is the proposed stack. Keep this table aligned with the dependencies actually installed in the repository.

---

## Architecture

TaskFlow uses a layered approach to keep UI code separate from task rules and storage concerns.

```text
Screens and Components
         |
         v
Task Use Cases / Domain Logic
         |
         +----------------------+
         |                      |
         v                      v
Local Repository          Remote Repository
(SQLite)                  (HTTP API)
         |                      ^
         v                      |
Local Task Data           Sync Service
                                |
                                v
                         Pending Sync Queue
```

### Local-first write flow

1. The user creates, edits, completes, or deletes a task.
2. The app commits the task change to the local database.
3. The associated pending sync operation is recorded in the same database transaction where possible.
4. The UI reflects local data without waiting for a network response.
5. When the API is reachable, the sync service processes pending operations.
6. On success, the app records the result and updates sync status. On failure, recoverable work remains queued for retry.

### Important synchronization decisions

- **Local write first:** network failure must not undo a successfully saved local action.
- **Idempotency:** operations should use stable IDs or idempotency keys to avoid duplicate effects during retries.
- **Bounded retry:** retry transient errors with backoff; do not retry permanent validation errors indefinitely.
- **Deletion tombstones:** retain deletion intent until the remote deletion is acknowledged.
- **Conflict resolution:** document and test a deterministic policy. For the MVP, last-write-wins can be used with version/timestamp metadata, while noting the limitations of client clocks.
- **Connectivity vs. reachability:** a device can be online while the API is unavailable; handle these states separately.

## Data model

### Task

| Field | Description |
|---|---|
| `id` | Unique ID generated on the device |
| `title` | Required, trimmed, non-empty string |
| `description` | Optional text |
| `priority` | `low`, `medium`, or `high` |
| `isCompleted` | Completion state |
| `dueDate` | Optional ISO date/time |
| `createdAt` | Creation timestamp |
| `updatedAt` | Last local update timestamp |
| `syncStatus` | `synced`, `pending`, or `failed` |
| `deletedAt` | Optional deletion tombstone timestamp |

### Pending sync operation

| Field | Description |
|---|---|
| `operationId` | Stable unique operation ID |
| `taskId` | Related task ID |
| `operationType` | `create`, `update`, or `delete` |
| `payload` | Data required to execute the operation |
| `createdAt` | Queue ordering timestamp |
| `retryCount` | Number of failed attempts |
| `lastError` | Optional diagnostic message |
| `status` | `pending`, `processing`, or `failed` |

The exact schema may evolve during implementation. Database migrations should be considered whenever the persistent schema changes.

---

## Getting started

### Prerequisites

Install the supported Node.js LTS version for your selected Expo SDK, plus the package manager you intend to use. For device testing, install Expo Go if supported by the project’s dependencies, or use an appropriate development build. Native tooling may be required for simulator or device workflows.

### Installation

Clone the repository and install its dependencies:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd TaskFlow
npm install
```

Start the development server:

```bash
npx expo start
```

Follow the Expo CLI instructions to open the app on a simulator or supported device.

> Replace `<YOUR_GITHUB_REPOSITORY_URL>` with the real repository URL. Use the package manager and scripts defined by the actual project.

### Environment configuration

If the app requires a remote API, document the environment variables here. Never commit credentials, private tokens, or production secrets.

Example placeholder:

```text
EXPO_PUBLIC_API_BASE_URL=https://your-api.example.com
```

Use an appropriate local development URL for the device or emulator. A URL that works from the developer’s computer may not be reachable from a physical phone or simulator.

---

## Testing

Run the commands that are configured in `package.json`. For example, if these scripts exist:

```bash
npm test
npm run lint
npx tsc --noEmit
```

Recommended test coverage:

- Title validation and task business rules
- Search, filtering, and sorting
- Local persistence and database transactions
- Offline create, edit, complete, and delete
- Pending queue creation and recovery after restart
- Retry behavior and idempotency
- Conflict resolution
- UI loading, empty, offline, and error states

Automated tests should simulate network errors and connectivity transitions rather than depend on unreliable real-world network conditions.

## Project plan

The intended MVP build plan is:

| Day | Focus | Outcome |
|---|---|---|
| 1 | Foundation | App setup, TypeScript, navigation, first commit |
| 2 | Task CRUD | Create, view, edit, complete, and delete |
| 3 | Domain logic | Validation and organized task logic |
| 4 | Local database | Tasks persist across restarts |
| 5 | Search and organization | Search, filters, sorting, empty states |
| 6 | Offline and sync | Connectivity state, queue, remote sync path |
| 7 | Reliability and tests | Retry handling and core tests |
| 8 | UX polish | Accessibility and loading/error states |
| 9 | Portfolio release | README, screenshots, architecture notes, demo |

Prioritize a reliable local experience before expanding the remote sync implementation. Document any incomplete functionality rather than presenting planned work as finished.

## Known limitations

Record current limitations here as the project evolves. Examples to consider:

- Whether the remote API is real, mocked, or temporary
- Whether the API persists data between sessions
- Whether authentication is implemented
- Whether conflict resolution is fully tested
- Whether background synchronization works when the app is suspended
- Which devices and OS versions have been tested

Do not claim production-grade synchronization until failure, retry, deletion, and conflict scenarios have been tested against the actual backend.

## Roadmap

Potential improvements after the MVP:

- [ ] Authentication and per-user data isolation
- [ ] A durable backend with versioning and idempotency support
- [ ] More robust multi-device conflict resolution
- [ ] Background synchronization
- [ ] Notifications and recurring tasks
- [ ] Calendar integration
- [ ] Crash reporting and performance monitoring
- [ ] CI workflow for linting and tests
- [ ] Release builds and store deployment

## Screenshots

Add screenshots or a short demo recording as the UI is implemented.

```text
docs/
└── screenshots/
    ├── task-list.png
    ├── create-task.png
    ├── task-details.png
    └── offline-sync.png
```

## Contributing and development conventions

This is a portfolio project. Keep changes focused and use meaningful commits, for example:

```text
feat: add task CRUD
feat: persist tasks with SQLite
feat: queue offline changes
test: cover sync retry behavior
docs: document sync conflict policy
```

Only use a commit message after the corresponding work has actually been completed.

## License

Choose and add a license before inviting others to reuse the project. If you have not selected one, state “No license has been specified yet” rather than implying the project is open source.

---

## Engineering principles demonstrated

TaskFlow is intended to demonstrate:

- React Native and TypeScript fundamentals
- Separation of concerns and maintainable app structure
- Local persistence and database transactions
- Offline-first UX and eventual synchronization
- Idempotency, retries, and conflict-handling trade-offs
- Automated testing and failure simulation
- Clear technical documentation and honest scope management
