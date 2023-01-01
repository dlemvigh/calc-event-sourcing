import { Global, Module } from '@nestjs/common';
import { EventStoreProvider } from './eventstore.provider';

@Global()
@Module({
  providers: [EventStoreProvider],
  exports: [EventStoreProvider],
})
export class EventStoreModule {}
