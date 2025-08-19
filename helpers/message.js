// Helper to strip the command prefix from a message
export function getStrippedContent(message, prefix) {
  if (!prefix || typeof prefix !== 'string') return message.content;
  return message.content.slice(prefix.length).trim();
}
