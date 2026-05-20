import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import "leaflet/dist/leaflet.css";

const root =
  ReactDOM.createRoot(
    document.getElementById("root")
  );

root.render(
  <App />
);

if("serviceWorker" in navigator){

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
      .register("/sw.js")
      .then(() => {

        console.log(
          "MonniDrop service worker registered"
        );
      })
      .catch((error) => {

        console.log(
          "Service worker registration failed:",
          error
        );
      });
    }
  );
}