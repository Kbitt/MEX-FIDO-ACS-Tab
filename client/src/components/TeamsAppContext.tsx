import { app } from "@microsoft/teams-js";
import React, { useContext, useEffect, useState } from "react";

export const useTeamsAppContext = () => useContext(Context)!;

export type TeamsAppContext = app.Context | undefined;

const Context = React.createContext<TeamsAppContext>(undefined);

export const TeamsAppContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [value, setValue] = useState<app.Context | undefined>();

  useEffect(() => {
    app.initialize().then(() => {
      app.getContext().then((context) => {
        setValue(() => context);
      });
    });
  }, []);

  if (!value) {
    return null;
  }
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
