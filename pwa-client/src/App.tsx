import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SubUnsub } from "./components/SubUnsub.tsx";
import { ErrorDisplay } from "./components/ErrorDisplay.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        fallback={(error, reset) => (
          <ErrorDisplay error={error} reset={reset} />
        )}
      >
        <Suspense fallback={<span>Loading...</span>}>
          <SubUnsub />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
