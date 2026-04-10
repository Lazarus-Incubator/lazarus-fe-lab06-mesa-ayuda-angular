export function toSearchValue(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? '';
}

export function matchesSearchTerm(values: Array<string | null | undefined>, search: string): boolean {
  if (!search) {
    return true;
  }

  const normalizedSearch = toSearchValue(search);
  return values.some((value) => toSearchValue(value).includes(normalizedSearch));
}
