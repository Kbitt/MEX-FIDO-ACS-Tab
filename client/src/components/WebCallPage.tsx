import { useMemo, useState } from "react";
import { CallPage } from "./CallPage";
import { Input, Label } from "@fluentui/react-components";

export const WebCallPage = () => {
  const [joinUrl, setJoinUrl] = useState(
    "https://teams.microsoft.com/meet/227366592654?p=WSe6vSFdcw6nMx2urV"
  );
  const finalJoinUrl = useMemo(() => {
    if (!joinUrl) return undefined;

    try {
      new URL(joinUrl);
      return joinUrl;
    } catch {
      return undefined;
    }
  }, [joinUrl]);

  const controls = (
    <>
      <Label htmlFor="join-url">Teams Meeting Join Url:</Label>
      <Input
        id="join-url"
        style={{ border: "1px solid black", borderRadius: "5px" }}
        value={joinUrl}
        onChange={(e) => setJoinUrl(e.target.value)}
      />
    </>
  );

  return finalJoinUrl && <CallPage joinUrl={finalJoinUrl} topSlot={controls} />;
};
