import "reflect-metadata";

import { MealsQueueConsumer } from "@/application/queues/MealsQueueConsumer";
import { lambdaSQSAdapter } from "@/main/adapter/lambdaSQSAdapter";

export const handler = lambdaSQSAdapter(MealsQueueConsumer);
