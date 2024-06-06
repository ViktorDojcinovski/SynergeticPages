import {
  Listener,
  SubscriptionExpiredEvent,
  Subjects,
  SubscriptionStatus,
} from "@synergeticpages/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Subscription } from "../../models/subscription";
import { SubscriptionCancelledPublisher } from "../publishers/subscription-cancelled-publisher";

export class SubscriptionExpiredListener extends Listener<SubscriptionExpiredEvent> {
  subject: Subjects.SubscriptionExpired = Subjects.SubscriptionExpired;
  queueGroupName = queueGroupName;

  async onMessage(data: SubscriptionExpiredEvent["data"], msg: Message) {
    console.log("Event data!", data);

    const subscription = await Subscription.findById(data.id);

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    subscription?.set({
      status: SubscriptionStatus.Cancelled,
    });

    await subscription?.save();
    await new SubscriptionCancelledPublisher(this.client).publish({
      id: subscription.id,
      tier: {
        id: subscription.tierId,
      },
    });

    msg.ack();
  }
}
