export {}

declare global {
  interface Window {
    ga?: (type: string, param: Record<string, unknown>) => void
  }
}
