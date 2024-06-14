import { FC } from "hono/jsx";
import { css } from "hono/css";
import { Layout } from "./Layout";

interface SendNotificationFormProps {
  form?: {
    message?: string | undefined;
    topic?: string | undefined;
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
            Topic
            <input class={inputClass} name="topic" value={props.form?.topic} />
          </label>
        </p>
        <p>
          <label>
            Notification message
            <textarea class={inputClass} name="message">
              {props.form?.message}
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
