import { render } from "solid-js/web";
import { App } from "./App";
import "./style.css";

navigator.serviceWorker.register("/service-worker.js");

render(() => <App />, document.getElementById("app")!);
