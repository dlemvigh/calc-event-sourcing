import { jsonEvent } from '@eventstore/db-client';
import { Injectable } from '@nestjs/common';

import {
  CalcJobCreatedEventType,
  // CalcJobRetryEvent,
  // CalcJobRetryEventType,
} from 'calc-shared';
import { EventStoreProvider } from '../../common/eventstore/eventstore.provider';

@Injectable()
export class CalcJobService {
  constructor(private readonly eventstore: EventStoreProvider) {}

  async createJob(jobId: string, input: number, createdAt: Date) {
    const event = jsonEvent({
      type: CalcJobCreatedEventType,
      data: {
        jobId,
        input,
        createdAt,
      },
    });

    await this.eventstore.client.appendToStream(jobId, event);

    return event.data;
  }

  // async retryJob(jobId: string, retryAt: Date) {
  //   const event = jsonEvent({
  //     type: CalcJobRetryEventType,
  //     data: {
  //       jobId,
  //       retryAt,
  //     },
  //   });

  //   await this.eventstore.client.appendToStream(jobId, event);

  //   return event.data;
  // }
}
