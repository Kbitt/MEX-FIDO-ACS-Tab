import { FC, PropsWithChildren } from "react";
import "./Layout.css";

export const Layout: FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="container">
    <div className="card">{children}</div>
  </div>
);
