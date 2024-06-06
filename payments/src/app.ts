import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// Routers
import { createChargeRouter } from "./routes";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@synergeticpages/common";

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

app.use(createChargeRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

// Error handling
app.use(errorHandler);

export { app };
