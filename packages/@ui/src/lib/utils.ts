import { clsx, type ClassValue } from "clsx";

/**
 * Class value accepted by component style slots.
 * A string applies one or more classes; an array supports conditional class entries.
 * @typeDoc Style
 */
export type Style = string | (string | false | null | undefined)[];

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
