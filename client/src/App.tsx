import { Match, Switch, createSignal } from "solid-js";
import { usePushSubscription } from "./hooks/usePushSubscription";
import { SubUnsub } from "./SubUnsub";

export function App() {
	const subAndReg = usePushSubscription();
	const [changedSub, setChangedSub] = createSignal<PushSubscription | null>();

	const subscription = () =>
		changedSub() !== undefined ? changedSub() : subAndReg()?.subscription;

	return (
		<Switch>
			<Match when={subAndReg.loading}>Loading...</Match>
			<Match when={subAndReg.error}>
				Error while retrieving getting service worker registration.
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
