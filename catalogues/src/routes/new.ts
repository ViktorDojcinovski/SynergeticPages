import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@synergeticpages/common";
import { body } from "express-validator";

import { Catalogue } from "../models/catalogue";
import { CatalogueCreatedPublisher } from "../events/publishers/catalogue-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/catalogues",
  requireAuth,
  [body("title").not().isEmpty().withMessage("Title is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, description } = req.body;

    const catalogue = Catalogue.build({
      title,
      description,
      userId: req.currentUser!.id,
    });

    await catalogue.save();
    await new CatalogueCreatedPublisher(natsWrapper.client).publish({
      id: catalogue.id,
      title: catalogue.title,
      description: catalogue.description,
      userId: catalogue.userId,
      version: catalogue.version,
    });

    res.status(201).send(catalogue);
  }
);

export { router as createCatalogueRouter };
