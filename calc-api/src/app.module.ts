import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { EventStoreProvider } from './providers/eventstore.provider';
import { AppService } from './services/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EventStoreProvider],
})
export class AppModule {}
