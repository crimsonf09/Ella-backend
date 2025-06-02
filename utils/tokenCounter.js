export const validatePrompt = (prompt) => {
  return typeof prompt === 'string' && prompt.trim().length > 0;
};
