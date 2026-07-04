const DAY_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const WEEKDAY_FORMAT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  timeZone: "UTC",
});

function utcDayBounds(dayOffset: number) {
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  dayStart.setUTCDate(dayStart.getUTCDate() - dayOffset);

  const dayEnd = new Date(dayStart);
  dayEnd.setUTCHours(23, 59, 59, 999);

  return { dayStart, dayEnd };
}

export function buildDailyChartData(
  logs: { createdAt: Date }[],
  days: number
): { date: string; calls: number }[] {
  return Array.from({ length: days }, (_, i) => {
    const dayOffset = days - 1 - i;
    const { dayStart, dayEnd } = utcDayBounds(dayOffset);

    const calls = logs.filter(
      (log) => log.createdAt >= dayStart && log.createdAt <= dayEnd
    ).length;

    const date =
      days <= 7
        ? WEEKDAY_FORMAT.format(dayStart)
        : DAY_FORMAT.format(dayStart);

    return { date, calls };
  });
}
