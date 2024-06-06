import mongoose from "mongoose";

interface SubscriptionAttrs {
  id: string;
  userId: string;
  status: string;
  expiresAt: Date;
}

interface SubscriptionDoc extends mongoose.Document {
  id: string;
  userId: string;
  status: string;
  expiresAt: Date;
}

interface SubscriptionModel extends mongoose.Model<SubscriptionDoc> {
  build(attrs: SubscriptionAttrs): SubscriptionDoc;
}

const subscriptionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    status: {
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
