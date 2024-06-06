import { Router, Request, Response } from "express";

export const router = Router();

router.post("/api/tiers", async (req: Request, res: Response) => {
  res.send({});
});

export { router as createTierRouter };
