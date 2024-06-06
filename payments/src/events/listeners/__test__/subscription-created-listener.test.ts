import mongoose from "mongoose";
import {
  SubscriptionCreatedEvent,
  SubscriptionStatus,
} from "@synergeticpages/common";

import { natsWrapper } from "../../../nats-wrapper";
import { SubscriptionCreatedListener } from "../subscription-created-listener";
import { Subscription } from "../../../models/subscription";

const setup = async () => {
  const listener = new SubscriptionCreatedListener(natsWrapper.client);

  const data: SubscriptionCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "alksjdhdg",
    status: SubscriptionStatus.Created,
    expiresAt: new Date().toISOString(),
    tier: {
      id: "aoijcasijoj",
      title: "Tier 1",
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the subscription info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const subscription = await Subscription.findById(data.id);

  expect(subscription!.price).toEqual(data.tier.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
