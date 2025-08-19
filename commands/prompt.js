import { getStrippedContent } from '../helpers/message.js';
import { connectRedis } from '../helpers/redis.js';

export async function updatePrompt(message, prefix) {
  // TODO: Add proper permission check
  if (message.author.username !== '_josh5k') {
    return message.reply('You do not have permission to delete contexts.');
  }
  const client = await connectRedis();
  const newPrompt = getStrippedContent(message, prefix);
  if (!newPrompt) {
    return message.reply('Please provide a prompt to update.');
  }
  await client.set('prompt', newPrompt);
  message.reply('Prompt updated in Redis!');
}

export async function listPrompts(message) {
  const client = await connectRedis();
  const prompt = await client.get('prompt');
  const contexts = await client.lRange('contexts', 0, -1);

  let reply = '';
  if (prompt) {
    reply += `**Main Prompt:**\n${prompt}\n\n`;
  }
  if (contexts && contexts.length > 0) {
    reply += `**Contexts:**\n` + contexts.map((c, i) => `${i + 1}. ${c}`).join('\n');
  }
  if (!reply) reply = 'No prompts or contexts found in Redis.';
  message.reply(reply);
}

export async function deleteContext(message, prefix) {
  // TODO: Add proper permission check
  if (message.author.username !== '_josh5k') {
    return message.reply('You do not have permission to delete contexts.');
  }
  const arg = getStrippedContent(message, prefix).trim();
  const client = await connectRedis();

  if (arg.toLowerCase() === 'all') {
    const count = await client.lLen('contexts');
    await client.del('contexts');
    return message.reply(count > 0 ? `Deleted all ${count} contexts.` : 'No contexts to delete.');
  }

  const index = parseInt(arg, 10) - 1;
  if (isNaN(index)) {
    return message.reply('Please provide a valid number from the list or "all".');
  }
  const contexts = await client.lRange('contexts', 0, -1);
  if (index < 0 || index >= contexts.length) {
    return message.reply('That number is out of range.');
  }
  const removed = contexts[index];

  await client.lSet('contexts', index, '__TO_DELETE__');
  await client.lRem('contexts', 1, '__TO_DELETE__');
  message.reply(`Deleted context #${index + 1}: ${removed}`);
}

export async function addContext(message, prefix) {
  // TODO: Add proper permission check
  if (message.author.username !== '_josh5k') {
    return message.reply('You do not have permission to add contexts.');
  }
  const newContext = getStrippedContent(message, prefix);
  if (!newContext) {
    return message.reply('Please provide a context to add.');
  }
  const client = await connectRedis();
  await client.rPush('contexts', newContext);
  message.reply('Context added!');
}
