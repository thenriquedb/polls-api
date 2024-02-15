import { PollRepository } from "../../repository/poll-repository";
import { CreatePollUseCase } from './create-poll';

export function makeCreatePollUseCase() {
  const pollRepository = new PollRepository();
  const createPoll = new CreatePollUseCase(pollRepository);
  return createPoll;
}