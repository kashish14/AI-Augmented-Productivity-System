# IntentOS — AI-Augmented Productivity System

**State-aware productivity. Plan by energy. Schedule with intelligence. Reflect intentionally.**

IntentOS is a locally runnable web application that demonstrates future-of-work thinking: it adapts productivity workflows to **human energy**, **cognitive load**, and **reflection** — not just task lists. The product is designed to feel intentional, calm, and intelligent.

---

## Philosophy

Most productivity tools treat you as a list executor. IntentOS treats you as a **stateful human**:

- **Energy-aware** — Tasks are tagged by energy level (low / medium / high) and cognitive demand, so you can match work to how you feel.
- **Decision-fatigue aware** — The system tracks decisions and task switches, surfaces explainable insights (e.g. *"You make better decisions earlier in the day"*), and suggests when to batch or defer.
- **Reflection-first** — End-of-day prompts and weekly summaries help you see patterns instead of just checking boxes.
- **Explainable AI** — Suggestions come with clear reasoning (e.g. *"High decision count today; batching reduces context-switching"*). No black-box AI.

This is **not** a generic todo app. It is a **state-aware productivity system**.

---

## Quick start

```bash
npm install
npm start
```

Then open **http://localhost:4200**.  
If you see peer dependency warnings, the project uses `legacy-peer-deps` (see `.npmrc`); `npm install` should still succeed.

**Build for production:**

```bash
npm run build
```

**Run tests:**

```bash
npm test
# or headless: npm run test:ci
```

---

## Architecture overview

- **Stack:** Angular 17, TypeScript, RxJS, SCSS, Chart.js (via ng2-charts), local storage–backed state.
- **Structure:** Feature-based modules, lazy-loaded routes, shared core services.
- **Data:** Mock backend with local storage persistence and async simulation via RxJS.

### High-level layout

```
src/app/
├── core/           # Models, services, error handling
│   ├── models/     # Task, Energy, Reflection, DecisionFatigue, AiSuggestion
│   ├── services/   # State, AI suggestion, Analytics, Config, EventBus, Storage, Logging, DecisionFatigue
│   └── error-handler/
├── shared/         # SharedModule (Common, Router)
├── layout/         # Shell, Header, Sidebar
├── pages/          # Dashboard (lazy-loaded)
└── features/       # Lazy-loaded feature modules
    ├── tasks/      # Task system (energy/cognitive tags, priority vs effort)
    ├── energy/     # Energy check-ins, trend chart
    ├── scheduling/ # AI-driven suggestions (explainable)
    └── reflection/ # Reflection prompts, weekly summary
```

### Core services

| Service | Role |
|--------|------|
| **StateService** | Single source of truth; syncs with local storage (tasks, energy, decisions, suggestions, reflections). |
| **AiSuggestionService** | Mock AI: generates suggestions from energy, time of day, decision count, task switches; every suggestion has a `reasoning[]` explanation. |
| **DecisionFatigueService** | Records decision and task-switch events, persists daily summaries, exposes cognitive load score and today’s stats. |
| **AnalyticsService** | Daily alignment (energy vs completion), energy trend; used by dashboard and energy module. |
| **EventBusService** | RxJS-based event bus for cross-module events (e.g. task_created, energy_checkin). |
| **ConfigService** | App config (e.g. storage prefix, mock delay, log level). |
| **StorageService** | Key-value persistence with a configurable prefix. |
| **LoggingService** | Level-based logging. |

---

## AI augmentation strategy (explainable)

The “AI” is a **mock, rule-based layer** focused on **explainability**:

1. **Inputs:** Current energy, time of day, decision count today, pending task count, recent task switches.
2. **Rules (examples):**
   - High decision count + multiple pending tasks → suggest *batch similar tasks* (with reasoning).
   - Evening + low energy → suggest *defer high-focus work* to tomorrow morning.
   - Many task switches → suggest *short break* and explain the link to cognitive load.
   - High energy + pending tasks → suggest *schedule deep work now*.
3. **Output:** List of suggestions, each with `title`, `description`, and `reasoning[]` (why this suggestion).

No neural networks; every suggestion can be traced to simple, human-readable rules. This keeps the system understandable and debuggable.

---

## Decision fatigue concept

**Decision fatigue** is the idea that making many decisions depletes mental resources and worsens later choices. IntentOS:

- **Tracks:** Decision events (e.g. creating/completing tasks, changing schedule) and task switches.
- **Aggregates:** Daily decision count, task-switch count, and a simple cognitive load score.
- **Surfaces:** Insights such as *"You make better decisions earlier in the day"* or *"High-load tasks after 6 PM increase fatigue"* when thresholds are met.
- **Uses:** This context in the AI suggestion logic (e.g. suggest batching or breaks when fatigue is high).

All of this is implemented with transparent, rule-based logic.

---

## Feature summary

| Feature | Description |
|--------|-------------|
| **Task system** | Create tasks; tag by energy level and cognitive demand; separate priority vs effort; complete/delete. |
| **Energy tracking** | Daily check-ins (time of day + level); today’s check-ins; energy trend chart over last 14 days. |
| **Scheduling intelligence** | AI suggestions based on energy, time, and fatigue; current context panel; explainable reasoning; dismiss. |
| **Reflection** | Prompts (energy, focus, decisions, patterns, gratitude); save reflections; today’s list; weekly summary count. |
| **Dashboard** | Today’s energy, pending tasks, cognitive load; daily alignment chart; decision fatigue insights; AI suggestions panel. |

---

## Error handling and observability

- **GlobalErrorHandler** catches unhandled errors and logs them (and can be extended for production reporting).
- **LoggingService** supports log levels (debug, info, warn, error) and is used across core services.
- Performance is left to the framework; no custom APM in this baseline.

---

## Testing

- **Unit tests:** Core services (e.g. `AiSuggestionService`, `DecisionFatigueService`) and feature components (e.g. `TaskListComponent`).
- **AI logic:** Validated via service specs (suggestions return arrays with `reasoning`; decision fatigue updates counts and scores).

Run: `npm test` (watch) or `npm run test:ci` (single run, headless).

---

## Future roadmap (signals for product leadership)

- **Real AI backend** — Replace mock rules with a small LLM or recommendation API while keeping explainability (e.g. structured reasoning in the response).
- **Calendar integration** — Use real availability and time blocks for suggestion timing.
- **Pattern insights** — Weekly/monthly summaries (e.g. “Your best focus is 9–11 AM”) from historical energy and completion data.
- **Export and backup** — Export state (JSON/CSV) and optional cloud backup.
- **Accessibility and i18n** — Full a11y pass and locale support for a global, inclusive product.

---

## Repo and product positioning

This repo is structured to show:

- **Product thinking:** Energy and fatigue as first-class concepts; reflection and explainability over raw automation.
- **System design:** Clear separation of state, AI logic, analytics, and UI; scalable folder and module layout.
- **Future-of-work angle:** State-aware productivity and human-centered AI, with a calm, minimal, non-gamified UI.

---

## License and credits

IntentOS is a demonstration project. Use and adapt it as you like.  
Built with Angular, RxJS, Chart.js, and a focus on intentional, explainable productivity.
