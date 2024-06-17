import { Match, Show, Switch, createSignal } from "solid-js";
import { usePushSubscription } from "./hooks/usePushSubscription";
import { SubUnsub } from "./SubUnsub";

export function App() {
	const [subAndReg, stage] = usePushSubscription();
	const [changedSub, setChangedSub] = createSignal<PushSubscription | null>();

	const subscription = () =>
		changedSub() !== undefined ? changedSub() : subAndReg()?.subscription;

	return (
		<Switch>
			<Match when={subAndReg.loading}>Loading {stage()}...</Match>
			<Match when={subAndReg.error}>
				Error while retrieving getting service worker registration.
				<pre>{String(subAndReg.error)}</pre>
				<Show when={subAndReg.error instanceof Error}>
					<details>
						<summary>Error details</summary>
						<code>
							<pre>{(subAndReg as { error: Error }).error.stack}</pre>
						</code>
					</details>
				</Show>
			</Match>
			<Match when={subAndReg()}>
				{(sr) => (
					<SubUnsub
						registration={sr().registration}
						subscription={subscription() ?? null}
						onSubscripionChange={setChangedSub}
					/>
				)}
			</Match>
		</Switch>
	);
}
