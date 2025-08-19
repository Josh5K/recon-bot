import { playAudio } from '../helpers/playAudio.js';
import { textToSpeech } from '../helpers/elevenlab.js';
import { getJoke } from '../helpers/joke.js'

let joke = async (message) => {
    let joke = await getJoke();
    message.reply(joke);
    let audioPath = await textToSpeech(joke);
    playAudio(audioPath, message.member.voice.channel)
}

export { joke }