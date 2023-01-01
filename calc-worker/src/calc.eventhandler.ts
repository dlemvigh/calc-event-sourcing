import {
  EventStoreDBClient,
  EVENT_TYPE,
  excludeSystemEvents,
  jsonEvent,
  START,
} from "@eventstore/db-client";
import {
  CalcJobCreatedEvent,
  CalcJobCreatedEventType,
  CalcJobFinishedEvent,
  CalcJobFinishedEventType,
  CalcJobStartedEvent,
  CalcJobStartedEventType,
} from "calc-shared";
import { factorial } from "./calc.provider";

export class CalcEventHandler {
  constructor(private readonly eventstore: EventStoreDBClient) {}

  async subscribe() {
    const subscription = this.eventstore.subscribeToAll({
      fromPosition: START,
      filter: {
        filterOn: EVENT_TYPE,
        prefixes: [CalcJobCreatedEventType],
        checkpointInterval: 1,
      },
    });

    for await (const eventHandle of subscription) {
      console.log(
        "work handle",
        eventHandle.event.type,
        eventHandle.event.data
      );
      await this.handleEvent(eventHandle?.event as any);
    }
  }

  async handleEvent(event: CalcJobCreatedEvent): Promise<void> {
    const { jobId, input } = event.data;

    await this.sendJobStartedEvent(jobId);
    const output = factorial(input);
    await this.sendJobFinishedEvent(jobId, Number(output));
  }

  async sendJobStartedEvent(jobId: string) {
    const startedAt = new Date();
    const event = jsonEvent<CalcJobStartedEvent>({
      type: CalcJobStartedEventType,
      data: {
        jobId,
        startedAt,
      },
    });
    return this.eventstore.appendToStream(jobId, event);
  }

  async sendJobFinishedEvent(jobId: string, output: number) {
    const finishedAt = new Date();
    const event = jsonEvent<CalcJobFinishedEvent>({
      type: CalcJobFinishedEventType,
      data: {
        jobId,
        output,
        finishedAt,
      },
    });
    return this.eventstore.appendToStream(jobId, event);
  }
}
