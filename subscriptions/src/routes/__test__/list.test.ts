import request from "supertest";

import { app } from "../../app";
import { Tier } from "../../models/tier";
import { Subscription } from "../../models/subscription";
import { SubscriptionStatus } from "@synergeticpages/common";

const createTier = async (title: string, price: number) => {
  const tier = Tier.build({ title, price });
  await tier.save();

  return tier;
};

it("fetches the list of subscriptions for a particular user", async () => {
  // Create three different tiers
  const basicTier = await createTier("Basic", 10);
  const proTier = await createTier("Pro", 20);
  const premiumTier = await createTier("Premium", 30);

  const userOne = global.signin();
  const userTwo = global.signin();

  // Create a subscription for a user #1
  await request(app)
    .post("/api/subscriptions")
    .set("Cookie", userOne)
    .send({ tierId: basicTier.id })
    .expect(201);

  // Create a subscription for a user #2
  await request(app)
    .post("/api/subscriptions")
    .set("Cookie", userTwo)
    .send({ tierId: proTier.id })
    .expect(201);
  await request(app)
    .post("/api/subscriptions")
    .set("Cookie", userTwo)
    .send({ tierId: premiumTier.id })
    .expect(201);

  // Make a request to get the list of subscriptions for user #1
  const response = await request(app)
    .get("/api/subscriptions")
    .set("Cookie", userTwo)
    .expect(200);

  console.log("response.body", response.body);

  expect(response.body.length).toEqual(2);

  // Make a request to get the list of subscriptions for user #2
});
