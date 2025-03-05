import { Call, CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { TokenCredential } from "@azure/identity";
import { AzureLogger, setLogLevel } from "@azure/logger";
import config from "./sample/lib/config";
import {
  CallMedia,
  CallAutomationClient,
} from "@azure/communication-call-automation";

// Set the logger's log level
setLogLevel("warning");

// Redirect log output to console, file, buffer, REST API, or whatever location you want
// AzureLogger.log = (...args) => {
//   console.log(...args); // Redirect log output to console
// };

const SERVER_ENDPOINT = "https://fd8a-73-140-214-158.ngrok-free.app";

export const joinCall = async (
  meetingUrl: string,
  setCall: (call: Call | undefined) => void
) => {
  const callClient = new CallClient();
  const tokenCredential = new AzureCommunicationTokenCredential(
    config.acsUserToken
  );
  const callAgent = await callClient.createCallAgent(tokenCredential, {
    displayName: "MEX FIDO Service",
  });
  const deviceManager = await callClient.getDeviceManager();

  callAgent.on("callsUpdated", (e) => {
    e.added.forEach((call) => setCall(call));
    e.removed.forEach(() => setCall(undefined));
  });

  const call = callAgent.join({ meetingLink: meetingUrl });

  // await fetch(`${SERVER_ENDPOINT}/transcribe`, {
  //   method: "POST",
  //   body: JSON.stringify({ id: call.id }),
  // });

  // const autoClient = new CallAutomationClient(config.acsEndpoint, {
  //   getToken: () => tokenCredential.getToken(),
  // });

  // const connectResult = await autoClient.connectCall(
  //   { id: call.id, kind: "serverCallLocator" },
  //   "https://fd8a-73-140-214-158.ngrok-free.app/tunnel",
  //   {
  //     requestOptions: {
  //       allowInsecureConnection: true,
  //     },
  //     callIntelligenceOptions: {
  //       cognitiveServicesEndpoint: config.cognitiveEndpoint,
  //     },
  //     transcriptionOptions: {
  //       transportType: "websocket",
  //       transportUrl: "https://fd8a-73-140-214-158.ngrok-free.app",
  //       locale: "en-US",
  //       startTranscription: true,
  //     },
  //   }
  // );

  // const callMedia = new CallMedia(call.id, config.acsEndpoint, {
  //   getToken: () => tokenCredential.getToken(),
  // });

  // callMedia.startTranscription({
  //   locale: "en-US",
  // });

  return call;
};
