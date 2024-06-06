import { Router, Request, Response } from "express";

const router = Router();

router.put("/api/tiers/:tierId", async (req: Request, res: Response) => {
  res.send({});
});

export { router as updateTierRouter };
