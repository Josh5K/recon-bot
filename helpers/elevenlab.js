import axios from 'axios';
import path from 'path';
import fs from 'fs';

let textToSpeech = async (text, voiceId = "xCL4SUcFmQ9oGGXdDZ6p") => {
    console.log(`Generating audio file: ${text}`)

    let response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      { text },
      {
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': `${process.env.ELEVENLABS_API_KEY}`
        },
        responseType: 'arraybuffer'
      }
    );
    
    let audioPath = path.join(`./audio_files/${Date.now()}.mp3`);
    fs.writeFileSync(audioPath, response.data);
    return audioPath;
  }

  export { textToSpeech }