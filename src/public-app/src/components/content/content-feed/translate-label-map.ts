type LabelMap<Key extends string> = Record<string, Key>;

export function translateLabelMap<Key extends string, Labels extends LabelMap<Key>>(
  translator: (key: Key) => string,
  labels: Labels,
): { [Name in keyof Labels]: string } {
  const translated = Object.entries(labels).map(([name, key]) => [name, translator(key as Key)]);

  return Object.fromEntries(translated) as { [Name in keyof Labels]: string };
}
