import { Show } from "solid-js";

interface ErrorDisplayProps {
	error: unknown;
	reset?: () => void;
}
export function ErrorDisplay(props: ErrorDisplayProps) {
	return (
		<Show when={props.error !== undefined}>
			An error has occured: {String(props.error)}
			<Show when={props.error instanceof Error}>
				<details>
					<summary>Error details</summary>
					<code>
						<pre>{(props.error as Error)?.stack}</pre>
					</code>
				</details>
			</Show>
			<Show when={props.reset}>
				<button type="button" onClick={props.reset}>
					Try again
				</button>
			</Show>
		</Show>
	);
}
