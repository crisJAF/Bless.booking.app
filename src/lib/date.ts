export function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function toApiDate(date: string) {
  return `${date}T00:00:00`;
}

export function formatTime(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 5);
}

export function timeToApiValue(value: string) {
  return value.length === 5 ? `${value}:00` : value;
}

export function formatReviewDate(unixSeconds?: number | null) {
  if (!unixSeconds) {
    return "";
  }

  return new Intl.DateTimeFormat("es-NI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(unixSeconds * 1000));
}

export function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("es-NI", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}
