import { ErrorBoundary } from "solid-js";
import PWABadge from "./PWABadge.tsx";

import "./App.css";

function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => <ErrorDisplay error={error} reset={reset} />}
    >
      <p>Here comes our actual app</p>
      <PWABadge />
    </ErrorBoundary>
  );
}

export default App;
