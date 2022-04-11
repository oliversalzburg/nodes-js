export const asyncEventListener = (eventHandler) => {
  return (event) => {
    eventHandler(event).catch(console.error);
  };
};
