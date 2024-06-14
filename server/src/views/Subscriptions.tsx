import { FC } from "hono/jsx";
import { Layout } from "./Layout";
import { SubscriptionDbModel } from "../repositories/subscriptions";

interface SubscriptionsProps {
  subscriptions: SubscriptionDbModel[];
}
export const Subscriptions: FC<SubscriptionsProps> = (props) => {
  return (
    <Layout title="Subscriptions">
      <table>
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
                  <code>
                    <pre>{JSON.stringify(i.subscription, undefined, 2)}</pre>
                  </code>
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
