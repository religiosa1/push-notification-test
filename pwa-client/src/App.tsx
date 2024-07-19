import { createSignal, ErrorBoundary, Suspense } from "solid-js";
import PWABadge from "./PWABadge.tsx";
import { usePushSubscription } from "@client/hooks/usePushSubscription";
import { SubUnsub } from "@client/SubUnsub";
import { ErrorDisplay } from "@client/ErrorDisplay.tsx";

function App() {
  const [subAndReg, stage] = usePushSubscription();
  const [changedSub, setChangedSub] = createSignal<PushSubscription | null>();

  const subscription = () =>
    changedSub() !== undefined ? changedSub() : subAndReg()?.subscription;

  return (
    <ErrorBoundary
      fallback={(error, reset) => <ErrorDisplay error={error} reset={reset} />}
    >
      <Suspense fallback={<span>Loading {stage()}...</span>}>
        <dl>
          <dt>stage</dt>
          <dd>{stage()}</dd>

          <dt>reg?</dt>
          <dd>{subAndReg()?.registration ? "TRUE" : "FALSE"}</dd>

          <dt>ACTIVE?</dt>
          <dd>{subAndReg()?.registration?.active ? "TRUE" : "FALSE"}</dd>

          <dt>sub</dt>
          <dd>{subAndReg()?.subscription?.endpoint ?? "NONE"}</dd>
        </dl>

        <SubUnsub
          registration={subAndReg()?.registration!}
          subscription={subscription() ?? null}
          onSubscripionChange={setChangedSub}
        />
      </Suspense>
      <PWABadge />
    </ErrorBoundary>
  );
}

export default App;
