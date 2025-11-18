import { ErrorCode } from "@/application/errors/ErrorCode";

interface ILambdaErrorResponseParams {
  statusCode: number;
  code: ErrorCode;
  message: any;
}

export function lambdaErrorResponse({
  code,
  statusCode,
  message,
}: ILambdaErrorResponseParams) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      error: {
        code,
        message,
      },
    }),
  };
}
