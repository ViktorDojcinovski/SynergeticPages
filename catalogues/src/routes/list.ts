import express, { Request, Response } from "express";
import { Catalogue } from "../models/catalogue";

const router = express.Router();

router.get("/api/catalogues", async (req: Request, res: Response) => {
  const catalogues = await Catalogue.find({});

  res.send(catalogues);
});

export { router as listCatalogueRouter };
