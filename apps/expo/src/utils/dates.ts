import { format } from "date-fns";

export function formatDate(date: Date) {
  return format(date, "LLL dd, y"); // Dec 06, 2023
}

export function formatTime(date: Date) {
  return format(date, "h:mm a"); // Outputs time like "11:30 AM"
}

export function formatDateTime(date: Date) {
  return format(date, "MMM dd, yyyy, h:mm a"); // Outputs date and time like "Sep 21, 2023, 11:30 AM"
}
