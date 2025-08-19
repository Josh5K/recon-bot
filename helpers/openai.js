import OpenAI from 'openai';

let openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: "org-NgQuxe6tKTUSbWgFJr6ncfst",
    project: "proj_RCf3BHpNw4ZkyXezUeefwB6C"
});

const sendToOpenAI= async (inputString) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: inputString }
            ],
        });

        const reply = response.choices[0].message.content;
        return reply;
    } catch (error) {
        console.error('Error communicating with ChatGPT:', error);
        throw error;
    }
};

export { sendToOpenAI }