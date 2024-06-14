import { Style, css } from "hono/css";
import { html } from "hono/html";
import { Child, FC } from "hono/jsx";

interface LayoutProps {
  title: string;
  children?: Child;
}
export const Layout: FC<LayoutProps> = (props) => {
  const classes = {
    body: css`
      max-width: 800px;
      margin: auto;
    `,
    a: css`
      margin-inline-end: 1rem;
    `,
  };

  return html`<!DOCTYPE html>${(
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>{props.title} | Push backend</title>
          {<Style />}
        </head>
        <body class={classes.body}>
          <h1>{props.title}</h1>
          <nav>
            <a class={classes.a} href="/">
              send notifications
            </a>
            <a class={classes.a} href="/subscriptions">
              list subscriptions
            </a>
          </nav>
          {props.children}
        </body>
      </html>
    )}`;
};
