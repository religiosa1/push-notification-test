import { ErrorBoundary, Suspense, createSignal } from "solid-js";
import { usePushSubscription } from "./hooks/usePushSubscription";
import { SubUnsub } from "./SubUnsub";
import { ErrorDisplay } from "./ErrorDisplay";

export function App() {
	const [subAndReg, stage] = usePushSubscription();
	const [changedSub, setChangedSub] = createSignal<PushSubscription | null>();

	const subscription = () =>
		changedSub() !== undefined ? changedSub() : subAndReg()?.subscription;

	return (
		<ErrorBoundary
			fallback={(error, reset) => <ErrorDisplay error={error} reset={reset} />}
		>
			<Suspense fallback={<span>Loading {stage()}...</span>}>
				<SubUnsub
					registration={subAndReg()?.registration!}
					subscription={subscription() ?? null}
					onSubscripionChange={setChangedSub}
				/>
			</Suspense>
		</ErrorBoundary>
	);
}
