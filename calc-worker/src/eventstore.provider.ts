import { EventStoreDBClient } from "@eventstore/db-client";

export const client = EventStoreDBClient.connectionString(
  "esdb://localhost:2113?tls=false"
);
