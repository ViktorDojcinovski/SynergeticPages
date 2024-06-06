import mongoose from "mongoose";

interface TierAttrs {
  title: string;
  price: number;
}

interface TierDoc extends mongoose.Document {
  title: string;
  price: number;
}

interface TierModel extends mongoose.Model<TierDoc> {
  build(attrs: TierAttrs): TierDoc;
}

const tierSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
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

tierSchema.statics.build = (attrs: TierAttrs) => {
  return new Tier(attrs);
};

const Tier = mongoose.model<TierDoc, TierModel>("Tier", tierSchema);

export { Tier };
