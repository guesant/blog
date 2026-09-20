export function serializable<T>(value: T): never {
  return JSON.parse(JSON.stringify(value)) as never;
}
