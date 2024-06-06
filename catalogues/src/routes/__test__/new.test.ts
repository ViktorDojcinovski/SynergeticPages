import request from "supertest";
import { app } from "../../app";
import { Catalogue } from "../../models/catalogue";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/catalogues for post requests", async () => {
  const response = await request(app).post("/api/catalogues").send({});

  expect(response.status).not.toEqual(404);
});

it("only can be accessed if the user is signed in", async () => {
  await request(app).post("/api/catalogues").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/catalogues")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {
  await request(app)
    .post("/api/catalogues")
    .set("Cookie", global.signin())
    .send({
      title: "",
      description: "asdasd",
    })
    .expect(400);

  await request(app)
    .post("/api/catalogues")
    .set("Cookie", global.signin())
    .send({
      description: "asdasd",
    })
    .expect(400);
});

it("creates a catalogue if provided valid parameters", async () => {
  let catalogues = await Catalogue.find({});
  expect(catalogues.length).toEqual(0);

  await request(app)
    .post("/api/catalogues")
    .set("Cookie", global.signin())
    .send({
      title: "asdasd",
      description: "asdasd",
    })
    .expect(201);

  catalogues = await Catalogue.find({});
  expect(catalogues.length).toEqual(1);
});

it("publishes an event", async () => {
  await request(app)
    .post("/api/catalogues")
    .set("Cookie", global.signin())
    .send({
      title: "asdasd",
      description: "asdasd",
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
