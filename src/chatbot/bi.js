
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("YOUR_API_KEY");

async function run(fileData, prompt) {
  try {
    let modelOptions = { model: "gemini-pro" };
    if (fileData) {
      modelOptions = { model: "gemini-pro-vision" }; 
    }
    const model = genAI.getGenerativeModel(modelOptions);

    const contentParts = [prompt];

    if (fileData) {
      const imagePart = {
        inlineData: {
          data: fileData,
          mimeType: "image/png"
        }
      };
      contentParts.push(imagePart);
    }

    const result = await model.generateContent(contentParts);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error:", error);
    return "Error generating response.";
  }
}

module.exports = { run };