import { EventStoreDBClient } from '@eventstore/db-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventStoreProvider {
  public readonly client: EventStoreDBClient;
  constructor() {
    this.client = EventStoreDBClient.connectionString(
      'esdb://localhost:2113?tls=false',
    );
  }
}
