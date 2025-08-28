import { sendToOpenAI } from '../helpers/openai.js';
import { getChannel } from '../main.js';
import { textToSpeech } from '../helpers/elevenlab.js';
import { playAudio } from '../helpers/playAudio.js';
import { connectRedis } from '../helpers/redis.js';

let tell = async (message) => {
    const client = await connectRedis();
    let text = message.content.replace(/recon ask/ig, '').trim();
    let channel = await getChannel(message)

    if(channel) {
        // Fetch prompt and contexts from Redis
        let prompt = await client.get('prompt');
        let contexts = await client.lRange('contexts', 0, -1);

        // Get a random context from contexts
        prompt = `${prompt} ${contexts[Math.floor(Math.random() * contexts.length)]}`
        let full_message = `${prompt} ${message.member.displayName} just asked: ${text}`
        let response = await sendToOpenAI(full_message)
        
        textToSpeech(response)
        .then(audioPath => playAudio(audioPath, channel))
        .catch((error) => {
            console.error('Error playing audio:', error);
            return message.reply('Something broke ¯\\_(ツ)_/¯');
        });
    }
}

export { tell }