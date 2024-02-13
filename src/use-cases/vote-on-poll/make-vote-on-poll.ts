import { RedisSingleton } from '../../infra/storage/redis';
import { VoteRepository } from '../../repository/vote-repository';
import { VotingPubSub } from '../../util/voting-pub-sub';
import { VoteOnPollUseCase } from './vote-on-poll';

export function makeVoteOnPollUseCase() {
  const redis = RedisSingleton.getInstance();
  const voteRepository = new VoteRepository();
  const votingPubSub = new VotingPubSub();

  const voteOnPollUseCase = new VoteOnPollUseCase(
    voteRepository,
    votingPubSub,
    redis);

  return voteOnPollUseCase;
}