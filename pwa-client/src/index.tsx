import App from "./App";
import ReactDOM from "react-dom/client";

import "./style.css";

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
