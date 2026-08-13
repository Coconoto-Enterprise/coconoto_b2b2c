// Lightweight class-name combiner (avoids needing clsx/tailwind-merge).
// Joins truthy values with a space. When overriding utilities, prefer
// additive classes (e.g. `w-full`, `mt-4`) over conflicting color utilities.
export type ClassValue = string | number | false | null | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}
