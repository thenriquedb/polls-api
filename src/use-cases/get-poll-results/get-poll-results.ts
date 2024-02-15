import { IVotingPubSub, Subscriber } from "../../util/voting-pub-sub";

type GetPollResultsInput = {
  pollId: string;
}

export class GetPollResultsUseCase {
  constructor(
    private votingPubSub: IVotingPubSub,
  ) { }

  async execute(input: GetPollResultsInput, subscriber: Subscriber) {
    const { pollId } = input;

    this.votingPubSub.subscribe(pollId, subscriber);
  }
}