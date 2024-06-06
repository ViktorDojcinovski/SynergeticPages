import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface CatalogueAttrs {
  title: string;
  description: string;
  userId: string;
}

interface CatalogueDoc extends mongoose.Document {
  title: string;
  description: string;
  userId: string;
  version: number;
}

interface CatalogueModel extends mongoose.Model<CatalogueDoc> {
  build(attrs: CatalogueAttrs): CatalogueDoc;
}

const catalogueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

catalogueSchema.set("versionKey", "version");
catalogueSchema.plugin(updateIfCurrentPlugin);

catalogueSchema.statics.build = (attrs: CatalogueAttrs) => {
  return new Catalogue(attrs);
};

const Catalogue = mongoose.model<CatalogueDoc, CatalogueModel>(
  "Catalogue",
  catalogueSchema
);

export { Catalogue };
