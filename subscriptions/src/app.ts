import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// Routers
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@synergeticpages/common";
import {
  createSubscriptionRouter,
  showSubscriptionRouter,
  listSubscriptionRouter,
  updateSubscriptionRouter,
  deleteSubscriptionRouter,
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
app.use(listSubscriptionRouter);
app.use(createSubscriptionRouter);
app.use(showSubscriptionRouter);
app.use(updateSubscriptionRouter);
app.use(deleteSubscriptionRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

// Error handling
app.use(errorHandler);

export { app };
