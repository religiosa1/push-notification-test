export function withTimeout<T>(
	cb: (signal: AbortSignal) => Promise<T>,
	timeout: number = 30_000,
): Promise<T> {
	return new Promise<T>((res, rej) => {
		const signal = AbortSignal.timeout(timeout);
		signal.addEventListener("abort", rej, { once: true });
		cb(signal)
			.then(res, rej)
			.finally(() => {
				signal.removeEventListener("abort", rej);
			});
	});
}
