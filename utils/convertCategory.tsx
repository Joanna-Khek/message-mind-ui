export function lowercaseCategory(str: string) {
  const decoded = decodeURIComponent(str);
  const withSpaces = decoded.replace(/-/g, ' ');
  return withSpaces;
}

export function titleCategory(str: string) {
  const lower = lowercaseCategory(str);
  const titlecase = lower.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
  return titlecase;
}
