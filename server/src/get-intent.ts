import "@azure/openai/types";
import { AzureOpenAI } from "openai";

export const getIntent = async (prompt: string) => {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "assistant",
        content:
          "I am an intelligent assistant. I will take a piece of spoken text, and determine what the user's intent is.",
      },
      {
        role: "user",
        content: `Determine what the intended action is from this piece of text: "${prompt}". The action should be directions for how to interact with a web based whiteboard with various actions like add sticky notes, edit text, draw shapes, etc. If there is no relevant intent that can be interpreted from the text, then return "<no intent>"`,
      },
    ],
    store: true,
  });

  return response.choices[0].message.content ?? "";
};

const getClient = () => {
  return new AzureOpenAI({
    apiKey: process.env.SECRET_AZURE_OPENAI_API_KEY,
    deployment: process.env.AZURE_OPENAI_MODEL_DEPLOYMENT_NAME,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  });
};
