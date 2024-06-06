import request from "supertest";
import mongoose from "mongoose";
import { SubscriptionStatus } from "@synergeticpages/common";

import { app } from "../../app";
import { Subscription } from "../../models/subscription";

it("returns 404 when purchasing a subscription that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "aslkjd",
      subscriptionId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns 401 when purchasing a subscription that does not belong to the user", async () => {
  const subscription = Subscription.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: SubscriptionStatus.Created,
    price: 20,
  });

  await subscription.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "aslkjd",
      subscriptionId: subscription.id,
    })
    .expect(401);
});

it("returns 400 when purchasing a cancelled subscription", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const subscription = Subscription.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    status: SubscriptionStatus.Cancelled,
    price: 20,
  });

  await subscription.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "aslkjd",
      subscriptionId: subscription.id,
    })
    .expect(400);
});
