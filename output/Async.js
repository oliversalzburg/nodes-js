export const asyncEventHandler = (eventHandler) => {
  return (event) => {
    eventHandler(event).catch(console.error);
  };
};
