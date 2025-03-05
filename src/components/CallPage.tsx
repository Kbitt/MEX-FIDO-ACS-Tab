import { useCallback, useContext, useEffect, useState } from "react";
import { Welcome } from "./sample/Welcome";
import { TeamsFxContext } from "./Context";
import config from "./sample/lib/config";
import { app, meeting } from "@microsoft/teams-js";
import { useTeamsAppContext } from "./TeamsAppContext";
import { joinCall } from "./join-call";
import { Button } from "@fluentui/react-components";
import {
  Call,
  Features,
  TeamsCaptions,
  TeamsCaptionsInfo,
} from "@azure/communication-calling";
import { Layout } from "./Layout";

const showFunction = Boolean(config.apiName);

export const CallPage: React.FC<{
  themeString?: string;
  joinUrl: string;
  topSlot?: JSX.Element;
}> = ({ joinUrl, topSlot }) => {
  const [call, setCall] = useState<Call>();
  const [isMuted, setIsMuted] = useState(false);
  const [captions, setCaptions] = useState<TeamsCaptionsInfo[]>([]);

  const internalSetCall = useCallback((call: Call | undefined) => {
    console.log("internalSetCall", call);
    setCall(call);
    setIsMuted(!!call?.isMuted);
    setCaptions([]);

    if (call) {
      call?.on("isMutedChanged", () => {
        setIsMuted(call.isMuted);
      });

      call.on("stateChanged", () => {
        if (call.state === "Connected") {
          const captionsFeature = call.feature(Features.Captions);
          console.log("starting captions");
          captionsFeature.captions
            .startCaptions({ spokenLanguage: "en-us" })
            .then(() => {
              console.log("captions started");
              const captions = captionsFeature as any as TeamsCaptions;
              captions.on("CaptionsReceived", (data) => {
                console.log("captions received", data);
                setCaptions((value) => {
                  if (!value.length) {
                    return [data];
                  }
                  if (value[value.length - 1].resultType === "Final") {
                    value.push(data);
                  } else {
                    value[value.length - 1] = data;
                  }
                  return value.slice();
                });
              });
            })
            .catch((e) => {
              console.error("error starting captions", e);
            });
        }
      });
    } else {
    }
  }, []);

  const joinCallClick = useCallback(() => {
    joinCall(joinUrl, internalSetCall).then(() => {});
  }, [joinUrl]);

  const muteToggle = useCallback(() => {
    return (
      call &&
      (call.isMuted ? call.unmute() : call.mute()).then(() => {
        setIsMuted(call.isMuted);
      })
    );
  }, [call]);

  const hangUp = useCallback(() => {
    if (!call) return;

    call
      .feature(Features.Captions)
      .captions.stopCaptions()
      .then(() => {});
    call.hangUp().then(() => {
      setCall(undefined);
    });
  }, [call]);

  return (
    <Layout>
      {topSlot}

      {!call && <Button onClick={joinCallClick}>Join Meeting</Button>}

      {call && (
        <Button onClick={muteToggle}>{isMuted ? "Unmute" : "Mute"}</Button>
      )}
      {call && <Button onClick={hangUp}>Hang up</Button>}

      {call && (
        <ul>
          {captions.map((data, i) => (
            <li key={`caption-${data.resultType}-${i}`}>
              {data.speaker.displayName}: {data.captionText}
              {data.resultType !== "Final" && "..."}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
};
