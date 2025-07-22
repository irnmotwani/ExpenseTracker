/**
 * Utility function to open the chatbot
 * This function can be called from anywhere in the app to open the chatbot
 */
export const openChatbot = () => {
  // Dispatch a custom event to open the chatbot
  const event = new CustomEvent('openChatbot');
  window.dispatchEvent(event);
};

/**
 * Function to check if chatbot is available
 */
export const isChatbotAvailable = () => {
  return document.querySelector('[data-chatbot-toggle]') !== null;
};