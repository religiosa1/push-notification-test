import webPush from "web-push";

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log(
    "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
      "environment variables. You can use the following ones:"
  );
  console.log(webPush.generateVAPIDKeys());
  process.exit(1);
}

let publicUrl = process.env.PUBLIC_URL;
if (!publicUrl) {
  console.log("You need to set PUBLIC_URL environment variable.");
  if (process.env.NODE_ENV !== "production") {
    console.log(
      "In production mode, process will be terminated. In dev mode we're falling back to localhost\n" +
        "Sending notifications won't be possible without the valid PUBLIC_URL and SSL certificate"
    );
  } else {
    process.exit(1);
  }
}

webPush.setVapidDetails(
  process.env.PUBLIC_URL ?? "https://localhost:3000/",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default webPush;
