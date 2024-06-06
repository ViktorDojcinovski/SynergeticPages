import {
  SubscriptionCancelledEvent,
  Subjects,
  Listener,
  SubscriptionStatus,
} from "@synergeticpages/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Subscription } from "../../models/subscription";

export class SubscriptionCancelledListener extends Listener<SubscriptionCancelledEvent> {
  subject: Subjects.SubscriptionCancelled = Subjects.SubscriptionCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: SubscriptionCancelledEvent["data"], msg: Message) {
    console.log("Event data!", data);

    const subscription = await Subscription.findOne({
      _id: data.id,
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    subscription.set({
      status: SubscriptionStatus.Cancelled,
    });
    subscription.save();

    msg.ack();
  }
}
