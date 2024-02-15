import { RedisSingleton } from '../../infra/storage/redis';
import { PollRepository } from '../../repository/poll-repository';
import { GetPollUseCase } from './get-poll';

export function makeGetPollUseCase() {
  const redis = RedisSingleton.getInstance();
  const pollRepository = new PollRepository();
  const getPollUseCase = new GetPollUseCase(pollRepository, redis);

  return getPollUseCase;
}