/* @refresh reload */
import { render } from "solid-js/web";

import "@client/style.css";
import App from "./App";

const root = document.getElementById("root");

render(() => <App />, root!);
