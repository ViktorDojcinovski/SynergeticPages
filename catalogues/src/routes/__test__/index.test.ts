import request from "supertest";
import { app } from "../../app";

const createCatalogue = () => {
  return request(app)
    .post("/api/catalogues")
    .set("Cookie", global.signin())
    .send({
      title: "asdasd",
      description: "asdasd",
    });
};

it("can fetch a list of catalogues", async () => {
  await createCatalogue();
  await createCatalogue();
  await createCatalogue();

  const response = await request(app).get("/api/catalogues").send().expect(200);

  expect(response.body.length).toEqual(3);
});
