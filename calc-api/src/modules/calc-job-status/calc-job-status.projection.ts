import { eventTypeFilter, START } from '@eventstore/db-client';
import { Injectable } from '@nestjs/common';
import {
  CalcJobCreatedEventType,
  CalcJobStartedEventType,
  CalcJobFinishedEventType,
  CalcJobEvent,
  CalcJobStartedEvent,
  CalcJobCreatedEvent,
  CalcJobFinishedEvent,
} from 'calc-shared';
import { EventStoreProvider } from '../../common/eventstore/eventstore.provider';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CalcJobStatusProjection {
  constructor(
    private readonly eventstore: EventStoreProvider,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    this.subscribe();
  }

  async subscribe() {
    const subscription = this.eventstore.client.subscribeToAll({
      fromPosition: START,
      filter: eventTypeFilter({
        prefixes: [
          CalcJobCreatedEventType,
          CalcJobStartedEventType,
          CalcJobFinishedEventType,
        ],
      }),
    });

    for await (const eventHandle of subscription) {
      await this.handleEvent(eventHandle?.event as any);
    }
  }

  async handleEvent(event: CalcJobEvent) {
    // console.log('handle event', event.type);
    switch (event.type) {
      case CalcJobCreatedEventType: {
        const { jobId, createdAt } = event.data as CalcJobCreatedEvent['data'];
        await this.prisma.calcJobStatus.upsert({
          where: { id: jobId },
          create: { id: jobId, createdAt },
          update: { createdAt },
        });
        break;
      }
      case CalcJobStartedEventType: {
        const { jobId, startedAt } = event.data as CalcJobStartedEvent['data'];
        await this.prisma.calcJobStatus.update({
          where: { id: jobId },
          data: { startedAt },
        });
        break;
      }
      case CalcJobFinishedEventType: {
        const { jobId, finishedAt } =
          event.data as CalcJobFinishedEvent['data'];
        await this.prisma.calcJobStatus.update({
          where: { id: jobId },
          data: { finishedAt },
        });
        break;
      }
    }
  }
}
