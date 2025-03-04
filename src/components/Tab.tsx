import { useCallback, useContext, useEffect, useState } from "react";
import { Welcome } from "./sample/Welcome";
import { TeamsFxContext } from "./Context";
import config from "./sample/lib/config";
import { app, meeting } from "@microsoft/teams-js";
import { useTeamsAppContext } from "./TeamsAppContext";
import { joinCall } from "./join-call";
import { Button } from "@fluentui/react-components";
import { Call } from "@azure/communication-calling";

const showFunction = Boolean(config.apiName);

export default function Tab() {
  const { themeString } = useContext(TeamsFxContext);
  const context = useTeamsAppContext();

  const [details, setDetails] = useState<meeting.IMeetingDetailsResponse>();

  console.log("context", context);
  useEffect(() => {
    app.initialize().then(() => {
      meeting.getMeetingDetails((_, res) => {
        res && setDetails(res);
      });
    });
  }, []);

  const [call, setCall] = useState<Call>();

  const joinCallClick = useCallback(() => {
    details?.details?.joinUrl &&
      joinCall(details?.details?.joinUrl).then(setCall);
  }, [details?.details?.joinUrl]);

  const hangUp = useCallback(() => {
    call &&
      call.hangUp().then(() => {
        call.dispose();
        setCall(undefined);
      });
  }, []);

  return (
    <div
      className={
        themeString === "default"
          ? "light"
          : themeString === "dark"
          ? "dark"
          : "contrast"
      }
    >
      <h1>{context.page.frameContext}</h1>
      {details && <h2>{details.details.joinUrl}</h2>}

      {details?.details?.joinUrl && !call && (
        <Button onClick={joinCallClick}>Join Meeting</Button>
      )}

      {call && <Button onClick={hangUp}>Hang up</Button>}
    </div>
  );
}
