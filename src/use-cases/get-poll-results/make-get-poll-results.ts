import { votingPubSub } from '../../util/voting-pub-sub';
import { GetPollResultsUseCase } from './get-poll-results';

export function makeGetPollResults() {
  const getPollResultsUseCase = new GetPollResultsUseCase(votingPubSub);

  return getPollResultsUseCase;
}