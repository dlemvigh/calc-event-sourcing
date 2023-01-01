// import { JSONEventType } from '@eventstore/db-client';

// export const CalcJobCreatedEventType = 'CalcJobCreated';
// export const CalcJobStartedEventType = 'CalcJobStarted';
// export const CalcJobFinishedEventType = 'CalcJobFinished';

// export type CalcJobCreatedEvent = JSONEventType<
//   typeof CalcJobCreatedEventType,
//   {
//     jobId: string;
//     input: number;
//     createdAt: Date;
//   }
// >;

// export type CalcJobStartedEvent = JSONEventType<
//   typeof CalcJobStartedEventType,
//   {
//     jobId: string;
//     startedAt: Date;
//   }
// >;

// export type CalcJobFinishedEvent = JSONEventType<
//   typeof CalcJobFinishedEventType,
//   {
//     jobId: string;
//     output: number;
//     finishedAt: Date;
//   }
// >;

// export type CalcJobEvent =
//   | CalcJobCreatedEvent
//   | CalcJobStartedEvent
//   | CalcJobFinishedEvent;
