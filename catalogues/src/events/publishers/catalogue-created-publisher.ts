import {
  Publisher,
  Subjects,
  CatalogueCreatedEvent,
} from "@synergeticpages/common";

export class CatalogueCreatedPublisher extends Publisher<CatalogueCreatedEvent> {
  subject: Subjects.CatalogueCreated = Subjects.CatalogueCreated;
}
