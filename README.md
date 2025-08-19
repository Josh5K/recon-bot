# Recon Bot

ReconBot is a for fun Discord bot designed to enhance your server with a variety of features. It is built using Node.js, Discord.js, and Redis for persistent storage.

## Commands

- `recon tell me a joke` — Tells a random joke.
- `recon says <message>` — Repeats your message in the voice channel.
- `roll for blame` — Randomly assigns blame.
- `recon ask <question>` — Answers your question using stored prompts.
- `recon update prompt` — Update a prompt.
- `recon list prompts` — List all prompts.
- `recon delete context` — Delete a context.
- `recon add context` — Add a new context.

## Setup

### Prerequisites
- Node.js v18+
- Redis
- Discord
- ElevenLabs
- OpenAI 

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd reconbot
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with your configuration:
   ```env
   DISCORD_TOKEN=xxxxx
   REDIS_URL=redis://localhost:6379
   OPENAI_API_KEY=xxxxx
   ELEVENLABS_API_KEY=xxxxx
   ```
4. Start the bot:
   ```sh
   npm start
   ```

### Roadmap

* Refactor for typescript
* Clean up commands and helper files as they've become chaotic during prototyping
* Add github actions for docker build + publish
* Listen for phrases in voice chat and respond similar to the recon ask command


## License

ISC

---

Feel free to contribute or open issues for feature requests and bug reports!
