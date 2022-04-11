export type EventHandler = (event: Event) => Promise<unknown>;
export const asyncEventListener = (eventHandler: EventHandler) => {
  return (event: Event) => {
    eventHandler(event).catch(console.error);
  };
};
