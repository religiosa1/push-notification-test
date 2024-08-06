interface ErrorDisplayProps {
  error: unknown;
  reset?: () => void;
}
export function ErrorDisplay(props: ErrorDisplayProps) {
  if (props.error == null) {
    return null;
  }
  return (
    <div className="error-display">
      An error has occured: {String(props.error)}
      {props.error instanceof Error && (
        <details>
          <summary>Error details</summary>
          <code>
            <pre>{(props.error as Error)?.stack}</pre>
          </code>
        </details>
      )}
      {props.reset && (
        <button type="button" onClick={props.reset}>
          Try again
        </button>
      )}
    </div>
  );
}
