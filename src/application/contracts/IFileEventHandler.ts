export interface IFileEventHandler {
  handle({ fileKey }: IFileEventHandler.Input): Promise<void>;
}

export namespace IFileEventHandler {
  export type Input = {
    fileKey: string;
  };
}
