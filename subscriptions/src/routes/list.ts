import { Router, Request, Response } from "express";
import { requireAuth } from "@synergeticpages/common";

import { Subscription } from "../models/subscription";

export const router = Router();

router.get(
  "/api/subscriptions",
  requireAuth,
  async (req: Request, res: Response) => {
    const subscriptions = await Subscription.find({
      userId: req.currentUser!.id,
    });

    res.send(subscriptions);
  }
);

export { router as listSubscriptionRouter };
