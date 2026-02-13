import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/AppConfig";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "../clients/sqsClient";

@Injectable()
export class MenuQueueGateway {
  constructor(private readonly config: AppConfig) {}
  async publish(message: MenuQueueGateway.Message) {
    const command = new SendMessageCommand({
      QueueUrl: this.config.queue.menusQueue,
      MessageBody: JSON.stringify(message),
    });

    await sqsClient.send(command);
  }
}

export namespace MenuQueueGateway {
  export type Message = {
    accountId: string;
    menuId: string;
  };
}
