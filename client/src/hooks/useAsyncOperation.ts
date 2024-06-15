import { Accessor, Setter, createEffect, createSignal } from "solid-js";

type AsyncOperationResult<T> =
	| {
			state: "unresolved";
			data: undefined;
			error: undefined;
	  }
	| {
			state: "pending";
			data: undefined;
			error: undefined;
	  }
	| {
			state: "resolved";
			data: T;
			error: undefined;
	  }
	| {
			state: "rejected";
			data: undefined;
			error: unknown;
	  };

export function useAsyncOperation<T>(
	initialValue?: Promise<T>,
): [Accessor<AsyncOperationResult<T>>, Setter<Promise<T> | undefined>] {
	const [promise, setPromise] = createSignal<Promise<T> | undefined>(
		initialValue,
	);
	const [asyncOpResult, setAsyncOpResult] = createSignal<
		AsyncOperationResult<T>
	>({ state: "unresolved", data: undefined, error: undefined });

	createEffect(() => {
		const value = promise();
		if (value === undefined) {
			setAsyncOpResult({
				state: "unresolved",
				data: undefined,
				error: undefined,
			});
			return;
		}
		setAsyncOpResult({
			state: "pending",
			data: undefined,
			error: undefined,
		});
		value
			.then((data) =>
				setAsyncOpResult({ state: "resolved", data, error: undefined }),
			)
			.catch((error) => {
				console.error(error);
				setAsyncOpResult({ state: "rejected", data: undefined, error });
			});
	});

	return [asyncOpResult, setPromise];
}
