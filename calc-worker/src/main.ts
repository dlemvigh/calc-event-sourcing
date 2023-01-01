import { CalcEventHandler } from "./calc.eventhandler";
import { client } from "./eventstore.provider";
console.log("work work");

new Promise(async (resolve, reject) => {
  const eventhandler = new CalcEventHandler(client);
  await eventhandler.ensurePersistantSubscription();
  //   await eventhandler.dropCreatePersistantSubscription();
  eventhandler.subscribe();
});
