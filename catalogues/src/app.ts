import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// Routers
// import {} from "./routes";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@synergeticpages/common";
import {
  createCatalogueRouter,
  showCatalogueRouter,
  listCatalogueRouter,
  updateCatalogueRouter,
} from "./routes";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use(currentUser);

// Routes
app.use(listCatalogueRouter);
app.use(createCatalogueRouter);
app.use(showCatalogueRouter);
app.use(updateCatalogueRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

// Error handling
app.use(errorHandler);

export { app };
