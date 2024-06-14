import { FC } from "hono/jsx";
import { Layout } from "./Layout";
import { SubscriptionDbModel } from "../repositories/subscriptions";
import { css } from "hono/css";

interface SubscriptionsProps {
  subscriptions: SubscriptionDbModel[];
}
export const Subscriptions: FC<SubscriptionsProps> = (props) => {
  const classes = {
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
  };
  return (
    <Layout title="Subscriptions">
      <table class={classes.table}>
        <thead>
          <tr>
            <th>id</th>
            <th>data</th>
            <th>createdAt</th>
          </tr>
        </thead>
        <tbody>
          {props.subscriptions?.length ? (
            props.subscriptions.map((i) => (
              <tr>
                <td>{i.id}</td>
                <td>
                  <details>
                    <summary>{i.subscription.endpoint}</summary>
                    <code>
                      <pre>{JSON.stringify(i.subscription, undefined, 2)}</pre>
                    </code>
                  </details>
                </td>
                <td>{i.createdAt}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </Layout>
  );
};
