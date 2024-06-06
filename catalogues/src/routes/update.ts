import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  requireAuth,
  NotFoundError,
  NotAuthorisedError,
} from "@synergeticpages/common";
import { Catalogue } from "../models/catalogue";
import { CatalogueUpdatedPublisher } from "../events/publishers/catalogue-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/catalogues/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("description").not().isEmpty().withMessage("Description is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const catalogue = await Catalogue.findById(req.params.id);

    if (!catalogue) {
      throw new NotFoundError();
    }

    if (catalogue.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }

    catalogue.set({
      title: req.body.title,
      description: req.body.description,
    });
    await catalogue.save();
    new CatalogueUpdatedPublisher(natsWrapper.client).publish({
      id: catalogue.id,
      title: catalogue.title,
      description: catalogue.description,
      userId: catalogue.userId,
      version: catalogue.version,
    });

    res.send(catalogue);
  }
);

export { router as updateCatalogueRouter };
