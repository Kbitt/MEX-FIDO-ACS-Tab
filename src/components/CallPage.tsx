import {
  Call,
  Features,
  TeamsCaptions,
  TeamsCaptionsInfo,
} from "@azure/communication-calling";
import { Button } from "@fluentui/react-components";
import { useCallback, useEffect, useRef, useState } from "react";
import { Layout } from "./Layout";
import { joinCall } from "./join-call";

type CaptionInfo = TeamsCaptionsInfo & {
  intent?: string;
};

export const CallPage: React.FC<{
  themeString?: string;
  joinUrl: string;
  topSlot?: JSX.Element;
}> = ({ joinUrl, topSlot }) => {
  const [call, setCall] = useState<Call>();
  const [isMuted, setIsMuted] = useState(false);
  const [captions, setCaptions] = useState<CaptionInfo[]>([]);
  const fetchingIntentsSet = useRef(new Set<number>());

  useEffect(() => {
    const index = captions.length - 1;
    if (
      captions[index] &&
      captions[index].resultType === "Final" &&
      !captions[index].intent &&
      !fetchingIntentsSet.current.has(index)
    ) {
      fetchingIntentsSet.current.add(index);
      setCaptions((value) => {
        value[index].intent = "...processing...";
        return value.slice();
      });
      fetch("http://localhost:8081/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: captions[index].captionText }),
      })
        .then((res) => res.json())
        .then(({ intent }) => {
          setCaptions((value) => {
            value[index].intent = intent;
            return value.slice();
          });
          fetchingIntentsSet.current.delete(index);
        });
    }
  }, [captions, captions.length]);

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
        <table
          style={{
            color: "white",
            border: "1px solid white",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            {captions.map((data, i) => (
              <tr key={`caption-${data.resultType}-${i}`}>
                <td
                  style={{
                    maxWidth: "400px",
                    border: "1px solid white",
                    padding: "8px",
                  }}
                >
                  {data.speaker.displayName}: {data.captionText}
                  {data.resultType !== "Final" && "..."}
                </td>
                <td
                  style={{
                    maxWidth: "400px",
                    border: "1px solid white",
                    padding: "8px",
                  }}
                >
                  {data.intent && <strong>Intent: {data.intent}</strong>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};
