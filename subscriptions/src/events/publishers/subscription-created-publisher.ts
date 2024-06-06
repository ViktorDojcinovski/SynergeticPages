import {
  Publisher,
  SubscriptionCreatedEvent,
  Subjects,
} from "@synergeticpages/common";

export class SubscriptionCreatedPublisher extends Publisher<SubscriptionCreatedEvent> {
  subject: Subjects.SubscriptionCreated = Subjects.SubscriptionCreated;
}
