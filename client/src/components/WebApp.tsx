import {
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  Spinner,
  tokens,
} from "@fluentui/react-components";
import { WebCallPage } from "./WebCallPage";

export default function WebApp() {
  const themeString = "dark";
  return (
    <FluentProvider
      theme={
        themeString === "dark"
          ? teamsDarkTheme
          : themeString === "contrast"
          ? teamsHighContrastTheme
          : {
              ...teamsLightTheme,
              colorNeutralBackground3: "#eeeeee",
            }
      }
      style={{ background: tokens.colorNeutralBackground3 }}
    >
      <WebCallPage />
    </FluentProvider>
  );
}
