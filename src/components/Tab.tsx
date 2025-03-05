import { app, meeting } from "@microsoft/teams-js";
import { useContext, useEffect, useState } from "react";
import { CallPage } from "./CallPage";
import { TeamsFxContext } from "./Context";
import { useTeamsAppContext } from "./TeamsAppContext";

``;
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

  return (
    details?.details?.joinUrl && (
      <CallPage joinUrl={details?.details?.joinUrl} themeString={themeString} />
    )
  );
}
