# gemini-files-processing

A project for processing audio, images, and videos using Google Generative AI.

## Overview

This project provides functionalities to process different media files (audio, images, videos) by leveraging Google Generative AI. all you need to do is give it a file path and a prompt.

## Prerequisites

-   Node.js
-   Google API Key with access to Google Generative AI, To obtain an API key [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey).

## Getting started

```
git clone https://github.com/Maged-Zaki/gemini-files-processing.git
```

```
cd gemini-files-processing
```

```
npm install
```

-   Create a `.env` file in the root directory, then define a 'API_KEY' variable and set its value to the API key we obtained from Google.

Now that we are done with the configuration, we can test processing files.

---

### Image Processing Example

1. Open `index.js` file
2. give the `filePath` variable an image path.
3. Change the `imagePrompt` value to a different value in case you want a different structure or output from the model (Optional).

```node
const filePath = "samples/images/cartoon-boy.png";

const imagePrompt = `
  Describe this image in 3 to 5 sentences, and also provide at least 3 relevant labels.
  Response must be in JSON format and ready to be parsed, without wrapping the JSON in backticks.

  Example usage
  {
    "description": "DESCRIPTION",
    "labels": ["label1", "label2", "label3, ....]
  }
`;

async function run() {
	const result = await processFile(filePath, imagePrompt);

	console.log(result);
}

run();
```

**Then run the following command to make the API call and start processing**

```node
node index.js
```

**Expected output**

```json
{
	"description": "A cartoon boy with brown hair and brown eyes is wearing a red jacket, a gray hoodie, blue jeans, and a brown hat. He is smiling and has his arms raised in the air, as if he is happy or excited. He is standing on a white background.",
	"labels": [ "cartoon boy", "red jacket", "happy" ]
}
```

---

### Audio Processing Example

1. Open `index.js` file
2. give the `filePath` variable an audio path.
3. Change the `audioPrompt` value to a different value in case you want a different structure or output from the model (Optional).

```node
 const filePath = "samples/audios/joe_rogann.mp3"

const audioPrompt = `
  Describe this audio in 3 to 5 sentences in English and Arabic also provide at least 3 relevant labels and if there's any celebrity in this audio, add their name as label.
  Response must be in JSON format and ready to be parsed, without wrapping the JSON in backticks.

  Example usage
  {
    "description": "DESCRIPTION",
    "labels": ["label1", "label2", "label3", .....],
  }
`;

async function run() {
	const result = await processFile(filePath, audioPrompt);

	console.log(result);
}

run();
```

**Then run the following command to make the API call and start processing**

```node
node index.js
```

**Expected output**

```json
{
	"description": "This audio clip is a discussion about the hypothetical recreation of a black hole's implosion. The speakers discuss the intense pressure involved and the instantaneous nature of the event, where everything turns to \"pink mist\". They also mention the discovery of remnants left behind after the implosion, highlighting the immense power and destructive nature of such a phenomenon.",
	"labels": ["black hole", "implosion", "physics", "astronomy", "space"]
}
```

---

**Notice here that the output can be seen as unexpected however because the audio was orginally from a video, the model speculation was incorrect. In the next example we will see the original video getting processed and the output of it**


### Video Processing Example

1. Open `index.js` file
2. give the `filePath` variable an video path.
3. Change the `videoPrompt` value to a different value in case you want a different structure or output from the model (Optional).

```node
const filePath = "samples/videos/joe_rogann.mp4"

const videoPrompt = `
Describe this video and The description should also contain anything important which people say in the video. in 3 to 5 sentences also provide at least 3 relevant labels and if there's any celebrity in this video, add their name as label.
Response must be in JSON format and ready to be parsed, without wrapping the JSON in backticks.

Example usage
{
  "description": "DESCRIPTION",
  "labels": ["label1", "label2", "label3", ....],
}
`;
async function run() {
	const result = await processVideo(filePath, videoPrompt);

	console.log(result);
}

run();
```

**Then run the following command to make the API call and start processing**

```node
node index.js
```

**Expected output**

```json
{
	"description": "The video shows Joe Rogan discussing the implosion of the Titan submersible. He describes the pressure involved and the instantaneous nature of the implosion. He also mentions the 20 milliseconds duration of the implosion and the 150 milliseconds response time of the brain to pain. The video includes a CGI recreation of the implosion.",
	"labels": [ "supernova", "star", "explosion", "debris", "3D rendering" ]
}
```

## How to update the model configuration

1. In `processFile.js` for images and audios.

```node
const generationConfig = {
	temperature: 1, // Controls the "creativity" or randomness of the generated text // 0 = most predictable, deterministic output and 2 = most creative, unpredictable output
	topP: 0.95, // The model selects words from the top 95% most likely words
	topK: 10, // The model selects the next word from the top 10 most likely words
	maxOutputTokens: 8192, // The maxmium amount of text generated
	responseMimeType: "application/json",
};
```

2. in `processVideo` for videos.

```node
const generationConfig = {
	temperature: 1, // Controls the "creativity" or randomness of the generated text // 0 = most predictable, deterministic output and 2 = most creative, unpredictable output
	topP: 0.95, // The model selects words from the top 95% most likely words
	topK: 10, // The model selects the next word from the top 10 most likely words
	maxOutputTokens: 8192, // The maxmium amount of text generated
	responseMimeType: "application/json",
};

const safetySettings = [
	{
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH, // Options? [BLOCK_NONE, BLOCK_LOW_AND_ABOVE, BLOCK_MEDIUM_AND_ABOVE, HARM_CATEGORY_HARASSMENT, HARM_BLOCK_THRESHOLD_UNSPECIFIED]
	},
	{
		category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
		threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH, // Options? [BLOCK_NONE, BLOCK_LOW_AND_ABOVE, BLOCK_MEDIUM_AND_ABOVE, HARM_CATEGORY_HARASSMENT, HARM_BLOCK_THRESHOLD_UNSPECIFIED]
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH, // Options? [BLOCK_NONE, BLOCK_LOW_AND_ABOVE, BLOCK_MEDIUM_AND_ABOVE, HARM_CATEGORY_HARASSMENT, HARM_BLOCK_THRESHOLD_UNSPECIFIED]
	},
	{
		category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
		threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH, // Options? [BLOCK_NONE, BLOCK_LOW_AND_ABOVE, BLOCK_MEDIUM_AND_ABOVE, HARM_CATEGORY_HARASSMENT, HARM_BLOCK_THRESHOLD_UNSPECIFIED]
	},
];
```
