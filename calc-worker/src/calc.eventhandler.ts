import {
  EventStoreDBClient,
  eventTypeFilter,
  EVENT_TYPE,
  jsonEvent,
  PersistentSubscriptionExistsError,
  persistentSubscriptionToAllSettingsFromDefaults,
  START,
} from "@eventstore/db-client";
import {
  CalcJobCreatedEvent,
  CalcJobCreatedEventType,
  CalcJobFinishedEventType,
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
      console.log("event subscription created");
    } catch (e) {
      if (e instanceof PersistentSubscriptionExistsError) {
        // Subscription already exists
        console.log("event subscription exists");
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
      await this.handleEvent(eventHandle?.event as any);
      await subscription.ack(eventHandle);
    }
  }

  async handleEvent(event: CalcJobCreatedEvent): Promise<void> {
    const { jobId, input } = event.data;
    console.log("received", event);
    const jobStartedEvent = await this.sendJobStartedEvent(jobId);
    console.log("sent", jobStartedEvent);
    const output = factorial(input);
    const jobFinishedEvent = await this.sendJobFinishedEvent(
      jobId,
      Number(output)
    );
    console.log("sent", jobFinishedEvent);
  }

  async sendJobStartedEvent(jobId: string) {
    const startedAt = new Date();
    const event = jsonEvent({
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
    const event = jsonEvent({
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
