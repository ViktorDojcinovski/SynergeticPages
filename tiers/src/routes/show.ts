import { Request, Response, Router } from "express";

export const router = Router();

router.get("/api/tiers/:tierId", async (req: Request, res: Response) => {
  res.send({});
});

export { router as showTierRouter };
