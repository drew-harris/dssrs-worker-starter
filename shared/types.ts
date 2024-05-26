export enum JobType {
  EXAMPLE1 = "example1",
  FAKE_MESSAGE = "fakeMessage",
}

type BaseJob = {
  type: JobType;
};

export type ExampleJob = BaseJob & {
  type: JobType.EXAMPLE1;
  originalUrl: string;
};

export type PossibleJob = ExampleJob;
