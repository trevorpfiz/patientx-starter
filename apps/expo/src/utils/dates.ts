import { format, parseISO, startOfMonth } from "date-fns";

export function formatDate(dateString: string) {
  const date = parseISO(dateString);
  return format(date, "LLL dd, y"); // Dec 06, 2023
}

export function formatTime(dateString: string) {
  const date = parseISO(dateString);
  return format(date, "h:mm a"); // Outputs time like "11:30 AM"
}

export function formatDateTime(dateString: string) {
  const date = parseISO(dateString);
  return format(date, "MMM dd, yyyy, h:mm a"); // Outputs date and time like "Sep 21, 2023, 11:30 AM"
}

export function formatDayDate(dateString: string) {
  const date = parseISO(dateString);
  return format(date, "EEEE, MMMM dd"); // Outputs date like "Thursday, December 18"
}

// --- Scheduling ---
export function findUniqueDates(entries: { start: string }[]): string[] {
  const uniqueDates = new Set(
    entries.map((entry) => format(parseISO(entry.start), "yyyy-MM-dd")),
  );
  return Array.from(uniqueDates).sort();
}

export function getMonthYearFromDate(dateString: string) {
  const date = parseISO(dateString);
  return format(startOfMonth(date), "MMMM yyyy");
}

export function getFormattedDate(dateString: string) {
  return format(parseISO(dateString), "EEE dd");
}

export function formatAppointmentDateTime(dateString: string) {
  const date = parseISO(dateString);
  const formattedDate = format(date, "MMMM do"); // "December 28th"
  const formattedTime = format(date, "h:mm a"); // "10:15 AM"
  return `${formattedDate} at ${formattedTime}`;
}
