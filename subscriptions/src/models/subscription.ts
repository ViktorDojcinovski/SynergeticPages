import mongoose from "mongoose";
import { SubscriptionStatus } from "@synergeticpages/common";

interface SubscriptionAttrs {
  userId: string;
  status: SubscriptionStatus;
  expiresAt: Date;
  tierId: string;
}

interface SubscriptionDoc extends mongoose.Document {
  userId: string;
  status: SubscriptionStatus;
  expiresAt: Date;
  tierId: string;
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
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    tierId: {
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

subscriptionSchema.statics.build = (attrs: SubscriptionAttrs) => {
  return new Subscription(attrs);
};

const Subscription = mongoose.model<SubscriptionDoc, SubscriptionModel>(
  "Subscription",
  subscriptionSchema
);

export { Subscription };
