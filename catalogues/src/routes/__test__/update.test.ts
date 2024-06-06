import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/catalogues/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "asdasd",
      description: "asdasd",
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/catalogues/${id}`)
    .send({
      title: "asdasd",
      description: "asdasd",
    })
    .expect(401);
});

it("returns a 401 if the user does not own the catalogue", async () => {
  const response = await request(app)
    .post("/api/catalogues")
    .set("Cookie", global.signin())
    .send({
      title: "asdasd",
      description: "asdasd",
    });

  await request(app)
    .put(`/api/catalogues/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "asdasd",
      description: "asdasd",
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or description", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/catalogues")
    .set("Cookie", cookie)
    .send({
      title: "asdasd",
      description: "asdasd",
    });

  await request(app)
    .put(`/api/catalogues/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      description: "asdasd",
    })
    .expect(400);

  await request(app)
    .put(`/api/catalogues/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "asdasd",
      description: "",
    })
    .expect(400);
});

it("updates the catalogue provided valid inputs", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/catalogues")
    .set("Cookie", cookie)
    .send({
      title: "asdasd",
      description: "asdasd",
    });

  await request(app)
    .put(`/api/catalogues/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      description: "new description",
    })
    .expect(200);

  const catalogueResponse = await request(app)
    .get(`/api/catalogues/${response.body.id}`)
    .send()
    .expect(200);

  expect(catalogueResponse.body.title).toEqual("new title");
  expect(catalogueResponse.body.description).toEqual("new description");
});

it("publishes an event", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/catalogues")
    .set("Cookie", cookie)
    .send({
      title: "asdasd",
      description: "asdasd",
    });

  await request(app)
    .put(`/api/catalogues/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      description: "new description",
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
