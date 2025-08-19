import { getChannel } from "../main.js";
import { playAudio } from '../helpers/playAudio.js';
import { textToSpeech } from '../helpers/elevenlab.js';
import { getStrippedContent } from '../helpers/message.js';

export async function says(message, prefix) {
    if (!message.member) {
        return message.reply('Could not determine your member info.');
    }
    if (message.member.roles.cache.some(role => role.name === 'Recon Says')) {
        let text = getStrippedContent(message, prefix);
        let channel = await getChannel(message)

        try {
            let audioPath = await textToSpeech(text);
            playAudio(audioPath, channel)
        } catch (error) {
            console.error(error);
            message.reply('Something broke ¯\\_(ツ)_/¯');
        }
    }
}