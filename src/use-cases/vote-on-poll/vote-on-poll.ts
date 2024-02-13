import { IRedis } from "../../infra/storage/redis";
import { IVotingPubSub } from "../../util/voting-pub-sub";
import { IVoteRepository } from "../../repository/vote-repository";
import { AppError } from "../../util/app-error";

type VoteOnPollInput = {
  pollId: string;
  pollOptionId: string;
  sessionId: string;
}

export class VoteOnPollUseCase {
  constructor(
    private voteRepository: IVoteRepository,
    private votingPubSub: IVotingPubSub,
    private redis: IRedis
  ) { }

  async execute(input: VoteOnPollInput) {
    const { pollOptionId, pollId, sessionId } = input;

    if (sessionId) {
      const userPreviousVoteOnPoll = await this
        .voteRepository
        .findPreviousUserVote(pollId, sessionId);

      if (userPreviousVoteOnPoll && userPreviousVoteOnPoll?.pollOptionId !== pollOptionId) {
        await this.voteRepository.delete(userPreviousVoteOnPoll.id);

        const votes = await this.redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId);

        this.votingPubSub.publish(pollId, {
          pollOptionId: userPreviousVoteOnPoll.pollOptionId,
          votes: Number(votes)
        });
      } else if (userPreviousVoteOnPoll?.pollOptionId === pollOptionId) {
        throw new AppError("You already vote on this poll", 409);
      }
    }

    await this.voteRepository.create(sessionId, pollOptionId, pollId);

    const votes = await this.redis.zincrby(pollId, 1, pollOptionId);

    this.votingPubSub.publish(pollId, {
      pollOptionId,
      votes: Number(votes)
    });
  };
}