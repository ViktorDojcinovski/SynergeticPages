import { Message } from "node-nats-streaming";
import {
  Listener,
  SubscriptionCreatedEvent,
  Subjects,
} from "@synergeticpages/common";

import { Subscription } from "../../models/subscription";
import { queueGroupName } from "./queue-group-name";

export class SubscriptionCreatedListener extends Listener<SubscriptionCreatedEvent> {
  subject: Subjects.SubscriptionCreated = Subjects.SubscriptionCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: SubscriptionCreatedEvent["data"], msg: Message) {
    console.log("Event data!", data);

    const subscription = Subscription.build({
      id: data.id,
      version: 0,
      userId: data.userId,
      status: data.status,
      price: data.tier.price,
    });

    await subscription.save();

    msg.ack();
  }
}
