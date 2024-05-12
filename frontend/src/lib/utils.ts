import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function combineDateTimeAsDate(date: string, time: string) {
  return new Date(`${date}T${time}`)
}

export function dateToEpochSeconds(date: Date) {
  return Math.floor(date.getTime() / 1000)
}
