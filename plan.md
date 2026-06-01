## Plan: PregCampinion feature roadmap

TL;DR: Convert the current MVP into a safety-first pregnancy companion. The roadmap should prioritize reminders, symptom triage, custom medicine tracking, week-by-week guidance, emergency access, and provider discovery before adding deeper engagement or advanced AI.

**Product goals**
- Help users know what to do each week of pregnancy and after delivery.
- Warn users early when symptoms may need medical attention.
- Make reminders and trackers flexible enough for supplements and medicines.
- Provide fast access to emergency numbers and nearby care.
- Keep the experience simple, localized, and safe for mobile users.

**Priority roadmap**
1. Push notifications and scheduling.
- Remind users about supplements, medicines, vaccines, appointments, and urgent follow-ups.
- Support local notifications first, then backend-driven scheduling later.
2. Symptom logging plus AI risk alerts.
- Let users log symptoms, severity, duration, and notes.
- Use rules plus AI to return next actions such as monitor, rest, or seek care urgently.
- Always include red-flag guidance and a medical disclaimer.
3. UX and engagement features.
- Add onboarding, milestones, badges, progress celebrations, and family sharing.
- Improve accessibility and make the interface easier for first-time users.
4. Custom supplements and medicines.
- Keep the predefined supplement list, but allow users to add custom supplements or prescription medicines.
- Support dosage, timing, start/end dates, and reminders.
5. Vaccination and weekly recommendations.
- Show guidance from week 1 through postpartum.
- Include vaccines, test recommendations, and what to discuss with a clinician.
6. Previous week and future week navigation.
- Let users move backward and forward through pregnancy weeks.
- Preserve weekly content so they can review prior guidance, not only the current week.
7. Emergency call-center style bot.
- Add a floating help icon with ambulance numbers, hospital numbers, and quick emergency actions.
- Keep it visible even when AI is unavailable.
8. Smart doctor and hospital finder.
- Help users find doctors and hospitals by need, such as normal delivery, C-section, maternity services, and emergency care.
- Include distance, map links, service type, and rough cost ranges or low/medium/high price bands.

**Suggested implementation phases**
- Phase 1: notifications, symptom logging, emergency help, and custom supplement tracking.
- Phase 2: weekly recommendations, previous-week browsing, and provider finder.
- Phase 3: broader engagement, analytics, and advanced AI features.

**Relevant files**
- [src/App.jsx](src/App.jsx) — global state and data sync.
- [src/components/AICompanion.jsx](src/components/AICompanion.jsx) — symptom guidance and AI safety prompts.
- [src/components/SupplementTracker.jsx](src/components/SupplementTracker.jsx) — custom supplements and medicines.
- [src/components/TimelineSection.jsx](src/components/TimelineSection.jsx) — week-by-week pregnancy content and history navigation.
- [src/components/Header.jsx](src/components/Header.jsx) — candidate location for emergency access and navigation entry points.
- [src/utils/date.js](src/utils/date.js) — pregnancy week calculations and recommendation timing.
- [src/i18n/translations.js](src/i18n/translations.js) — new labels, messages, and safety text.
- [capacitor.config.json](capacitor.config.json) — notification and mobile configuration.

**Acceptance criteria**
- Users can receive scheduled reminders for supplements, medicines, and vaccines.
- Users can log symptoms and get a clear next-step recommendation.
- Users can add custom supplements or medicines instead of being limited to defaults.
- Users can browse past weeks, current week, and future weeks.
- Users can reach emergency help quickly from a persistent UI entry point.
- Users can search for nearby care options based on delivery type and cost.

**Risks and constraints**
- AI must not replace medical care; it should triage and escalate.
- Emergency numbers and care shortcuts must work without internet if possible.
- Doctor and hospital recommendations should start with curated data before any automated sourcing.
- Cost estimates should be presented as rough ranges, not exact billing promises.
