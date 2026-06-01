# PregCampinion — Pregnancy Companion App

A safety-first pregnancy tracker built with React, Vite, Tailwind CSS, and Capacitor for Android. Helps expectant mothers track their pregnancy week-by-week, log symptoms, manage supplements and medications, get AI-powered guidance, and access emergency resources.

## Features

- **Week-by-Week Timeline** — Browse current, past, and future pregnancy weeks with tailored guidance, vaccine recommendations, and test suggestions.
- **Supplement & Medicine Tracker** — Track daily intake of folic acid, iron, calcium, and custom medications with reminders via local push notifications.
- **Symptom Logger** — Log symptoms with severity, duration, and notes. AI-powered risk triage provides next-step recommendations with red-flag alerts and a medical disclaimer.
- **AI Companion** — Ask pregnancy-related questions and get intelligent guidance powered by Gemini AI.
- **Emergency Access** — Persistent floating action button with quick access to ambulance numbers, hospital contacts, and emergency actions.
- **Provider Finder** — Search for doctors and hospitals by service type, with distance estimates and cost bands.
- **Food Suggestions** — Dietary recommendations tailored to the current pregnancy week.
- **Onboarding** — First-time user setup with language selection and due date calculation.
- **Dark Mode** — Toggle between light and dark themes.
- **Localization** — Multi-language support (English, Arabic, etc.).
- **Push Notifications** — Reminders for supplements, medicines, vaccines, and appointments via Capacitor Local Notifications.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + clsx + tailwind-merge |
| Icons | Lucide React |
| Native Bridge | Capacitor 6 (Android) |
| AI | Google Gemini API |
| Notifications | @capacitor/local-notifications |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Android Studio (for building APK)

### Development

```bash
npm install
npm run dev
```

### Build for Android

```bash
npm run build
npx cap sync
cd android && ./gradlew assembleDebug
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── App.jsx                     # Main app with global state & data sync
├── main.jsx                    # Entry point
├── index.css                   # Global styles with Tailwind
├── components/
│   ├── AICompanion.jsx         # AI-powered Q&A and symptom guidance
│   ├── AuditSummary.jsx        # Daily supplement audit summary
│   ├── CareTabs.jsx            # Tab navigation for care section
│   ├── EmergencyFab.jsx        # Floating emergency action button
│   ├── FoodSuggestions.jsx     # Week-specific dietary advice
│   ├── Footer.jsx              # App footer with medical disclaimer
│   ├── Header.jsx              # Top navigation bar
│   ├── LMPCard.jsx             # Last menstrual period date display
│   ├── NotificationSettings.jsx # Push notification configuration
│   ├── Onboarding.jsx          # First-time user setup wizard
│   ├── ProgressOverview.jsx    # Dashboard with week & supplement stats
│   ├── ProviderFinder.jsx      # Doctor/hospital search
│   ├── SupplementTracker.jsx   # Daily supplement & medicine tracker
│   ├── SymptomLogger.jsx       # Symptom entry and risk assessment
│   ├── TabBar.jsx              # Bottom tab navigation
│   └── TimelineSection.jsx     # Week-by-week content browser
├── hooks/
│   └── useNotifications.js     # Capacitor notification hook
├── i18n/
│   └── translations.js         # Localized strings
└── utils/
    └── date.js                 # Pregnancy date calculations
```

## Config

- `capacitor.config.json` — Capacitor and notification configuration
- `vite.config.js` — Vite build configuration
- `tailwind.config.js` — Tailwind CSS theme and customization
- `postcss.config.js` — PostCSS with Tailwind and autoprefixer

## Roadmap

See [plan.md](plan.md) for the full feature roadmap across three phases:

1. **Phase 1** — Notifications, symptom logging, emergency help, custom supplement tracking
2. **Phase 2** — Weekly recommendations, history browsing, provider finder
3. **Phase 3** — Engagement features, analytics, advanced AI

## Disclaimer

This app is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider with any questions about your pregnancy.
