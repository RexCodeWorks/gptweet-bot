import { Configuration, OpenAIApi } from "openai";
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(),
      temperature: 0.6,
      max_tokens: 200
    });
    console.log("completion.data: ", completion.data)
    res.status(200).json({ result: completion.data.choices[0].text.trim() });
  } catch (error) {

    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt() {

  return `Please provide a 'Daily Weight Loss Tip' tweet for my weight loss and health Twitter account. The tweet should follow this format:

  🌟 Daily Weight Loss Tip 🌟
  
  💡 Tip: [Your weight loss tip here] [Tweet-specific emoji related to the tip]
  
  ❓ Why: [Explain the benefits and reasons for the tip]
  
  ✅ [Offer actionable advice or steps related to the tip]
  
  #[Hashtags related to the topic]`;
}

