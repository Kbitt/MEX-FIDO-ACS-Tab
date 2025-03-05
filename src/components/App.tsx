import { useEffect, useState } from "react";
import TeamsApp from "./TeamsApp";
import WebApp from "./WebApp";
import { app } from "@microsoft/teams-js";

const App = () => {
  const [mode, setMode] = useState<"web" | "teams">();
  useEffect(() => {
    try {
      app
        .initialize()
        .then(() => {
          setMode("teams");
        })
        .catch(() => setMode("web"));
    } catch {
      setMode("web");
    }
  }, []);

  switch (mode) {
    case "web":
      return <WebApp />;
    case "teams":
      return <TeamsApp />;
    default:
      return null;
  }
};

export default App;
