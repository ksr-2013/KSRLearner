export {};

declare global {
  interface Window {
    V86Starter?: new (config: any) => any;
    V86?: new (config: any) => any;
  }
}

