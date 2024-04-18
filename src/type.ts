export type Dictionary<K extends string | number, V> = {
  [key in K]: V
}
