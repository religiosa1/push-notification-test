import { Match, Switch } from "solid-js";
import { usePushSubscription } from "./hooks/usePushSubscription";
import { SubUnsub } from "./SubUnsub";

export function App() {
	const subAndReg = usePushSubscription();

	return (
		<Switch>
			<Match when={subAndReg.loading}>Loading...</Match>
			<Match when={subAndReg.error}>
				Error while retrieving getting service worker registration.
			</Match>
			<Match when={subAndReg()}>{(sr) => <SubUnsub {...sr()} />}</Match>
		</Switch>
	);
}
