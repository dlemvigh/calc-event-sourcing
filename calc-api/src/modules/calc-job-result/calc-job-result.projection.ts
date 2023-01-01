import { eventTypeFilter, START } from '@eventstore/db-client';
import { Injectable } from '@nestjs/common';
import {
  CalcJobCreatedEventType,
  CalcJobFinishedEventType,
  CalcJobEvent,
  CalcJobCreatedEvent,
  CalcJobFinishedEvent,
} from 'calc-shared';
import { EventStoreProvider } from '../../common/eventstore/eventstore.provider';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CalcJobResultProjection {
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
        prefixes: [CalcJobCreatedEventType, CalcJobFinishedEventType],
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
        const { jobId, input } = event.data as CalcJobCreatedEvent['data'];
        await this.prisma.calcJobResult.upsert({
          where: { id: jobId },
          create: { id: jobId, input },
          update: { input },
        });
        break;
      }
      case CalcJobFinishedEventType: {
        const { jobId, output } = event.data as CalcJobFinishedEvent['data'];
        await this.prisma.calcJobResult.update({
          where: { id: jobId },
          data: { output },
        });
        break;
      }
    }
  }
}
