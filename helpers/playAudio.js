import { createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus } from '@discordjs/voice';
import { getConnection } from '../main.js';

// Map to queue audio requests per voice channel
const audioQueues = new Map();
const player = createAudioPlayer();

export let playAudio = async (audioPath, channel) => {
  const channelId = channel.id;
  if (!audioQueues.has(channelId)) {
    audioQueues.set(channelId, []);
  }
  // Add this audio request to the queue
  return new Promise((resolve, reject) => {
    audioQueues.get(channelId).push({ audioPath, resolve, reject });
    if (audioQueues.get(channelId).length === 1) {
      // If this is the only item, start playing
      processAudioQueue(channel, channelId);
    }
  });
};

async function processAudioQueue(channel, channelId) {
  const queue = audioQueues.get(channelId);
  if (!queue || queue.length === 0) return;
  const { audioPath, resolve, reject } = queue[0];
  try {
    let connection = await getConnection(channel);
    if (connection.state.status !== VoiceConnectionStatus.Ready) {
      await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
    }
    let resource = createAudioResource(audioPath);
    player.play(resource);
    connection.subscribe(player);
    player.once('idle', () => {
      queue.shift();
      if (queue.length > 0) {
        processAudioQueue(channel, channelId);
      }
      resolve();
    });
    player.once('error', (err) => {
      queue.shift();
      if (queue.length > 0) {
        processAudioQueue(channel, channelId);
      }
      reject(err);
    });
  } catch (err) {
    queue.shift();
    if (queue.length > 0) {
      processAudioQueue(channel, channelId);
    }
    reject(err);
  }
}
