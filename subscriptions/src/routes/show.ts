import { Request, Response, Router } from "express";
import {
  NotAuthorisedError,
  NotFoundError,
  requireAuth,
} from "@synergeticpages/common";

import { Subscription } from "../models/subscription";

export const router = Router();

router.get(
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

    res.send(subscription);
  }
);

export { router as showSubscriptionRouter };
