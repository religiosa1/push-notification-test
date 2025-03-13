import App from "./App";
import ReactDOM from "react-dom/client";

import "./style.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((registrationError) => {
      console.warn("SW registration failed: ", registrationError);
    });
  });
}

const rootElement = document.getElementById("root")!;

for (;;) {
  const c = rootElement.lastChild;
  if (!c) {
    break;
  }
  rootElement.removeChild(c);
}
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
