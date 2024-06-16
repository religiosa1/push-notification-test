import { FC } from "hono/jsx";
import { css } from "hono/css";
import { Layout } from "./Layout";

interface SendNotificationFormProps {
  form?: {
    title?: string | undefined;
    body?: string | undefined;
  };
  result?: "success" | "error";
}
export const SendNotificationForm: FC<SendNotificationFormProps> = (props) => {
  const inputClass = css`
    display: block;
  `;

  return (
    <Layout title="Send Notifications">
      <form method="POST">
        <p>
          <label>
            Title
            <input class={inputClass} name="title" value={props.form?.title} />
          </label>
        </p>
        <p>
          <label>
            Notification Body
            <textarea class={inputClass} name="body">
              {props.form?.body}
            </textarea>
          </label>
        </p>
        <p>
          <button>Send notifications</button>
        </p>
        {props.result === "success" ? (
          <p>Sent notification messages</p>
        ) : props.result === "error" ? (
          <div>
            <p>Error during the submission</p>
          </div>
        ) : null}
      </form>
    </Layout>
  );
};
