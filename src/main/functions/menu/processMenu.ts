import "reflect-metadata";

import { MenuQueueConsumer } from "@/application/queues/MenuQueueConsumer";
import { lambdaSQSAdapter } from "@/main/adapter/lambdaSQSAdapter";

export const handler = lambdaSQSAdapter(MenuQueueConsumer);
