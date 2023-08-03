const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const content = async () => {

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(),
        temperature: 0.6,
        max_tokens: 1000
    });
    console.log("completion.data: ", completion.data)
    console.log("result: ", completion.data.choices[0].text.trim())

}

function generatePrompt() {

    return `Please provide a 'Daily Weight Loss Tip' tweet for my weight loss and health Twitter account. The tweet should follow this format:
    🌟 Daily Weight Loss Tip 🌟
    
    💡 Tip: [Your weight loss tip here] [Tweet-specific emoji related to the tip]

    ❓ Why: [Explain the benefits and reasons for the tip]

    ✅ [Offer actionable advice or steps related to the tip]

    #[Hashtags related to the topic]\n`;
}

content();
