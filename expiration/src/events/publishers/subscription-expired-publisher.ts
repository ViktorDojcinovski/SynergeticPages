import {
  Publisher,
  Subjects,
  SubscriptionExpiredEvent,
} from "@synergeticpages/common";

export class SubscriptionExpiredPublisher extends Publisher<SubscriptionExpiredEvent> {
  subject: Subjects.SubscriptionExpired = Subjects.SubscriptionExpired;
}
