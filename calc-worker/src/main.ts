import { CalcEventHandler } from "./calc.eventhandler";
import { client } from "./eventstore.provider";
console.log("work work");

const eventhandler = new CalcEventHandler(client);
eventhandler.subscribe();
