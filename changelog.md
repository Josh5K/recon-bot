# 1.1.0

* Recon bot source code is now available on Github https://github.com/Josh5K/recon-bot

* Added backend to store prompts and context used to generate recon ask requests. These can now be added, modified or deleted on the fly

* The users server nickname is now included in the prompt sent to OpenAI. This will allow the response to name drop the user asking the question.

* The number of contexts used by recon ask was reduced from 3 to 1. This will hopfully prevent Recon from yapping.

* Removed GDKP commands

* Updated changelog updates to read from changelog.md file

* Recon will now only talk in the voice channel the original request was sent in. Instead of all connected voice channels.

* Recon will now finish playing the current audio file before starting the next
