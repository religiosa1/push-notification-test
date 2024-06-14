import { css, cx } from "hono/css";
import { Child, FC } from "hono/jsx";

interface MaxWidthPreviewProps {
  maxWidth?: string;
  children?: Child;
}
export const MaxWidthPreview: FC<MaxWidthPreviewProps> = ({
  children,
  maxWidth,
}) => {
  const maxWidthClass = css`
    display: inline-block;
    max-width: 300px;
  `;

  const summaryClass = css`
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
  `;

  const checkboxClass = css`
    float: left;
    &:checked + ${summaryClass} {
      white-space: normal;
      text-overflow: clip;
      overflow-wrap: anywhere;
    }
  `;

  return (
    <label class={maxWidthClass} style={{ maxWidth }}>
      <input title="show long text" type="checkbox" class={checkboxClass} />
      <div title={String(children)} class={summaryClass}>
        {children}
      </div>
    </label>
  );
};
