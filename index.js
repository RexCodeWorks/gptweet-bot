const { Configuration, OpenAIApi } = require("openai");
const rwClient = require("./twitterClient.js");
const CronJob = require("cron").CronJob;
// import fetch from 'node-fetch';



require("dotenv").config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const content = async (type) => {

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(type),
        temperature: 0.6,
        presence_penalty: 0.6,
        max_tokens: 1000
    });
    // console.log("completion.data: ", completion.data)
    console.log("result: ", completion.data.choices[0].text)
    return completion.data.choices[0].text;

}

function generatePrompt(type) {

    if (type == "quote") {
        return `Please provide a 'Motivational Quote' tweet for my weight loss and health Twitter account. The tweet must follow this format and the tweet must limited between 50 characters and 270 characters and must add linebreak between sections(title, quote, hashtags):

        🌟 Motivational Quote 🌟
        
        💬 [Your motivational quote here]
        
        #[Hashtags related to motivation and inspiration]\n`;
    } else {
        return `Please provide a 'Daily Weight Loss Tip' tweet for my weight loss and health Twitter account. The tweet must follow this format and the tweet must limited between 100 characters and 280 characters and must add linebreak between sections(title, tip, why, act, hashtags):
        🌟 Daily Weight Loss Tip 🌟
        
        💡 Tip: [Your weight loss tip here]

        ❓ Why: [Explain the benefits and reasons for the tip]

        ✅ Act: [Offer actionable advice or steps related to the tip]

        #[Hashtags related to the topic]\n`;
    }

}





const tweet = async () => {
    try {

        let counter = 0;
        let result = "";
        // try only 5 times
        while (counter < 5) {
            result = await content("tips");
            console.log("result.length: ", result.length);

            if (result.length < 280) {
                rwClient.v2.tweet(result);
                break;
            } else {
                counter++;
                console.log("cannot find good one.");
                console.log("counter: ", counter);
            }
        }

        // if every tweet meet limit of lenth, tweet quote
        if (counter == 5) {
            result = await content("quote");
            if (result.length < 280) {
                rwClient.v2.tweet(result);
            }
        }

    } catch (e) {
        console.error(e);
    }
};

// 2 AM
// const job = new CronJob("0 2 * * *", () => {
//     console.log('cron job starting!');
//     tweet();
// });

// job.start();
tweet();

