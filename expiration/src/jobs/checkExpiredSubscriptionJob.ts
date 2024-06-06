// checkExpiredSubscriptionsJob.ts
import cron from "node-cron";

import { Subscription } from "../models/subscrition";
import { natsWrapper } from "../nats-wrapper";
import { SubscriptionExpiredPublisher } from "../events/publishers/subscription-expired-publisher";

export const startCheckExpiredSubscriptionsJob = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log("Running a job at 01:00 at America/Sao_Paulo timezone");

      const subscriptions = await Subscription.find({});

      subscriptions.forEach(async (subscription) => {
        if (
          new Date(subscription.expiresAt).getTime() <= new Date().getTime()
        ) {
          new SubscriptionExpiredPublisher(natsWrapper.client).publish({
            id: subscription.id,
          });
        }
      });
    },
    {
      scheduled: true,
      timezone: "America/Sao_Paulo",
    }
  );
};
