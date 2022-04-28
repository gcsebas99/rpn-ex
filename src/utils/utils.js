
export const timeout = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const scrollToBottom = element => {
  element && element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
};