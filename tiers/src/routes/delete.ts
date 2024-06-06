import { Request, Response, Router } from "express";

const router = Router();

router.delete("/api/tiers/:tierId", async (req: Request, res: Response) => {
  res.send({});
});

export { router as deleteTierRouter };
