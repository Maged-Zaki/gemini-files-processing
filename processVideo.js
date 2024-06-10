require('dotenv').config()
const fileType = require('file-type');
const {  GoogleGenerativeAI,  HarmCategory,  HarmBlockThreshold} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/files");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});


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

async function processVideo(filePath, prompt) {
  const file = await uploadToGemini(filePath)

  await waitForFileActive(file);

  const result = await model.generateContent({
    contents: [
      { role: 'user',
        parts: [
          { text: prompt },
          { text: 'input: '},
          {
            file_data: {
              file_uri: file.uri,
              mime_type: file.mimeType,
            },
          }
        ] 
      }
    ],
    generationConfig,
    safetySettings,
  });
  
  // console.log(result.response.usageMetadata); // to check the input and output token consumption for tracking

  const jsonData = JSON.parse(result.response.text())

  // delete file after processing. File gets deleted after 48hours anyways
  await deleteFile(file)

  return jsonData
}


async function uploadToGemini(filePath) {
  const mimeType = (await fileType.fromFile(filePath)).mime
  
  console.log("uploading started for: ", filePath)
  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType,
    displayName: filePath,
  });
  
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  
  return file;
}

async function waitForFileActive(uploadedFile) {
  file = await fileManager.getFile(uploadedFile.name);

  while (file.state === "PROCESSING") {
    process.stdout.write(".")
    await new Promise((resolve) => setTimeout(resolve, 5_000));
    file = await fileManager.getFile(uploadedFile.name)
  }

  if (file.state !== "ACTIVE") {
    throw Error(`File ${uploadedFile.name} failed to process`);
  }

  console.log("... file is ready\n");
}

async function deleteFile(file) {
  await fileManager.deleteFile(file.name);

  console.log(`Deleted ${file.displayName}`);
}


module.exports = {
  processVideo
}