import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Tier } from "../../models/tier";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the tier does not exist", async () => {
  await request(app)
    .post("/api/subscriptions")
    .set("Cookie", global.signin())
    .send({
      tierId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns an error if the tierId is not provided", async () => {
  await request(app)
    .post("/api/subscriptions")
    .set("Cookie", global.signin())
    .send({})
    .expect(400);
});

it("creates a subscription with valid inputs", async () => {
  const cookie = global.signin();

  const tier = Tier.build({
    title: "silver",
    price: 20,
  });
  await tier.save();

  const response = await request(app)
    .post("/api/subscriptions")
    .set("Cookie", cookie)
    .send({
      tierId: tier.id,
    })
    .expect(201);

  expect(response.body.tierId).toBeDefined();
});

it("emits an event when a subscription is created", async () => {
  const cookie = global.signin();

  const tier = Tier.build({
    title: "silver",
    price: 20,
  });
  await tier.save();

  await request(app)
    .post("/api/subscriptions")
    .set("Cookie", cookie)
    .send({
      tierId: tier.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
