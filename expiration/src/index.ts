import mongoose from "mongoose";

import { natsWrapper } from "./nats-wrapper";
import { SubscriptionCreatedListener } from "./events/listeners/subscription-created-listener";
import { startCheckExpiredSubscriptionsJob } from "./jobs/checkExpiredSubscriptionJob";

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }

  try {
    await natsWrapper.connect(
      "synergeticpages",
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    new SubscriptionCreatedListener(natsWrapper.client).listen();
    startCheckExpiredSubscriptionsJob();
  } catch (err) {
    console.error(err);
  }
};

start();
