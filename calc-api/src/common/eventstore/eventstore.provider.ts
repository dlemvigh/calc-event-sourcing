import { EventStoreDBClient } from '@eventstore/db-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventStoreProvider {
  public readonly client: EventStoreDBClient;
  constructor() {
    this.client = EventStoreDBClient.connectionString(
      process.env.ESDB_CONNECTION_STRING || 'esdb://localhost:2113?tls=false',
    );
  }
}
