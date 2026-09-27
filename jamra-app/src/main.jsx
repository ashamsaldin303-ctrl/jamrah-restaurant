import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import App from "./App";
import "./styles/fonts.css";
import "./styles/base.css";
import "./styles/pages.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </HashRouter>
);
