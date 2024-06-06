import { Message } from "node-nats-streaming";
import {
  Listener,
  SubscriptionCreatedEvent,
  Subjects,
} from "@synergeticpages/common";

import queueGroupName from "./queue-group-name";
import { Subscription } from "../../models/subscrition";

export class SubscriptionCreatedListener extends Listener<SubscriptionCreatedEvent> {
  subject: Subjects.SubscriptionCreated = Subjects.SubscriptionCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: SubscriptionCreatedEvent["data"], msg: Message) {
    console.log("Event data!", data);

    const subscription = Subscription.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      expiresAt: new Date(data.expiresAt),
    });

    await subscription.save();

    msg.ack();
  }
}
