import { Catalogue } from "../catalogue";

it("implements optimistic concurrency control", async () => {
  // Create an instance of a catalogue
  const catalogue = Catalogue.build({
    title: "concert",
    description: "description",
    userId: "123",
  });

  // save the catalogue to the database
  await catalogue.save();

  // fetch the catalogue twice
  const firstInstance = await Catalogue.findById(catalogue.id);
  const secondInstance = await Catalogue.findById(catalogue.id);

  // make two separate changes to the catalogues we fetched
  firstInstance!.set({ description: "new description" });
  secondInstance!.set({ description: "new description" });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const catalogue = Catalogue.build({
    title: "concert",
    description: "description",
    userId: "123",
  });

  await catalogue.save();
  expect(catalogue.version).toEqual(0);
  await catalogue.save();
  expect(catalogue.version).toEqual(1);
  await catalogue.save();
  expect(catalogue.version).toEqual(2);
});
