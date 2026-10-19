// Display-only aliases: keep canonical choices separate for copying and logic.
export function formatChoiceAliases(
  aliases: readonly (string | undefined)[] = [],
): string {
  const text = aliases.filter(Boolean).join(" · ");
  return text ? `(${text})` : "";
}

export function formatChoiceLabel(
  label: string,
  aliases: readonly (string | undefined)[] = [],
): string {
  return [label, formatChoiceAliases(aliases)].filter(Boolean).join(" ");
}
