import {
  Publisher,
  Subjects,
  CatalogueUpdatedEvent,
} from "@synergeticpages/common";

export class CatalogueUpdatedPublisher extends Publisher<CatalogueUpdatedEvent> {
  subject: Subjects.CatalogueUpdated = Subjects.CatalogueUpdated;
}
