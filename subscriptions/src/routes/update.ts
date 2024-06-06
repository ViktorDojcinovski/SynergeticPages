import { Router, Request, Response } from "express";

const router = Router();

router.put(
  "/api/subscriptions/:subscriptionId",
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as updateSubscriptionRouter };
