import mongoose from "mongoose";
import { Router, Request, Response } from "express";
import {
  NotFoundError,
  SubscriptionStatus,
  requireAuth,
  validateRequest,
} from "@synergeticpages/common";
import { body } from "express-validator";
import { Tier } from "../models/tier";
import { Subscription } from "../models/subscription";
import { natsWrapper } from "../nats-wrapper";
import { SubscriptionCreatedPublisher } from "../events/publishers/subscription-created-publisher";

export const router = Router();

router.post(
  "/api/subscriptions",
  requireAuth,
  [
    body("tierId")
      .not()
      .isEmpty()
      .custom((input: string) => {
        return mongoose.Types.ObjectId.isValid(input);
      })
      .withMessage("Tier ID is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { tierId } = req.body;

    const tier = await Tier.findById(tierId);
    if (!tier) {
      throw new NotFoundError();
    }

    const subscription = Subscription.build({
      userId: req.currentUser!.id,
      tierId,
      status: SubscriptionStatus.Created,
      expiresAt: new Date(),
    });

    await subscription.save();

    new SubscriptionCreatedPublisher(natsWrapper.client).publish({
      id: subscription.id,
      userId: subscription.userId,
      status: subscription.status,
      expiresAt: subscription.expiresAt.toISOString(),
      tier: {
        id: subscription.tierId,
        title: tier.title,
        price: tier.price,
      },
    });

    res.status(201).send(subscription);
  }
);

export { router as createSubscriptionRouter };
