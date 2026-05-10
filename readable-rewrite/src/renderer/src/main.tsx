import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@/app/App";
import "@/original/app-main.css";
import "@/original/app-shell.css";
import "@/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
