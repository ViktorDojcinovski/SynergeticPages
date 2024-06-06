import {
  Publisher,
  SubscriptionCancelledEvent,
  Subjects,
} from "@synergeticpages/common";

export class SubscriptionCancelledPublisher extends Publisher<SubscriptionCancelledEvent> {
  subject: Subjects.SubscriptionCancelled = Subjects.SubscriptionCancelled;
}
