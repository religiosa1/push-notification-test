import { Style, css } from "hono/css";
import { Child, FC } from "hono/jsx";

interface LayoutProps {
  title: string;
  children?: Child;
}
export const Layout: FC<LayoutProps> = (props) => {
  const bodyClass = css`
    max-width: 800px;
    margin: auto;
  `;
  const aClass = css`
    margin-inline-end: 1rem;
  `;
  return (
    <html>
      <head>
        <title>{props.title}</title>
        <Style />
      </head>
      <body class={bodyClass}>
        <h1>Title</h1>
        <nav>
          <a class={aClass} href="/">
            send notifications
          </a>
          <a class={aClass} href="/subscriptions">
            list subscriptions
          </a>
        </nav>
        {props.children}
      </body>
    </html>
  );
};
