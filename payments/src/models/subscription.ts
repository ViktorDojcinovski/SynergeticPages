import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { SubscriptionStatus } from "@synergeticpages/common";

interface SubscriptionAttrs {
  id: string;
  version: number;
  userId: string;
  status: SubscriptionStatus;
  price: number;
}

interface SubscriptionDoc extends mongoose.Document {
  version: number;
  userId: string;
  status: SubscriptionStatus;
  price: number;
}

interface SubscriptionModel extends mongoose.Model<SubscriptionDoc> {
  build(attrs: SubscriptionAttrs): SubscriptionDoc;
}

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
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

subscriptionSchema.set("versionKey", "version");
subscriptionSchema.plugin(updateIfCurrentPlugin);

subscriptionSchema.statics.build = (attrs: SubscriptionAttrs) => {
  return new Subscription({
    _id: attrs.id,
    version: attrs.version,
    userId: attrs.userId,
    status: attrs.status,
    price: attrs.price,
  });
};

const Subscription = mongoose.model<SubscriptionDoc, SubscriptionModel>(
  "Subscription",
  subscriptionSchema
);

export { Subscription };
