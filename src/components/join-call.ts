import { CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { AzureLogger, setLogLevel } from "@azure/logger";
import config from "./sample/lib/config";

// Set the logger's log level
setLogLevel("verbose");

// Redirect log output to console, file, buffer, REST API, or whatever location you want
AzureLogger.log = (...args) => {
  console.log(...args); // Redirect log output to console
};

export const joinCall = async (meetingUrl: string) => {
  const callClient = new CallClient();
  const tokenCredential = new AzureCommunicationTokenCredential(
    config.acsUserToken
  );
  const callAgent = await callClient.createCallAgent(tokenCredential, {
    displayName: "MEX FIDO Service",
  });
  const deviceManager = await callClient.getDeviceManager();

  const call = callAgent.join({ meetingLink: meetingUrl });

  return call;
};
