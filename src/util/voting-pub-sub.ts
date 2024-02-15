export type Message = { pollOptionId: string, votes: number };
export type Subscriber = (message: Message) => void;

export interface IVotingPubSub {
  subscribe(pollId: string, subscriber: Subscriber): void;
  publish(pollId: string, message: Message): void;
}

export class VotingPubSub implements IVotingPubSub {
  private channels: Record<string, Subscriber[]> = {};
  private static instance: VotingPubSub;

  subscribe(pollId: string, subscriber: Subscriber) {
    if (!this.channels[pollId]) {
      this.channels[pollId] = [];
    }

    this.channels[pollId].push(subscriber);
  }

  publish(pollId: string, message: Message) {
    if (!this.channels[pollId]) {
      return;
    }

    for (const subscriber of this.channels[pollId]) {
      subscriber(message);
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new VotingPubSub();
    }

    return this.instance;
  }
}
export const votingPubSub = new VotingPubSub();