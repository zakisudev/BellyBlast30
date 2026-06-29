export const toISODate = (date: Date): string => date.toISOString().slice(0, 10);

export const todayISO = (): string => toISODate(new Date());

export const dayKey = (offset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return toISODate(date);
};

export const isSameDay = (left: string, right: string): boolean => left === right;

export const listPastDays = (days: number): string[] => {
  return Array.from({ length: days }, (_, index) => dayKey(-index)).reverse();
};
