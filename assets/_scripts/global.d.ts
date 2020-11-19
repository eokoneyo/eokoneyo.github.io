export {}

declare global {
  interface Window {
    Document: typeof Document;
    HTMLDocument: typeof HTMLDocument;
    ga?: (type: string, param: Record<string, unknown>) => void
  }
}
