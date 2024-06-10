require('dotenv').config()
const fs = require("fs/promises")
const fileType = require('file-type');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const generationConfig = {
  temperature: 1, // Controls the "creativity" or randomness of the generated text // 0 = most predictable, deterministic output and 2 = most creative, unpredictable output
  topP: 0.95, // The model selects words from the top 95% most likely words
  topK: 10, // The model selects the next word from the top 10 most likely words
  maxOutputTokens: 8192, // The maxmium amount of text generated
  responseMimeType: 'application/json',
};  

const safetySettings = [
  {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];


async function processFile(filePath, prompt) {
  const buffer = await fs.readFile(filePath)
  const mimeType = (await fileType.fromBuffer(buffer)).mime

  const result = await model.generateContent({
    contents: [
      { role: 'user',
        parts: [
          { text: prompt },
          { text: 'input: '},
          { 
            inlineData: {
              data: buffer.toString('base64'),
              mimeType
            } 
          }
        ] 
      }
    ],
    generationConfig,
    safetySettings,
  });

  // console.log(result.response.usageMetadata); // to check the input and output token consumption for tracking

  const jsonData = JSON.parse(result.response.text())

  return jsonData
}

module.exports = {
  processFile
}

