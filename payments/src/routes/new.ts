import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorisedError,
  SubscriptionStatus,
} from "@synergeticpages/common";
import { body } from "express-validator";
import { stripe } from "../stripe";

import { Subscription } from "../models/subscription";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("subscriptionId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log("Creating charge");
    const { token, subscriptionId } = req.body;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new NotFoundError();
    }
    if (subscription.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }
    if (subscription.status === SubscriptionStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled subscription");
    }

    await stripe.charges.create({
      currency: "eur",
      amount: subscription.price * 100,
      source: token,
    });

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
