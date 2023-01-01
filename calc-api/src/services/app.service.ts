import { Injectable } from '@nestjs/common';
import { EventStoreProvider } from '../providers/eventstore.provider';

@Injectable()
export class AppService {
  constructor(private readonly eventstore: EventStoreProvider) {}

  getHello(): string {
    return 'Hello World!';
  }
}
