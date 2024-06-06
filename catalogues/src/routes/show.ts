import express, { Request, Response } from "express";
import { Catalogue } from "../models/catalogue";
import { NotFoundError } from "@synergeticpages/common";

const router = express.Router();

router.get("/api/catalogues/:id", async (req: Request, res: Response) => {
  const catalogue = await Catalogue.findById(req.params.id);

  if (!catalogue) {
    throw new NotFoundError();
  }

  res.send(catalogue);
});

export { router as showCatalogueRouter };
