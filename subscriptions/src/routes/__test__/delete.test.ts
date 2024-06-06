import request from "supertest";
import { SubscriptionStatus } from "@synergeticpages/common";

import { app } from "../../app";
import { Subscription } from "../../models/subscription";
import { Tier } from "../../models/tier";
import { natsWrapper } from "../../nats-wrapper";
import { SubscriptionCancelledPublisher } from "../../events/publishers/subscription-cancelled-publisher";

it("marks a subscription as cancelled", async () => {
  const cookie = global.signin();

  const tier = Tier.build({
    title: "silver",
    price: 20,
  });
  await tier.save();

  const { body: subscription } = await request(app)
    .post(`/api/subscriptions/`)
    .set("Cookie", cookie)
    .send({ tierId: tier.id })
    .expect(201);

  await request(app)
    .delete(`/api/subscriptions/${subscription.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(204);

  const updatedSubscription = await Subscription.findById(subscription.id);
  expect(updatedSubscription!.status).toEqual(SubscriptionStatus.Cancelled);
});

it("emits an event when a subscription is cancelled", async () => {
  const cookie = global.signin();

  const tier = Tier.build({
    title: "silver",
    price: 20,
  });
  await tier.save();

  const { body: subscription } = await request(app)
    .post(`/api/subscriptions/`)
    .set("Cookie", cookie)
    .send({ tierId: tier.id })
    .expect(201);

  await request(app)
    .delete(`/api/subscriptions/${subscription.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
