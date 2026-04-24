import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays, parseISO, isValid, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcDays(startStr: string, endStr: string): number | string {
  if (!startStr || !endStr) return "-";
  const startDate = parseISO(startStr);
  const endDate = parseISO(endStr);
  if (isValid(startDate) && isValid(endDate)) {
    return differenceInDays(endDate, startDate);
  }
  return "-";
}

export function calcVariance(fcstEndStr: string, actEndStr: string): number | string {
  if (!fcstEndStr || !actEndStr) return "-";
  const fcstDate = parseISO(fcstEndStr);
  const actDate = parseISO(actEndStr);
  if (isValid(fcstDate) && isValid(actDate)) {
    return differenceInDays(actDate, fcstDate);
  }
  return "-";
}

export function getShortMonth(dateStr: string) {
  const d = parseISO(dateStr);
  if (isValid(d)) return format(d, "MMM d");
  return "";
}
