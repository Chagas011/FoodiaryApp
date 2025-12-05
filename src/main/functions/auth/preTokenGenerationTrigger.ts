import { PreTokenGenerationV2TriggerEvent } from "aws-lambda";
import "reflect-metadata";

export async function handler(event: PreTokenGenerationV2TriggerEvent) {
  event.response = {
    claimsAndScopeOverrideDetails: {
      accessTokenGeneration: {
        claimsToAddOrOverride: {
          internalId: event.request.userAttributes["custom:internalId"],
        },
      },
    },
  };

  return event;
}
