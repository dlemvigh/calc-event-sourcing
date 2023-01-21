import { EventStoreDBClient } from "@eventstore/db-client";

export const client: EventStoreDBClient = EventStoreDBClient.connectionString(
  process.env.ESDB_CONNECTION_STRING || "esdb://localhost:2113?tls=false"
);
