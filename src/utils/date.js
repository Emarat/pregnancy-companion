export const getLocalYYYYMMDD = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};

export const calculatePregnancyData = (lmp, lang) => {
  if (!lmp) return null;

  const lmpDate = new Date(lmp);
  const today = new Date();
  lmpDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const eddDate = new Date(lmpDate);
  eddDate.setDate(eddDate.getDate() + 280);

  const msDiff = today.getTime() - lmpDate.getTime();
  const daysElapsed = Math.floor(msDiff / (1000 * 60 * 60 * 24));
  const safeDaysElapsed = Math.max(0, Math.min(daysElapsed, 294));

  const weeks = Math.floor(safeDaysElapsed / 7);
  const days = safeDaysElapsed % 7;

  let trimesterIndex = 0;
  if (weeks >= 14 && weeks < 28) trimesterIndex = 1;
  if (weeks >= 28) trimesterIndex = 2;

  const progressPercent = Math.min(100, (safeDaysElapsed / 280) * 100);

  let fruitKey = 0;
  const weekKeys = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
  for (const k of weekKeys) {
    if (weeks >= k) fruitKey = k;
  }

  return {
    eddFormatted: eddDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
    weeks,
    days,
    trimesterIndex,
    progressPercent,
    fruitKey
  };
};
