import { Call, CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { setLogLevel } from "@azure/logger";
import config from "./sample/lib/config";

export const joinCall = async (
  meetingUrl: string,
  setCall: (call: Call | undefined) => void
) => {
  const callClient = new CallClient();
  const tokenCredential = new AzureCommunicationTokenCredential(
    config.acsUserToken
  );
  const callAgent = await callClient.createCallAgent(tokenCredential, {
    displayName: "Teacher Agent",
  });

  callAgent.on("callsUpdated", (e) => {
    e.added.forEach((call) => setCall(call));
    e.removed.forEach(() => setCall(undefined));
  });

  const call = callAgent.join({ meetingLink: meetingUrl });

  return call;
};
