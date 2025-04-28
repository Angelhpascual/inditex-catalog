import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import "../../styles/global.css";
import "../../styles/layout.css";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
};
