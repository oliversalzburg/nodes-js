export type EventHandlerIgnoredArgs = () => Promise<unknown>;
export type EventHandler<TEvent extends Event = Event> = (event: TEvent) => Promise<unknown>;
export const asyncEventHandler = <TEvent extends Event = Event>(
  eventHandler: EventHandler<TEvent> | EventHandlerIgnoredArgs,
) => {
  return (event: TEvent) => {
    eventHandler(event).catch(console.error);
  };
};
