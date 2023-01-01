import {
  EventStoreDBClient,
  eventTypeFilter,
  EVENT_TYPE,
  excludeSystemEvents,
  jsonEvent,
  PersistentSubscriptionExistsError,
  persistentSubscriptionToAllSettingsFromDefaults,
  START,
  streamNameFilter,
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

export const GROUP_NAME = "calc-workers";

export class CalcEventHandler {
  constructor(private readonly eventstore: EventStoreDBClient) {}

  async createPersistantSubscription() {
    await this.eventstore.createPersistentSubscriptionToAll(
      GROUP_NAME,
      persistentSubscriptionToAllSettingsFromDefaults({
        startFrom: START,
      }),
      {
        filter: eventTypeFilter({ prefixes: [CalcJobCreatedEventType] }),
      }
    );
  }

  async deletePersistantSubscription() {
    await this.eventstore.deletePersistentSubscriptionToAll(GROUP_NAME);
  }

  async ensurePersistantSubscription() {
    try {
      await this.createPersistantSubscription();
    } catch (e) {
      if (e instanceof PersistentSubscriptionExistsError) {
        // Subscription already exists
      } else {
        throw e;
      }
    }
  }

  async dropCreatePersistantSubscription() {
    await this.deletePersistantSubscription();
    await this.createPersistantSubscription();
  }

  async catchupSubcription() {
    return this.eventstore.subscribeToAll({
      fromPosition: START,
      filter: {
        filterOn: EVENT_TYPE,
        prefixes: [CalcJobCreatedEventType],
        checkpointInterval: 1,
      },
    });
  }

  async persistantSubscription() {
    return this.eventstore.subscribeToPersistentSubscriptionToAll(GROUP_NAME);
  }

  async subscribe() {
    // const subscription = await this.catchupSubcription();
    const subscription = await this.persistantSubscription();

    for await (const eventHandle of subscription) {
      // console.log(
      //   "work handle",
      //   eventHandle.event.type,
      //   eventHandle.event.data
      // );
      await this.handleEvent(eventHandle?.event as any);
      await subscription.ack(eventHandle);
      // console.log("ack");
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
