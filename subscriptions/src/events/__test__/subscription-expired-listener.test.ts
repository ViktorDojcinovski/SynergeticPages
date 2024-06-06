import mongoose from "mongoose";
import {
  SubscriptionStatus,
  SubscriptionExpiredEvent,
} from "@synergeticpages/common";
import { SubscriptionExpiredListener } from "../listeners/subscription-expired-listener";
import { natsWrapper } from "../../nats-wrapper";

import { Subscription } from "../../models/subscription";

const setup = async () => {
  const listener = new SubscriptionExpiredListener(natsWrapper.client);

  const subscription = Subscription.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: SubscriptionStatus.Created,
    expiresAt: new Date(),
    tierId: new mongoose.Types.ObjectId().toHexString(),
  });

  await subscription.save();

  const data: SubscriptionExpiredEvent["data"] = {
    id: subscription.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, subscription, data, msg };
};

it("updates the status of the subscription", async () => {
  const { listener, subscription, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedSubscription = await Subscription.findById(subscription.id);

  expect(updatedSubscription!.status).toEqual(SubscriptionStatus.Cancelled);
});

it("publishes a subscription cancelled event", async () => {
  const { listener, subscription, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(subscription.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
