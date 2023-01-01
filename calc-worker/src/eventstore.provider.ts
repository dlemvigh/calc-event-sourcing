import { EventStoreDBClient } from "@eventstore/db-client";

export const client: EventStoreDBClient = EventStoreDBClient.connectionString(
  "esdb://localhost:2113?tls=false"
);
