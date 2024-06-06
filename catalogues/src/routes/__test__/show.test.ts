import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

it("returns a 404 if the catalogue is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/catalogues/${id}`).send().expect(404);
});

it("returns the catalogue if the catalogue is found", async () => {
  const title = "asdasd";
  const description = "asdasd";

  const response = await request(app)
    .post("/api/catalogues")
    .set("Cookie", global.signin())
    .send({
      title,
      description,
    })
    .expect(201);

  console.log(response.body);

  const catalogueResponse = await request(app)
    .get(`/api/catalogues/${response.body.id}`)
    .send()
    .expect(200);

  expect(catalogueResponse.body.title).toEqual(title);
  expect(catalogueResponse.body.description).toEqual(description);
});
