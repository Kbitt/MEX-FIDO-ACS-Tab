import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { getIntent } from "./get-intent";
const server = createServer();

const app = express();

app.use(cors());

app.use(express.json());

app.post("/intent", async (req, res) => {
  console.log("/intent", req.body);
  const prompt = req.body.prompt;

  console.log("/intent received prompt: ", prompt);

  let intent = "";
  if (prompt) {
    intent = await getIntent(prompt);
  }

  if (!intent) {
    intent = "<no prompt received>";
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ intent }));
});

server.on("request", app);

server.listen(8081, () => {
  console.log("http server listening on 8081");
});
