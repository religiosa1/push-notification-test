import { FC } from "hono/jsx";
import { Layout } from "./Layout";
import { PushSubscriptionDbModel } from "../repositories/subscriptions";
import { css } from "hono/css";
import { MaxWidthPreview } from "./MaxWidthPreview";
import { format } from "date-fns/format";

interface SubscriptionsProps {
  subscriptions: PushSubscriptionDbModel[];
}
export const Subscriptions: FC<SubscriptionsProps> = (props) => {
  const classes = {
    tableResponsive: css`
      overflow-x: auto;
      width: 100%;
    `,
    table: css`
      border-collapse: collapse;
      width: 100%;
      margin: 1rem 0;
      td,
      th {
        border: 1px solid gray;
        padding: 5px;
      }
    `,
    emptyCell: css`
      text-align: center;
    `,
  };
  return (
    <Layout title="Subscriptions">
      <div className={classes.tableResponsive}>
        <table class={classes.table}>
          <thead>
            <tr>
              <th>id</th>
              <th>endpoint</th>
              <th>keys</th>
              <th>expirationTime</th>
              <th>createdAt</th>
              <th>modifiedAt</th>
              <th>delete</th>
            </tr>
          </thead>
          <tbody>
            {props.subscriptions?.length ? (
              props.subscriptions.map((i) => (
                <tr>
                  <td>{i.id}</td>
                  <td>
                    <MaxWidthPreview>{i.endpoint}</MaxWidthPreview>
                  </td>
                  <td>
                    <details>
                      <summary>keys</summary>
                      <dl>
                        <dt>p256dh</dt>
                        <dd>{i.p256dh}</dd>
                        <dt>auth</dt>
                        <dd>{i.auth}</dd>
                      </dl>
                    </details>
                  </td>
                  <td>{formatDateTime(i.expirationTime)}</td>
                  <td>{formatDateTime(i.createdAt)}</td>
                  <td>{formatDateTime(i.modifiedAt)}</td>
                  <td>
                    <form method="POST">
                      <input type="hidden" name="id" value={i.id} />
                      <button>Delete</button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} class={classes.emptyCell}>
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

function formatDateTime(date: Date | null | undefined): string {
  if (date == null) {
    return "";
  }
  return format(date, "yyyy-MM-dd HH:mm:ss");
}
