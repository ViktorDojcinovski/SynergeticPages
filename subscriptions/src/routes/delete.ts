import { Request, Response, Router } from "express";
import {
  NotAuthorisedError,
  NotFoundError,
  SubscriptionStatus,
  requireAuth,
} from "@synergeticpages/common";

import { Subscription } from "../models/subscription";
import { natsWrapper } from "../nats-wrapper";
import { SubscriptionCancelledPublisher } from "../events/publishers/subscription-cancelled-publisher";

const router = Router();

router.delete(
  "/api/subscriptions/:subscriptionId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      return new NotFoundError();
    }
    if (subscription.userId !== req.currentUser!.id) {
      return new NotAuthorisedError();
    }
    subscription.status = SubscriptionStatus.Cancelled;
    await subscription.save();

    new SubscriptionCancelledPublisher(natsWrapper.client).publish({
      id: subscription.id,
      tier: {
        id: subscription.tierId,
      },
    });

    res.status(204).send(subscription);
  }
);

export { router as deleteSubscriptionRouter };
