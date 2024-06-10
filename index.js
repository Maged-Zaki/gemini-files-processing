const { processFile } = require("./processFile")
const { processVideo } = require("./processVideo")

const filePath = "samples/images/cartoon-boy.png"
// const filePath = "samples/audios/joe_rogann.mp3"
// const filePath = "samples/videos/joe_rogann.mp4"


const imagePrompt = `
  Describe this image in 3 to 5 sentences in English and Arabic also provide at least 3 relevant labels and if there's any celebrity in the image, add their name as label and determine if it's real or illustrated or designed.
  Response must be in JSON format and ready to be parsed, without wrapping the JSON in backticks.

  Example
  {
    "englishDescription": "DESCRIPTION",
    "arabicDescription": "DESCRIPTION",
    "labels": ["label1", "label2", "label3", ....],
    "photoType": "real OR illustrated OR designed"
  }
`;
const audioPrompt = `
  Describe this audio in 3 to 5 sentences in English and Arabic also provide at least 3 relevant labels and if there's any celebrity in this audio, add their name as label.
  Response must be in JSON format and ready to be parsed, without wrapping the JSON in backticks.

  Example
  {
    "englishDescription": "DESCRIPTION",
    "arabicDescription": "DESCRIPTION",
    "labels": ["label1", "label2", "label3", .....],
  }
`;
const videoPrompt = `
Describe this video and The description should also contain anything important which people say in the video. in 3 to 5 sentences in English and Arabic also provide at least 3 relevant labels and if there's any celebrity in this video, add their name as label. and determine if it's real or illustrated or designed.
Response must be in JSON format and ready to be parsed, without wrapping the JSON in backticks.

Example
{
  "englishDescription": "DESCRIPTION",
  "arabicDescription": "DESCRIPTION",
  "labels": ["label1", "label2", "label3", ....],
  "photoType": "real OR illustrated OR designed"
}
`

async function run() {
  const result = await processFile(filePath, imagePrompt);
  // const result = await processVideo(filePath, videoPrompt);
  
  console.log(result)
}

run()
