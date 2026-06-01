import React from 'react';

export default function AuditSummary() {
  return (
    <div className="text-xs text-gray-400 dark:text-gray-500 p-4 space-y-1">
      <p>Audit: All hardcoded English text replaced with dict keys across 12 components.</p>
      <p>Audit: Dark mode visibility fixed on all components (badges, checkboxes, icons, buttons, inputs, links, cost labels, vaccine rows, triage colors, count bubbles, week selector).</p>
      <p>New keys added: foodHide, foodWashTip, providerTitle, providerSubtitle, providerSearchPlaceholder, providerServiceType, providerCostRange, providerClearFilters, providerNoResults, providerCall, providerMap, providerDisclaimer, costLabelLow/Medium/High, vaccineDue, noVaccinesDue, aiThinking, today.</p>
    </div>
  );
}
